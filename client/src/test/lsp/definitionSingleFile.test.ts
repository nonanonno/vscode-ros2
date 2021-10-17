import * as vscode from 'vscode';
import { getFixtureUri } from '../helper';
import { testFiles, rosRoot, createDefinitionLocation, testDefinition } from './helper';
import * as path from 'path';


suite('Go to definition (single file)', () => {
  test('Can go to std_msgs/Header', async () => {
    await testDefinition(getFixtureUri(testFiles.test1), new vscode.Position(0, 0), [
      createDefinitionLocation(path.join(rosRoot, 'share/std_msgs/msg/Header.msg'))
    ]);
  });

  test('Cannot go to definition with string', async () => {
    await testDefinition(getFixtureUri(testFiles.test1), new vscode.Position(1, 0), []);
  });
});

