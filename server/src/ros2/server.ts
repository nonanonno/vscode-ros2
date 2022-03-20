import {
  ClientCapabilities,
  DefinitionParams,
  DidChangeConfigurationNotification,
  InitializeResult,
  Location,
  Position,
  Range,
  TextDocumentSyncKind,
  _Connection,
} from 'vscode-languageserver';
import { DocumentManager } from './documentManager';
import { identifyTypeKind, packageAndType } from './types';
import { Package } from './package';
import { URI } from 'vscode-uri';
import { findRos2 } from './env';

interface Capabilities {
  hasConfiguration: boolean;
  hasWorkspaceFolder: boolean;
  hasDiagnosticRelatedInformation: boolean;
}

interface Settings {
  rosRootDir: string | undefined;
  additionalSearchDirs: string[];
  skipColconIgnore: boolean;
}

const defaultSettings = {
  rosRootDir: undefined,
  additionalSearchDirs: [],
  skipColconIgnore: true,
};

export class Server {
  capabilities: Capabilities;
  documentManager: DocumentManager;
  globalSettings: Settings = defaultSettings;
  settings: Map<string, Thenable<Settings>> = new Map();

  constructor(private connection: _Connection) {
    this.capabilities = {
      hasConfiguration: false,
      hasWorkspaceFolder: false,
      hasDiagnosticRelatedInformation: false,
    };

    connection.onInitialize((param) => {
      return this.solveCapabilities(param.capabilities);
    });

    connection.onInitialized(() => {
      if (this.capabilities.hasConfiguration) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
      }
    });

    this.documentManager = new DocumentManager(connection);

    connection.onDefinition((handle) => this.searchDefinition(handle));

    connection.onDidChangeConfiguration((change) => {
      if (this.capabilities.hasConfiguration) {
        this.settings.clear();
      } else {
        this.globalSettings = <Settings>(change.settings.ros2 || defaultSettings);
        this.globalSettings.rosRootDir = findRos2(this.globalSettings.rosRootDir);
      }
    });
  }

  solveCapabilities(cap: ClientCapabilities): InitializeResult {
    this.capabilities = {
      hasConfiguration: !!(cap.workspace && !!cap.workspace.configuration),
      hasWorkspaceFolder: !!(cap.workspace && cap.workspace.workspaceFolders),
      hasDiagnosticRelatedInformation: !!(
        cap.textDocument &&
        cap.textDocument.publishDiagnostics &&
        cap.textDocument.publishDiagnostics.relatedInformation
      ),
    };

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        definitionProvider: true,
        workspace: {
          workspaceFolders: {
            supported: this.capabilities.hasWorkspaceFolder,
          },
        },
      },
    };
  }

  async searchDefinition(handle: DefinitionParams) {
    const ret: Location[] = [];
    const range = Range.create(Position.create(0, 0), Position.create(0, 0));

    const tokenized = this.documentManager.uriTokenized.get(handle.textDocument.uri);
    if (!tokenized) {
      return;
    }
    const typeToken = tokenized.at(handle.position);
    if (!typeToken || !typeToken.isType) {
      return;
    }
    const kind = identifyTypeKind(typeToken.token.value);
    switch (kind) {
      case 'builtin':
        break;
      case 'this':
        const thisPackage = Package.fromContentUri(handle.textDocument.uri);
        if (thisPackage) {
          for (const msg of thisPackage.getMessages()) {
            if (typeToken.token.value === msg.name) {
              ret.push(Location.create(msg.path, range));
            }
          }
        }
        break;
      case 'package':
        const settings = await this.getSettings(handle.textDocument.uri);

        // search in workspace
        if (this.capabilities.hasWorkspaceFolder) {
          const folders = await this.connection.workspace.getWorkspaceFolders();
          if (folders) {
            for (const folder of folders) {
              for (const msg of this.searchNamespacedType(
                typeToken.token.value,
                URI.parse(folder.uri).path,
                settings.skipColconIgnore
              )) {
                ret.push(Location.create(msg.path, range));
              }
            }
          }
        }

        // additional search directory
        for (const dir of settings.additionalSearchDirs) {
          for (const msg of this.searchNamespacedType(typeToken.token.value, dir, settings.skipColconIgnore)) {
            ret.push(Location.create(msg.path, range));
          }
        }

        // ros2 root dir
        if (settings.rosRootDir) {
          for (const msg of this.searchNamespacedType(
            typeToken.token.value,
            settings.rosRootDir,
            settings.skipColconIgnore
          )) {
            ret.push(Location.create(msg.path, range));
          }
        }
        break;
    }
    return ret;
  }

  searchNamespacedType(typename: string, dir: string, skipColconIgnore: boolean) {
    const pkgType = packageAndType(typename);
    if (!pkgType) {
      return [];
    }
    const packages = Package.searchAtPath(dir, skipColconIgnore);
    let ret = [];
    for (const pkg of packages) {
      if (!pkg || pkgType.pkg !== pkg.name) {
        continue;
      }
      for (const msg of pkg.getMessages()) {
        if (pkgType.type === msg.name) {
          ret.push(msg);
          break;
        }
      }
    }
    return ret;
  }

  getSettings(resource: string) {
    if (!this.capabilities.hasConfiguration) {
      return Promise.resolve(this.globalSettings);
    }
    let result = this.settings.get(resource);
    if (!result) {
      result = this.connection.workspace.getConfiguration({
        scopeUri: resource,
        section: 'ros2',
      });
      result = result.then((settings) => {
        settings.rosRootDir = findRos2(settings.rosRootDir);
        return settings;
      });

      this.settings.set(resource, result);
    }
    return result;
  }
}
