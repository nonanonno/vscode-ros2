import { assert } from 'chai';
import * as ros from '../../env/ros';
import * as helper from '../testHelper';


suite('env.ros.sourceFile', async () => {
  test('source', async () => {
    const config = await ros.getSourcedEnv(helper.getDocPath('env.bash'));
    assert.equal(config.HOGE, 'hoge');
  });
});
