import * as vscode from 'vscode';
import { activate, getFixtureUri, openDoc } from '../helper';
import { goToDefinitionCmd, testFiles, rosRoot, createDefinitionLocation, validate } from './helper';
import * as path from 'path';


suite('Go to definition', () => {
  const docUri = getFixtureUri(testFiles.test1);

  test('Can go to std_msgs/Header', async () => {
    await testDefinition(docUri, new vscode.Position(0, 0), [
      createDefinitionLocation(path.join(rosRoot, 'share/std_msgs/msg/Header.msg'))
    ]);
  });
});

async function testDefinition(docUri: vscode.Uri, position: vscode.Position, expected: vscode.Location[]) {
  await activate();

  await openDoc(docUri);

  const actual = (await vscode.commands.executeCommand(goToDefinitionCmd, docUri, position) as vscode.Location[]);

  validate(actual, expected);
}
