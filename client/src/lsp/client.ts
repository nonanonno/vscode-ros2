import * as path from 'path';
import { ExtensionContext } from 'vscode';
import { ServerOptions, TransportKind, LanguageClient, LanguageClientOptions } from 'vscode-languageclient/node';

export class Client {
  static readonly serverPath = path.join('server', 'out', 'server.js');
  static readonly debugOptions = ['--nolazy', '--inspect=6009'];
  static readonly language = { language: 'ros2.interface', id: 'ros2Interface', name: 'ROS2 Interface' };

  client: LanguageClient;

  constructor(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(Client.serverPath);
    let debugOptions = { execArgv: Client.debugOptions };
    let serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: {
        module: serverModule,
        transport: TransportKind.ipc,
        options: debugOptions
      }
    };

    let clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: Client.language.language }]
    };
    this.client = new LanguageClient(Client.language.id, Client.language.name, serverOptions, clientOptions);
  }

  activate() {
    this.client.start();
  }

  deactivate(): Thenable<void> | undefined {
    if (!this.client) {
      return undefined;
    }
    return this.client.stop();
  }
}
