#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import { createLocalConfigFile } from "../createLocalConfigFile";

// If user does CTRL + C, exit process
process.on("SIGINT", () => process.exit(128));

(async function (): Promise<void> {
  try {
    console.log(
      `Fetching local Wireguard credentials. It may take some time; use CTRL + C to stop`,
    );

    const wireguardLocalCredentials = await createLocalConfigFile(params.MASTER_ADMIN);

    // If rendering the QR fails, show the error and continue, the raw URL is consumable
    console.log(`

${await renderQrCode(wireguardLocalCredentials).catch((e) => e.stack)}`);
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();
