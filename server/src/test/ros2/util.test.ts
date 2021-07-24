import { assert } from 'chai';
import * as path from 'path';
import { testPackages, validateList } from './testHelper';
import { findFilesRecursive, stem } from '../../ros2/util';


describe('ros.util.findFilesRecursive', () => {
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
