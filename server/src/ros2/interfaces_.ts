export type TokenKind = 'identifier' | 'number' | 'string' | 'symbol' | 'comment' | 'separator';

export type Token = {
  kind: TokenKind;
  value: string;
  start: number;
  length: number;
};

class Context {
  tokens: Token[] = [];
  start = 0;
  length = 0;

  accept(kind: TokenKind, value: string) {
    this.tokens.push({
      kind: kind,
      value: value,
      start: this.start,
      length: this.length
    });
  }

  clear() {
    this.tokens = [];
    this.start = 0;
    this.length = 0;
  }
}

export type Action = (cxt: Context, match: RegExpExecArray) => void;


type Rule = {
  re: RegExp;
  action: Action;
};

export class Tokenizer {
  private cxt = new Context();
  private rules: Rule[] = [];
  public doDebug = false;

  addRule(re: RegExp, action: Action) {
    this.rules.push({ re: re, action: action });
  }

  input(text: string) {
    let line = text;
    loop: while (line.length > 0) {
      for (const rule of this.rules) {
        const m = rule.re.exec(line);
        if (this.doDebug) {
          console.log(`checks ${rule.re} with '${line}'`);
        }
        if (m && m.index === 0) {
          if (this.doDebug) {
            console.log(m);
          }
          this.cxt.length = m[0].length;
          rule.action(this.cxt, m);
          line = line.substr(this.cxt.length);
          this.cxt.start += this.cxt.length;
          continue loop;
        }
      }
      throw new Error(`Missing appropriate rule for ${text}`);
    }
  }

  clear() {
    this.cxt.clear();
  }

  get tokens() {
    return this.cxt.tokens;
  }
}

export function createLineTokenizer() {
  const tokenizer = new Tokenizer();

  tokenizer.addRule(/[a-zA-Z][a-zA-Z0-9_/]*/, (cxt, match) => {
    cxt.accept("identifier", match[0]);
  });
  tokenizer.addRule(/[+-]?[0-9]*\.?[0-9]+([eE][+-]?\d+)?/, (cxt, match) => {
    cxt.accept("number", match[0]);
  });
  tokenizer.addRule(/"(.*?)"/, (cxt, match) => {
    cxt.accept("string", match[1]);
  });
  tokenizer.addRule(/'(.*?)'/, (cxt, match) => {
    cxt.accept("string", match[1]);
  });
  [/<=/, /\[/, /\]/, /,/, /=/].forEach((re) => {
    tokenizer.addRule(re, (cxt, match) => {
      cxt.accept("symbol", match[0]);
    });
  });
  tokenizer.addRule(/#.*$/, (cxt, match) => {
    cxt.accept("comment", match[0]);
  });
  tokenizer.addRule(/-+/, (cxt, match) => {
    cxt.accept("separator", match[0]);
  });

  tokenizer.addRule(/( |\t)+/, (cxt, match) => {
    return;
  });
  // no match
  tokenizer.addRule(/./, (cxt, match) => {
    console.warn("Failed to tokenize ", match);
  });

  return tokenizer;
}
