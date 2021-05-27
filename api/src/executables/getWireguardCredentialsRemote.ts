#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import { getRemoteConfigFilePath } from "../createLocalConfigFile";
import fs from "fs";

(async function (): Promise<void> {
  try {
    console.log(
      `Preparing remote Wireguard credentials; use CTRL + C to stop`,
    );

    const remoteFilePath = getRemoteConfigFilePath(params.MASTER_ADMIN, "conf");
    const config = fs.readFileSync(remoteFilePath, "utf-8");

    // If rendering the QR fails, show error and the raw config
    const qrStr = await renderQrCode(config).catch(e => {
      console.error("Error rendering QR code", e);
      return config;
    })

    console.log(`\n\n${qrStr}`);
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();
