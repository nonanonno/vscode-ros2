import { ExtensionContext, workspace, Disposable, tasks } from 'vscode';
import * as path from 'path';
import { ServerOptions, TransportKind, LanguageClient, LanguageClientOptions } from 'vscode-languageclient/node';
import { ColconTaskProvider } from './colcon/taskProvider';

let client: LanguageClient;
let colconTaskProvider: Disposable | undefined;

export function activate(context: ExtensionContext) {
  // Activate language server
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

  // Activate task
  colconTaskProvider = tasks.registerTaskProvider(ColconTaskProvider.colconType, new ColconTaskProvider());
}

export function deactivate(): Thenable<void> | undefined {
  if (colconTaskProvider) {
    colconTaskProvider.dispose();
  }
  if (!client) {
    return undefined;
  }
  return client.stop();
}
