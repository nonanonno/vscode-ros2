import * as vscode from 'vscode';
import { getFixturePath, getFixtureUri } from '../helper';
import { testFiles, rosRoot, createDefinitionLocation, testDefinition } from './helper';
import * as path from 'path';


suite('Go to definition (folder)', () => {
  test('Can go to std_msgs/Header', async () => {
    await testDefinition(getFixtureUri(testFiles.test1), new vscode.Position(0, 0), [
      createDefinitionLocation(path.join(rosRoot, 'share/std_msgs/msg/Header.msg'))
    ]);
  });

  test('Cannot go to definition with string', async () => {
    await testDefinition(getFixtureUri(testFiles.test1), new vscode.Position(1, 0), []);
  });

  test('Can go to Test1 in the same package', async () => {
    await testDefinition(getFixtureUri(testFiles.test2), new vscode.Position(1, 0), [
      createDefinitionLocation(getFixturePath(testFiles.test1))]);
  });

  test('Can go to Test1 in the other package', async () => {
    await testDefinition(getFixtureUri(testFiles.test3), new vscode.Position(2, 0), [
      createDefinitionLocation(getFixturePath(testFiles.test1))]);
  });
});

