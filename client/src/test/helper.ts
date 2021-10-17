import * as vscode from 'vscode';
import * as path from 'path';

const extensionId = 'nonanonno.vscode-ros2';

export async function activate() {
  const ext = vscode.extensions.getExtension(extensionId)!;
  await ext.activate();
}

export async function openDoc(docUri: vscode.Uri) {
  try {
    let doc = await vscode.workspace.openTextDocument(docUri);
    await vscode.window.showTextDocument(doc);
    await sleep(2000); // Wait for server activation

  } catch (e) {
    console.error(e);
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFixturePath(p: string) {
  return path.resolve(__dirname, '../../testFixture', p);
}

export function getFixtureUri(p: string) {
  return vscode.Uri.file(getFixturePath(p));
}

