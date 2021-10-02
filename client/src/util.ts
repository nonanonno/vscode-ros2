import * as vscode from 'vscode';

let _channel: vscode.OutputChannel;

export function getOutputChannel() {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel('ROS2');
  }
  return _channel;
}

export function getExtensionConfiguration() {
  return vscode.workspace.getConfiguration('ros2');
}
