var vscode = require('vscode');
var fs = require('fs');
var path = require('path')
var archiver = require('archiver');
var parse = require('parse-gitignore');

function activate(context) {

    var disposable = vscode.commands.registerCommand('extension.archive', function () {

        var rootPath = vscode.workspace.rootPath;
        var folder = path.basename(rootPath);
        var archivePath = path.resolve(rootPath, '..', folder + '.zip');
        var gitIgnorePath = path.resolve(rootPath, '.gitignore');
        var ignored = [];

        if (fs.existsSync(gitIgnorePath)) {
            ignored = parse(gitIgnorePath);
        }
        ignored.push('.git', '.git/**');

        var output = fs.createWriteStream(archivePath);
        var archive = archiver('zip');

        output.on('close', function () {
            vscode.window.showInformationMessage('Archived ' + archivePath);
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
