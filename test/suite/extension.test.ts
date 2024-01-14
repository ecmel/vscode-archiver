/*
 * Copyright (c) 1986-2023 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import assert from "assert";
import { describe, it } from "mocha";
import { commands } from "vscode";

describe("extension", () => {
  it("should have archive command", async () => {
    await assert.doesNotReject(
      async () => await commands.executeCommand("vscode-archiver.archive")
    );
  });
});
