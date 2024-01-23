/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import path from "path";
import archiver from "archiver";
import walk from "ignore-walk";
import { ProgressLocation, window } from "vscode";
import { createWriteStream } from "fs";
import {
  IncludeGitFoldersType,
  getIncludeGitFolders,
  getOutputPath,
} from "./settings";

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

  let type = getIncludeGitFolders(folder);

  if (type === IncludeGitFoldersType.ASK) {
    const git = files.find((file) => file.includes(".git/"));

    if (git) {
      const picked = await window.showQuickPick(["Yes", "No"], {
        title: "Include .git folders?",
        placeHolder: "Yes",
      });

      if (picked === "No") {
        type = IncludeGitFoldersType.NO;
      }
    }
  }

  if (type === IncludeGitFoldersType.NO) {
    files = files.filter((file) => !file.includes(".git/"));
  }

  const name = folder.name;
  const date = new Date();
  const arch = `${name}_${date.toISOString().replace(/[:.Z]/g, "")}.zip`;
  const outputPath = getOutputPath(folder);

  const dest = path.isAbsolute(outputPath)
    ? path.join(outputPath, arch)
    : path.join(root, outputPath, arch);

  await window.withProgress(
    {
      title: `Archiving ${files.length} files in ${name}`,
      location: ProgressLocation.Window,
      cancellable: false,
    },
    async (progress) => {
      const output = createWriteStream(dest);
      const archive = archiver("zip");

      output.on("error", (err) => {
        window.showErrorMessage(`Failed to archive ${name}: ${err}`);
      });

      archive.on("error", (err) => {
        window.showErrorMessage(`Failed to archive ${name}: ${err}`);
      });

      let previous = 0;

      archive.on("progress", (data) => {
        const percent = Math.ceil(
          (data.fs.processedBytes / data.fs.totalBytes) * 100
        );
        progress.report({ increment: percent - previous });
        previous = percent;
      });

      archive.pipe(output);

      for (const file of files) {
        archive.file(path.join(root, file), { prefix: name, name: file });
      }

      await archive.finalize();
    }
  );
}
