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

  if (!folder) {
    return;
  }

  const date = new Date();
  const name = folder.name;
  const root = folder.uri.fsPath;
  const arch = `${name}_${date.toISOString().replace(/[:.Z]/g, "")}.zip`;
  const dest = path.join(root, arch);
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
    window.showInformationMessage(`Archived ${files.length} files to ${arch}`)
  );

  archive.pipe(output);

  for (const file of files) {
    archive.file(path.join(root, file), { prefix: name, name: file });
  }

  return archive.finalize();
}
