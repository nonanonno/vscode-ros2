import * as path from 'path';
import * as fs from 'fs';

const _defaultRoot = '/opt/ros';
const _rosCandidates = ['rolling', 'galactic', 'foxy'];
const _setup = 'setup.bash';

export function findRos2(supplied: string | undefined): string | undefined {
  const candidates: string[] = [];
  if (supplied) {
    candidates.push(supplied);
  } else {
    for (const distro of _rosCandidates) {
      candidates.push(path.join(_defaultRoot, distro));
    }
  }

  for (const candidate of candidates) {
    const tmp = path.join(candidate, _setup);
    if (fs.existsSync(tmp)) {
      return candidate;
    }
  }
}
