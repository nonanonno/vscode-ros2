import { assert } from 'chai';

import {
  Tokenizer,
  TokenKind,
  Token,
  createLineTokenizer
} from '../../ros2/interfaces_';

describe('ros2.interfaces_.Tokenizer', () => {
  it('word as identifier', () => {
    let t = new Tokenizer();

    t.addRule(/[a-zA-Z]+/, (cxt, match) => {
      cxt.accept('identifier', match[0]);
    });
    t.input('abc');
    const tokens = t.tokens;

    assert.equal(tokens.length, 1);
    assert.deepEqual(tokens[0], { kind: 'identifier', value: 'abc', start: 0, length: 3 });
  });

  it('multiple rules (word and space)', () => {
    let t = new Tokenizer();

    t.addRule(/[a-zA-Z]+/, (cxt, match) => {
      cxt.accept('identifier', match[0]);
    });
    // Use 'separator' tentatively
    t.addRule(/ +/, (cxt, match) => {
      cxt.accept('separator', match[0]);
    });

    t.input('abc def');
    const tokens = t.tokens;

    assert.equal(tokens.length, 3);
    assert.deepEqual(tokens[0], { kind: 'identifier', value: 'abc', start: 0, length: 3 });
    assert.deepEqual(tokens[1], { kind: 'separator', value: ' ', start: 3, length: 1 });
    assert.deepEqual(tokens[2], { kind: 'identifier', value: 'def', start: 4, length: 3 });
  });

  it('fail', () => {
    let t = new Tokenizer();

    t.addRule(/[a-zA-Z]+/, (cxt, match) => {
      cxt.accept('identifier', match[0]);
    });

    assert.throw(() => { t.input('abc def'); });
  });
});


describe('ros2.interfaces_.createLineTokenizer', () => {
  const doTest = (text: string, expects: Token[]) => {
    let t = createLineTokenizer();
    t.input(text);
    const tokens = t.tokens;
    assert.equal(tokens.length, expects.length, 'invalid tokens number');
    for (let i = 0; i < tokens.length; i++) {
      assert.deepEqual(tokens[i], expects[i]);
    }
  };

  const token = (kind: TokenKind, value: string, start: number, extra = 0): Token => {
    return { kind: kind, value: value, start: start, length: value.length + extra };
  };

  it('identifier,symbol,number,comment', () => {
    doTest('float32[<=3] x [-1.0, 0.0, 1e-1] # comment', [
      token('identifier', 'float32', 0),
      token('symbol', '[', 7),
      token('symbol', '<=', 8),
      token('number', '3', 10),
      token('symbol', ']', 11),
      token('identifier', 'x', 13),
      token('symbol', '[', 15),
      token('number', '-1.0', 16),
      token('symbol', ',', 20),
      token('number', '0.0', 22),
      token('symbol', ',', 25),
      token('number', '1e-1', 27),
      token('symbol', ']', 31),
      token('comment', '# comment', 33)
    ]);
  });
  it('identifier,string', () => {
    doTest('string str "Hello World #3"', [
      token('identifier', 'string', 0),
      token('identifier', 'str', 7),
      token('string', 'Hello World #3', 11, 2) // '"' x2
    ]);
  });
  it('separator', () => {
    doTest('---', [token('separator', '---', 0)]);
  });
});
