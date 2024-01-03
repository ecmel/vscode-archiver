/*
 * Copyright (c) 1986-2023 Ecmel Ercan <ecmel.ercan@gmail.com>
 * Licensed under the MIT License
 */

import path from "path";
import archiver from "archiver";
import walk from "ignore-walk";
import { window } from "vscode";
import { createWriteStream } from "fs";

export async function archive() {
  const folder = await window.showWorkspaceFolderPick();

  if (folder) {
    const root = folder.uri.fsPath;
    const name = `${folder.name}_${Date.now()}.zip`;
    const dest = path.resolve(root, name);
    const output = createWriteStream(dest);
    const archive = archiver("zip");

    const files = await walk({
      path: root,
      follow: false,
      includeEmpty: false,
      ignoreFiles: [".gitignore"],
    });

    output.on("error", (err) =>
      window.showErrorMessage(`Failed to archive: ${err}`)
    );

    archive.on("error", (err) =>
      window.showErrorMessage(`Failed to archive: ${err}`)
    );

    archive.on("end", () =>
      window.showInformationMessage(`Archived ${files.length} files to ${name}`)
    );

    archive.pipe(output);

    for (const file of files) {
      archive.file(path.join(root, file), { name: file });
    }

    await archive.finalize();
  }
}
