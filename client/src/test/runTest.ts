import * as path from 'path';
import { runTests } from 'vscode-test';

async function runIndex(index: string, launchArgs?: string[]) {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
    const extensionTestsPath = path.resolve(__dirname, index);
    await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: launchArgs });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

async function main() {
  await runIndex('./indexSingleFile');
  await runIndex('./indexFolder', [path.resolve(__dirname, '../../testFixture', 'workspace1')]);
}

main();
