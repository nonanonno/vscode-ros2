import { ExtensionContext } from 'vscode';
import { Client as LspClient } from './lsp/client';

let lspClient: LspClient;

export function activate(context: ExtensionContext) {
  lspClient = new LspClient(context);
  lspClient.activate();
}

export function deactivate(): Thenable<void> | undefined {
  if (!lspClient) {
    return undefined;
  }
  return lspClient.deactivate();
}
