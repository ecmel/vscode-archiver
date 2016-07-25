'use strict';

// (c) 2016 Ecmel Ercan

var vsc = require('vscode');
var archiver = require('archiver');
var parse = require('parse-gitignore');
var fs = require('fs');
var path = require('path')

function activate(context) {

  var disposable = vsc.commands.registerCommand('extension.archive', function () {

    var rootPath = vsc.workspace.rootPath;

    if (!rootPath) {
      vsc.window.showErrorMessage('Archiver works for folders only.');
      return;
    }

    var folder = path.basename(rootPath);
    var archivePath = path.resolve(rootPath, '..', folder + '_' + Date.now() + '.zip');

    var gitIgnorePath = path.resolve(rootPath, '.gitignore');
    var ignored = parse(gitIgnorePath, ['.git'], {
      cache: false
    });

    var output = fs.createWriteStream(archivePath);
    var archive = archiver('zip');

    output.on('error', function (err) {
      vsc.window.showErrorMessage(err.message);
    });

    archive.on('error', function (err) {
      vsc.window.showErrorMessage(err.message);
    });

    archive.on('end', function () {
      vsc.window.showInformationMessage('Archived to ' + archivePath);
    });

    archive.on('entry', function (entry) {
      vsc.window.setStatusBarMessage('Archiving ' + entry.name, 1000);
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
