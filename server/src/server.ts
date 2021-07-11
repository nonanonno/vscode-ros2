import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  Location
} from 'vscode-languageserver/node';

import { Server } from './ros2/server';

const connection = createConnection(ProposedFeatures.all);

const server = new Server(connection);

connection.listen();

