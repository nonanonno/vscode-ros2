import * as path from 'path';
import { ExtensionContext } from 'vscode';
import { ServerOptions, TransportKind, LanguageClient, LanguageClientOptions } from 'vscode-languageclient/node';

export class Client {
  SERVER_PATH = path.join('server', 'out', 'server.js');
  DEBUG_OPTIONS = ['--nolazy', '--inspect=6009'];
  LANGUAGE = { language: 'ros2.interface', id: 'ros2Interface', name: 'ROS2 Interface' };

  client: LanguageClient;

  constructor(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(this.SERVER_PATH)
    let debugOptions = { execArgv: this.DEBUG_OPTIONS }
    let serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: {
        module: serverModule,
        transport: TransportKind.ipc,
        options: debugOptions
      }
    };

    let clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: this.LANGUAGE.language }]
    };
    this.client = new LanguageClient(this.LANGUAGE.id, this.LANGUAGE.name, serverOptions, clientOptions);
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
