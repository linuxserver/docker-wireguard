#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import { getRemoteConfigFilePath } from "../createLocalConfigFile";
import fs from "fs";

// If user does CTRL + C, exit process
process.on("SIGINT", () => process.exit(128));

(async function (): Promise<void> {
  try {
    console.log(
      `Fetching remote Wireguard credentials. It may take some time; use CTRL + C to stop`,
    );
    const remoteFilePath = getRemoteConfigFilePath(params.MASTER_ADMIN, "conf");
    const wireguardRemoteCredentials = fs.readFileSync(remoteFilePath, "utf-8");

    // If rendering the QR fails, show the error and continue, the raw URL is consumable
    console.log(`

${await renderQrCode(wireguardRemoteCredentials).catch((e) => e.stack)}`);
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();
