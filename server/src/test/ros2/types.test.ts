import { assert } from 'chai';

import { identifyTypeKind, isBuiltinType, isNamespacedType } from '../../ros2/types';

describe('ros2.types.isBuintinType', () => {
  it('is builtin type', () => {
    ['bool', 'byte', 'char', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32', 'int64', 'uint64', 'float32', 'float64', 'string', 'wstring'].forEach((t) => {
      assert.isTrue(isBuiltinType(t), `${t} should be builtin type`);
    });

  });
  it('is not builtin type', () => {
    ['hoge', 'Int', 'pkg/hoge'].forEach((t) => {
      assert.isNotTrue(isBuiltinType(t), `${t} should not be builtin type`);
    });
  });
});

describe('ros2.types.isNamespaceType', () => {
  it('is namespaced type', () => {
    assert.isTrue(isNamespacedType('pkg/Typename'));
  });
  it('is not namespaced type', () => {
    assert.isNotTrue(isNamespacedType('Typename'));
    assert.isNotTrue(isNamespacedType('bool'));
  });
});

describe('ros2.types.identifyTypeKind', () => {
  it('identify', () => {
    assert.equal(identifyTypeKind('bool'), 'builtin');
    assert.equal(identifyTypeKind('pkg/Typename'), 'package');
    assert.equal(identifyTypeKind('Typename'), 'this');
  });
});
