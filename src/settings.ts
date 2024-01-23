/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import { ConfigurationScope, workspace } from "vscode";

export function getOutputPath(scope: ConfigurationScope): string {
  return workspace
    .getConfiguration("archiver", scope)
    .get<string>("outputPath", "");
}

export const enum IncludeGitFoldersType {
  ASK = "Ask",
  YES = "Yes",
  NO = "No",
}

export function getIncludeGitFolders(
  scope: ConfigurationScope
): IncludeGitFoldersType {
  return workspace
    .getConfiguration("archiver", scope)
    .get<IncludeGitFoldersType>("includeGitFolders", IncludeGitFoldersType.ASK);
}
