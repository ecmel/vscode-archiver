/*
 * Copyright (c) 1986-2023 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import { ExtensionContext, commands } from "vscode";
import { archive } from "./provider";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("vscode-archiver.archive", archive)
  );
}

export function deactivate() {}
