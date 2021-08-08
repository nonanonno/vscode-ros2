import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

export class ColconTaskProvider implements vscode.TaskProvider {
  static colconType = 'colcon';
  private colconPromise: Thenable<vscode.Task[]> | undefined = undefined;

  public provideTasks(): Thenable<vscode.Task[]> | undefined {
    if (!this.colconPromise) {
      this.colconPromise = getColconTasks();
    }
    return this.colconPromise;
  }

  public resolveTask(_task: vscode.Task): vscode.Task | undefined {
    const definition: ColconTaskDefinition = <any>_task.definition;

    return createBuildTask(definition, _task.scope ?? vscode.TaskScope.Workspace);
  }
}

interface ColconTaskDefinition extends vscode.TaskDefinition {
  workspace?: string,
  args?: string[]

}

interface ColconTargetPackage {
  package: string,
  workspace?: string,
  codeFolder?: vscode.WorkspaceFolder
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel('Colcon Auto Detect');
  }
  return _channel;
}

function exec(command: string, options: cp.ExecOptions): Promise<{ stdout: string, stderr: string }> {
  return new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

async function getColconPackages(): Promise<ColconTargetPackage[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return [];
  }
  const result: ColconTargetPackage[] = [];
  for (const workspaceFolder of workspaceFolders) {
    const commandLine = `colcon list -n`;
    try {
      const { stdout, stderr } = await exec(commandLine, { cwd: workspaceFolder.uri.fsPath });
      if (stderr && stderr.length > 0) {
        getOutputChannel().appendLine(stderr);
        getOutputChannel().show(true);
      }
      if (stdout) {
        const lines = stdout.trim().split(/\n/);
        for (const line of lines) {
          result.push({
            package: line,
            codeFolder: workspaceFolder
          });
        }
      }
    } catch (err) {
      const channel = getOutputChannel();
      if (err.stderr) {
        channel.appendLine(err.stderr);
      }
      if (err.stdout) {
        channel.appendLine(err.stdout);
      }
      channel.appendLine('Auto detecting colcon packages failed.');
      channel.show();
    }
  }
  return result;
}

function createBuildTask(task: ColconTaskDefinition, scope: vscode.WorkspaceFolder | vscode.TaskScope) {
  const args = task.args ? task.args.join(' ') : undefined;
  const cwd = task.workspace ?? '.';
  const name = `build ${args ?? 'ALL'} (@ ${cwd})`;
  const t = new vscode.Task(
    task,
    scope,
    name,
    'colcon',
    new vscode.ShellExecution(`cd ${cwd} && colcon build ${args ?? ''}`));
  t.group = vscode.TaskGroup.Build;
  return t;
}


async function getColconTasks(): Promise<vscode.Task[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const result: vscode.Task[] = [];
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return result;
  }
  for (const workspaceFolder of workspaceFolders) {
    const folderString = workspaceFolder.uri.fsPath;
    if (!folderString) {
      continue;
    }
    const kind: ColconTaskDefinition = {
      type: 'colcon'
    };
    result.push(createBuildTask(kind, workspaceFolder));
  }

  const packages = await getColconPackages();
  for (const pkg of packages) {
    if (pkg.codeFolder) {
      result.push(createBuildTask({
        type: 'colcon',
        args: [
          '--packages-select',
          pkg.package
        ]
      },
        pkg.codeFolder
      ));
    }
  }
  return result;
}
