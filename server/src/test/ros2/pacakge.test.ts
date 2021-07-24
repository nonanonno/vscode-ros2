import { assert } from 'chai';
import * as path from 'path';
import { testPackages, validateList } from './testHelper';
import { Package } from '../../ros2/package';
import { stem } from '../../ros2/util';

function msgEquals(a: { name: string, path: string }, b: { name: string, path: string }) {
  return a.name === b.name && a.path === b.path;
}

describe('ros2.package.Package', () => {
  const testDir = testPackages.dir;
  const testPkg = testPackages.pkgs[0];

  it('create an instance', () => {
    const pkg = new Package(path.join(testDir, testPkg.dir));

    assert.equal(pkg.path, path.join(testDir, testPkg.dir));
    assert.equal(pkg.name, testPkg.name);

    const ref = testPkg.msgs.map((m) => {
      return { name: stem(m), path: path.join(testDir, testPkg.dir, 'msg', m) };
    });

    const ans = pkg.getMessages();

    assert.isTrue(validateList(ans, ref, msgEquals));
  });

  it('fromContentPath', () => {
    const pkg = Package.fromContentPath(path.join(testDir, testPkg.dir, 'msg', testPkg.msgs[0]));

    if (pkg) {
      assert.equal(pkg.path, path.join(testDir, testPkg.dir));
      assert.equal(pkg.name, testPkg.name);

      const ref = testPkg.msgs.map((m) => {
        return { name: stem(m), path: path.join(testDir, testPkg.dir, 'msg', m) };
      });

      const ans = pkg.getMessages();
      assert.isTrue(validateList(ans, ref, msgEquals));
    } else {
      assert.fail();
    }
  });

  it('fromContentPath not found', () => {
    assert.isUndefined(Package.fromContentPath('unknown/path'));
    assert.isUndefined(Package.fromContentPath('/unknown/path'));
  });

  it('fromContentUri', () => {
    const absP = path.resolve(testDir, testPkg.dir, 'msg', testPkg.msgs[0]);
    const uri = 'file://' + absP;
    const pkg = Package.fromContentUri(uri);

    if (pkg) {
      assert.equal(pkg.path, path.resolve(testDir, testPkg.dir));
      assert.equal(pkg.name, testPkg.name);
    } else {
      assert.fail();
    }
  });
});
