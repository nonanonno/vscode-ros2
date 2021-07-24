import { TextDocuments, _Connection } from 'vscode-languageserver';
import {
  Position,
  TextDocument,
} from 'vscode-languageserver-textdocument';
import {
  createLineTokenizer,
  Token
} from './interfaces_';

class Tokenized {
  constructor(public tokens: Token[][]) { }

  at(position: Position) {
    const line = this.tokens[position.line];
    for (let i = 0; i < line.length; i++) {
      const tmp = line[i];
      if (tmp.start <= position.character && position.character < tmp.start + tmp.length) {
        // The first identifier of the line is type.
        return {
          isType: tmp.kind === 'identifier' && i === 0,
          token: tmp
        };
      }
    }
  }
}

export class DocumentManager {
  documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
  uriTokenized: Map<string, Tokenized> = new Map();

  tokenizer = createLineTokenizer();

  constructor(connection: _Connection) {
    this.documents.listen(connection);
    this.documents.onDidChangeContent(change => {
      const text = change.document.getText();
      const token: Token[][] = [];
      text.split('\n').forEach(line => {
        this.tokenizer.input(line);
        token.push(this.tokenizer.tokens);
        this.tokenizer.clear();
      });
      this.uriTokenized.set(change.document.uri, new Tokenized(token));
    });
  }
}
