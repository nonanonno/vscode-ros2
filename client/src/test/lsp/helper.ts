import * as vscode from 'vscode';
import * as assert from 'assert';
import { activate, openDoc } from '../helper';

export const rosRoot = '/opt/ros/foxy';
export const testFiles = {
  workspace1: 'workspace1',
  test1: 'workspace1/test1_msgs/msg/Test1.msg',
  test2: 'workspace1/test1_msgs/msg/Test2.msg',
  test3: 'workspace1/test2_msgs/msg/Test3.msg',
};

// https://code.visualstudio.com/api/references/commands
export const goToDefinitionCmd = 'vscode.executeDefinitionProvider';

export function createDefinitionLocation(p: string) {
  return new vscode.Location(vscode.Uri.file(p), new vscode.Position(0, 0));
}

export function validate(actual: vscode.Location[], expected: vscode.Location[]) {
  assert.strictEqual(actual.length, expected.length);
  for (let i = 0; i < expected.length; i++) {
    const a = actual[i];
    const e = expected[i];
    assert.strictEqual(a.uri.path, e.uri.path);
    // don't care the range
  }
}

export async function testDefinition(docUri: vscode.Uri, position: vscode.Position, expected: vscode.Location[]) {
  await activate();
  await openDoc(docUri);

  const actual = (await vscode.commands.executeCommand(goToDefinitionCmd, docUri, position) as vscode.Location[]);

  validate(actual, expected);
}
