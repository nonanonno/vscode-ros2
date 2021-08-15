import { equal } from 'assert';
import * as path from 'path';

// The workspace root is <repository>/server.
export const testPackages = {
  dir: 'src/test/ros2/testPackages',
  pkgs: [
    {
      dir: 'ws1/test_package1',
      name: 'test_package1',
      msgs: ['Test1.msg', 'Test2.msg'],
      files: ['package.xml', 'CMakeLists.txt', 'msg/Test1.msg', 'msg/Test2.msg'],
    },
    {
      dir: 'ws1/test_package2',
      name: 'test_package2',
      msgs: ['Test1.msg'],
      files: ['package.xml', 'CMakeLists.txt', 'msg/Test1.msg']
    },
    {
      dir: 'ws2/test_package3',
      name: 'test_package3',
      msgs: ['Test1.msg'],
      files: ['package.xml', 'CMakeLists.txt', 'msg/Test1.msg']
    }
  ],
  extras: [
    'ws2/COLCON_IGNORE'
  ],
  listFilesAt: function (index: number) {
    const pkg = this.pkgs[index];
    return pkg.files.map((f) => path.join(this.dir, pkg.dir, f));
  },
  listFiles: function () {
    let files: string[] = [];
    for (let i = 0; i < this.pkgs.length; i++) {
      files = files.concat(this.listFilesAt(i));
    }
    files = files.concat(this.extras.map((f) => path.join(this.dir, f)));
    return files;
  }
};

export function validateList<T>(listA: T[], listB: T[], equals = (a: T, b: T) => a === b) {
  let tmpB = listB.slice();
  if (listA.length !== tmpB.length) {
    return false;
  }
  for (const a of listA) {
    for (let i = 0; i < tmpB.length; i++) {
      if (equals(a, tmpB[i])) {
        tmpB.splice(i, 1);
        break;
      }
    }
  }
  return tmpB.length === 0;
}
