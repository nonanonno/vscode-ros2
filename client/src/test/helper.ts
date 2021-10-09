import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;


export async function activate(docUri: vscode.Uri) {
  const ext = vscode.extensions.getExtension('nonanonno.vscode-ros2')!;
  await ext.activate();
  try {
    doc = await vscode.workspace.openTextDocument(docUri);
    editor = await vscode.window.showTextDocument(doc);

  } catch (e) {
    console.error(e);
  }
}

export function getDocPath(p: string) {
  return path.resolve(__dirname, '../../testFixture', p);
}

export function getDocUri(p: string) {
  return vscode.Uri.file(getDocPath(p));
}

