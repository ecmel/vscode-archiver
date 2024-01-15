/*
 * Copyright (c) 1986-2024 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import assert from "assert";
import sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import { commands, window } from "vscode";

describe("extension", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should have archive command", async () => {
    sinon.stub(window, "showWorkspaceFolderPick").value(async () => undefined);
    await assert.doesNotReject(
      async () => await commands.executeCommand("vscode-archiver.archive")
    );
  });
});
