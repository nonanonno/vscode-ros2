import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from '../helper';

suite('Go to definition', () => {
  const docUri = getDocUri('workspace1/test1_msgs/msg/Test1.msg');

  test('Can go to std_msgs/Header', async () => {
    await testDefinition(docUri, new vscode.Position(0, 0), [
      new vscode.Location(vscode.Uri.file('/opt/ros/foxy/share/std_msgs/msg/Header.msg'), new vscode.Position(0, 0))
    ]);
  });
});

async function testDefinition(docUri: vscode.Uri, position: vscode.Position, expected: vscode.Location[]) {
  await activate(docUri);

  const actual = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', docUri, position) as vscode.Location[]);

  assert.ok(actual.length === expected.length);
  for (let i = 0; i < expected.length; i++) {
    const a = actual[i];
    const e = expected[i];
    assert.strictEqual(a.uri.path, e.uri.path);
    assert.deepStrictEqual(a.range, e.range);
  }

}
