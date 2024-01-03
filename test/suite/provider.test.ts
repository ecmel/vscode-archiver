/*
 * Copyright (c) 1986-2023 Ecmel Ercan <ecmel.ercan@gmail.com>
 * Licensed under the MIT License
 */

import assert from "assert";
import sinon from "sinon";
import { afterEach, describe, it } from "mocha";
import { window } from "vscode";
import * as provider from "../../src/provider";

afterEach(() => {
  sinon.restore();
});

describe("provider", () => {
  it("should do nothing if no workspace is opened", async () => {
    sinon.stub(window, "showWorkspaceFolderPick").value(async () => undefined);
    await provider.archive();
    assert.ok(true);
  });
});
