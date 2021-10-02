# Development note

## Setup

`.devccontainer/Dockerfile` を使用することをお勧めする。[https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack](Remote Development) を入れていれば vscode でプロジェクトを開いた際に Docker で開き直すか聞かれるので、それに従えば良い。

## Build

1. 依存パッケージをインストール

```shell
npm install
```

2. ビルド

コマンドパレットより `Tasks: Run Build Task` を実行すると `npm watch` が実行される。これが動いている間はファイル変更を検知して自動でリビルドされるため、一度やっておけば良い。


## Test

```shell
npm test
```

テスト用の vscode がダウンロードされ、実行されることに注意

## Debug

サイドバーの Run and Debug より、`Client + Server` を選択して実行する。デバッグ用の vscode が起動する。

LSPサーバがあり、これをデバッグするために `+ Server` がある。サーバのデバッグが不要であれば `Extension` を選択すれば良い。

## Release

Github actions に組み込んでいるので タグを打てば良い。その際、各 `package.json` の `version` が正しいことを確認する必要あり。

