import { ExtensionContext, workspace, Disposable, tasks } from 'vscode';
import { ColconTaskProvider } from './colcon/taskProvider';

import { activateRosInterfaceClient, deactivateRosInterfaceClient } from './lsp/client';
let colconTaskProvider: Disposable | undefined;

export function activate(context: ExtensionContext) {
  // Activate language server
  activateRosInterfaceClient(context);

  // Activate task
  colconTaskProvider = tasks.registerTaskProvider(ColconTaskProvider.colconType, new ColconTaskProvider());
}

export function deactivate(): Thenable<void> | undefined {
  if (colconTaskProvider) {
    colconTaskProvider.dispose();
  }
  return deactivateRosInterfaceClient();
}
