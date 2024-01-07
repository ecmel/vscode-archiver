/*
 * Copyright (c) 1986-2023 Ecmel Ercan <ecmel.ercan@gmail.com>
 * Licensed under the MIT License
 */

import path from "path";
import { runTests } from "@vscode/test-electron";

const extensionDevelopmentPath = path.resolve(__dirname, "../../");
const extensionTestsPath = path.resolve(__dirname, "./suite");

runTests({ extensionDevelopmentPath, extensionTestsPath }).catch(() =>
  process.exit(1)
);