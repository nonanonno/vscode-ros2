import * as path from 'path';

export function getDocPath(p: string) {
  return path.resolve(__dirname, '../../testFixture', p);
}
