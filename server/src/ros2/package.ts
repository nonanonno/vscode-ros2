import { URI } from 'vscode-uri';
import { findFilesRecursive, searchPatternRecursive, stem } from './util';
import * as xpath from 'xpath';
import { DOMParser } from 'xmldom';
import * as fs from 'fs';
import * as path from 'path';

export class Package {
  /**
   * package name.
   */
  name: string | undefined;
  /**
   * package path.
   */
  path: string;

  /**
   * Creates a new ROS2 package representation.
   * 
   * @param p A path to the package.
   */
  constructor(p: string) {
    this.path = p;
    const doc = new DOMParser().parseFromString(fs.readFileSync(path.join(p, 'package.xml')).toString());
    const select = xpath.useNamespaces({});
    const name = select('/package/name/text()', doc, true);
    if (name) {
      this.name = name.toString();
    } else {
      this.name = undefined;
    }
  }

  /**
   * Gets messages of the package.
   */
  getMessages() {
    return findFilesRecursive(this.path).filter(file =>
      file.endsWith('.msg')).map(msg => {
        return { name: stem(msg), path: msg };
      });
  }

  /**
   * Creates a Package from the content path.
   * 
   * @param p A path to the content.
   */
  static fromContentPath(p: string) {
    let dir = path.dirname(p);
    while (dir) {
      if (fs.existsSync(path.join(dir, 'package.xml'))) {
        return new Package(path.join(dir));
      }
      if (dir === '/' || dir === '.') {
        break;
      }
      dir = path.dirname(dir);
    }
  }

  /**
   * Creates a Package from the content uri.
   * 
   * @param uri An uri to the content.
   */
  static fromContentUri(uri: string) {
    return this.fromContentPath(URI.parse(uri).path);
  }

  static searchAtPath(p: string, skipColconIgnore: boolean) {
    const packages = searchPatternRecursive(p, /package\.xml/, skipColconIgnore ? /COLCON_IGNORE/ : undefined);
    return packages.map((p) => this.fromContentPath(p));
  }
}
