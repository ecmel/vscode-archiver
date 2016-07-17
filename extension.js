// (c) 2016 Ecmel Ercan

var vscode = require('vscode');
var archiver = require('archiver');
var parse = require('parse-gitignore');
var fs = require('fs');
var path = require('path')

function activate(context) {

  var disposable = vscode.commands.registerCommand('extension.archive', function () {

    var rootPath = vscode.workspace.rootPath;

    if (!rootPath) {
      vscode.window.showErrorMessage('Archiver works for folders only.');
      return;
    }

    var folder = path.basename(rootPath);
    var archivePath = path.resolve(rootPath, '..', folder + '.zip');

    var gitIgnorePath = path.resolve(rootPath, '.gitignore');
    var ignored = parse(gitIgnorePath, ['.git'], {
      cache: false
    });

    var output = fs.createWriteStream(archivePath);
    var archive = archiver('zip');

    output.on('error', function (err) {
      vscode.window.showErrorMessage(err.message);
    });

    archive.on('error', function (err) {
      vscode.window.showErrorMessage(err.message);
    });

    archive.on('end', function () {
      vscode.window.showInformationMessage('Archived to ' + archivePath);
    });

    archive.pipe(output);

    archive.glob('**/*',
      {
        cwd: rootPath,
        dot: true,
        ignore: ignored
      },
      {
        prefix: folder
      }
    );

    archive.finalize();
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
