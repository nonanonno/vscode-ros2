import { assert } from 'chai';
import * as path from 'path';
import { testPackages, validateList } from './testHelper';
import { findFilesRecursive, searchPatternRecursive, stem } from '../../ros2/util';


describe('ros2.util.findFilesRecursive', () => {
  const testDir = testPackages.dir;
  const ref = testPackages.listFiles();

  it('find file recursive', () => {
    const ans = findFilesRecursive(testDir);
    assert.isTrue(validateList(ans, ref));
  });

  it('find file recursive absolute', () => {
    const ans = findFilesRecursive(testDir, true);
    assert.isTrue(validateList(ans, ref.map((f) => path.resolve(f))));
  });

});

describe('ros2.util.stem', () => {
  it('get stem', () => {
    assert.equal(stem('hoge/fuga.ext'), 'fuga');
    assert.equal(stem('fuga.ext'), 'fuga');
    assert.equal(stem('fuga'), '');
    assert.equal(stem('hoge/fuga'), '');
  });
});

describe('ros2.util.searchPatternRecursive', () => {
  const testDir = testPackages.dir;

  it('find package.xml', () => {
    const ans = searchPatternRecursive(testDir, /package\.xml/);
    const ref = [
      'ws1/test_package1/package.xml',
      'ws1/test_package2/package.xml',
      'ws2/test_package3/package.xml'
    ];
    assert.isTrue(validateList(ans, ref.map((f) => path.join(testDir, f))));
  });

  it('find package.xml ignoring', () => {
    const ans = searchPatternRecursive(testDir, /package\.xml/, /COLCON_IGNORE/);
    const ref = [
      'ws1/test_package1/package.xml',
      'ws1/test_package2/package.xml'
    ];
    assert.isTrue(validateList(ans, ref.map((f) => path.join(testDir, f))));
  });
});
