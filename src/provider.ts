/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
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

  const root = folder.uri.fsPath;

  let files = await walk({
    path: root,
    follow: false,
    includeEmpty: false,
    ignoreFiles: [".gitignore"],
  });

  const git = files.find((file) => file.startsWith(`.git${path.sep}`));

  if (git) {
    const ask = await window.showQuickPick(["Yes", "No"], {
      title: "Include .git folder?",
      placeHolder: "Yes",
    });

    if (ask === "No") {
      files = files.filter((file) => !file.startsWith(`.git${path.sep}`));
    }
  }

  const name = folder.name;
  const date = new Date();
  const arch = `${name}_${date.toISOString().replace(/[:.Z]/g, "")}.zip`;
  const dest = path.join(root, arch);
  const output = createWriteStream(dest);
  const archive = archiver("zip");

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

  await archive.finalize();
}
