import { getSourcedEnv } from '../env';
import { getExtensionConfiguration, getOutputChannel } from '../vscodeUtil';
import * as path from 'path';
import * as fs from 'fs';

export async function findRos2() {
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
