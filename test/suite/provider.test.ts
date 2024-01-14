/*
 * Copyright (c) 1986-2023 Ecmel Ercan (https://ecmel.dev/)
 * Licensed under the MIT License
 */

import assert from "assert";
import sinon from "sinon";
import mockfs from "mock-fs";
import { beforeEach, afterEach, describe, it } from "mocha";
import { window } from "vscode";
import { glob } from "fast-glob";
import * as provider from "../../src/provider";

describe("provider", () => {
  beforeEach(() => {
    mockfs({
      "/project": {
        "README.md": "README",
      },
    });
  });

  afterEach(() => {
    sinon.restore();
    mockfs.restore();
  });

  it("should archive choosen workspace folder", async () => {
    sinon
      .stub(window, "showWorkspaceFolderPick")
      .value(async () => ({ name: "project", uri: { fsPath: "/project" } }));

    await provider.archive();
    const files = glob.sync("/project/*.zip");
    assert.strictEqual(files.length, 1);
  });

  it("should not reject if no workspace folder", async () => {
    sinon.stub(window, "showWorkspaceFolderPick").value(async () => undefined);
    await assert.doesNotReject(provider.archive);
  });
});
