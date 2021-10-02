import { ExtensionContext } from 'vscode';
import { ServerOptions, TransportKind, LanguageClient, LanguageClientOptions } from 'vscode-languageclient/node';
import * as path from 'path';

let client: LanguageClient;

export function activateRosInterfaceClient(context: ExtensionContext) {
  let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'ros2.interface' }],
  };

  client = new LanguageClient(
    'ros2Interface',
    'ROS2 Interface',
    serverOptions,
    clientOptions
  );
  client.start();
}


export function deactivateRosInterfaceClient(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
