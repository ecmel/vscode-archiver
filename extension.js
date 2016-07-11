var vscode = require('vscode');
var fs = require('fs');
var path = require('path')
var archiver = require('archiver');
var parse = require('parse-gitignore');

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
        var ignored = parse(gitIgnorePath, ['.git', '.git/**']);

        var output = fs.createWriteStream(archivePath);
        var archive = archiver('zip');

        var msg = vscode.window.setStatusBarMessage('Archiving to ' + archivePath);

        output.on('close', function () {
            msg.dispose();
            vscode.window.showInformationMessage('Archived ' + archivePath);
        });

        archive.on('error', function (err) {
            msg.dispose();
            vscode.window.showErrorMessage(err.message);
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
