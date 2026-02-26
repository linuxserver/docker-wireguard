#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import {
  createLocalConfigFile,
  getRemoteConfigFilePath,
} from "../createLocalConfigFile";
import { setLocalhostConfig } from "../setLocalhostConfig";
import fs from "fs";

(async function (): Promise<void> {
  try {
    // Help message
    if (process.argv.includes("--help")) {
      console.log(params.HELP_MESSAGE);
      return;
    }

    const isQr = process.argv.includes("--qr");
    const isLocal = process.argv.includes("--local");
    const isLocalhost = process.argv.includes("--localhost");

    const configName = isLocal ? "local" : "remote";
    const configFormat = isQr ? "qr" : "text";
    console.log(
      `Preparing ${configName} ${configFormat} Wireguard credentials; use CTRL + C to stop`,
    );

    const baseConfig = isLocal
      ? await createLocalConfigFile(params.MASTER_ADMIN)
      : fs.readFileSync(
          getRemoteConfigFilePath(params.MASTER_ADMIN, "conf"),
          "utf-8",
        );

    // Mostly required to connect from within the same machine,
    // especially when DAppNode is installed on macOS.
    const config = isLocalhost ? setLocalhostConfig(baseConfig) : baseConfig;

    const str = isQr
      ? // If rendering the QR fails, show error and the raw remoteTextCreds
        await renderQrCode(config).catch((e) => {
          console.error("Error rendering remote QR code", e);
          return config;
        })
      : config;

    console.log(`\n\n${str}\n\n`);
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();
