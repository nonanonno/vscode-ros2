import * as cp from 'child_process';
import * as dotenv from 'dotenv';
import { getOutputChannel } from './vscodeUtil';

export function getSourcedEnv(filename: string, env?: any): Promise<any> | undefined {
  if (isLinux()) {
    return new Promise((resolve, reject) => {
      let exportEnvCommand = `sh -c "source '${filename}' && env"`;
      cp.exec(exportEnvCommand, { env: env }, (error, stdout, stderr) => {
        if (!error) {
          resolve(
            dotenv.parse(stdout)
          );
        } else {
          reject(error);
        }
      });
    });
  } else {
    getOutputChannel().appendLine('Support only linux');
    getOutputChannel().show();
    return;
  }
}

export function isWindows() {
  return process.platform === 'win32';
}

export function isMac() {
  return process.platform === 'linux';
}

export function isLinux() {
  return process.platform === 'linux';
}
