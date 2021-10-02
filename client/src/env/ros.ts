import * as path from 'path';
import { exec } from 'child_process'
import * as dotenv from 'dotenv';
import { getExtensionConfiguration, getOutputChannel } from '../util';
import * as fs from 'fs';

export function getSourcedEnv(filename: string, env?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let exportEnvCommand = `bash -c "source '${filename}' && env"`;
    exec(exportEnvCommand, { env: env }, (error, stdout, stderr) => {
      if (!error) {
        resolve(
          dotenv.parse(stdout)
        );
      } else {
        reject(error);
      }
    });
  });
}

export async function findRos2(setup?: string) {
  const vscodeConfig = getExtensionConfiguration();
  const rosRoot = vscodeConfig.get('rosRootDir', undefined);
  if (!rosRoot) {
    getOutputChannel().appendLine('rosRootDir is not configured');
    getOutputChannel().show();
    return
  }

  const setupScript = path.join(rosRoot, 'setup.bash')
  if (!fs.existsSync(setupScript)) {
    getOutputChannel().appendLine(`${setupScript} not found`);
    getOutputChannel().show();
    return;
  }

  const env = await getSourcedEnv(setupScript);

  return {
    root: rosRoot,
    env: env
  };
}
