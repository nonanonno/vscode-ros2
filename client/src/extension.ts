import { ExtensionContext, workspace } from 'vscode';
import * as path from 'path';
import { ServerOptions, TransportKind, LanguageClient, LanguageClientOptions } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
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
  console.log('Start client');
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
