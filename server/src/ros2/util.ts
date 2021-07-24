import * as fs from 'fs';
import * as path from 'path';

function _listFilesRecursive(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(dirent =>
    dirent.isFile() ? [`${dir}/${dirent.name}`] : _listFilesRecursive(`${dir}/${dirent.name}`));
}
export function findFilesRecursive(dir: string, absolute = false) {
  const files = _listFilesRecursive(dir);

  if (absolute) {
    return files.map((f) => path.resolve(f));
  } else {
    return files;
  }
}

export function stem(name: string) {
  const base = path.basename(name);
  const m = /(.+)\.\w*$/.exec(base);
  if (m) {
    return m[1];
  }
  return "";
}


function _searchPatternRecursive(dir: string, pattern: RegExp, skipIf: RegExp | undefined = undefined): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  if (skipIf) {
    for (const dirent of dirents) {
      if (skipIf.test(path.basename(dirent.name))) {
        return [];
      }
    }
  }
  return dirents.flatMap(dirent => {
    if (pattern.test(dirent.name)) {
      return [path.join(dir, dirent.name)];
    }
    if (dirent.isDirectory()) {
      return _searchPatternRecursive(path.join(dir, dirent.name), pattern, skipIf);
    }
    return [];
  });
}


export function searchPatternRecursive(dir: string, pattern: RegExp, skipIf: RegExp | undefined = undefined, absolute = false) {
  const m = _searchPatternRecursive(dir, pattern, skipIf);

  if (absolute) {
    return m.map((f) => path.resolve(f));
  } else {
    return m;
  }
}
