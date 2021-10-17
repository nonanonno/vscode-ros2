import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });
  mocha.timeout(10000);

  const testRoot = __dirname;

  return new Promise((resolve, reject) => {
    glob('**/*SingleFile.test.js', { cwd: testRoot }, (err, files) => {
      if (err) {
        return reject(err);
      }
      files.forEach(f => mocha.addFile(path.resolve(testRoot, f)));

      try {
        mocha.run(failures => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}
