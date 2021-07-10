import { ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
  console.log("Hello World");
}

export function deactivate(): Thenable<void> | undefined {
  return undefined;
}
