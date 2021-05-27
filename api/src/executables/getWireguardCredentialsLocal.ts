#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import { createLocalConfigFile } from "../createLocalConfigFile";

(async function (): Promise<void> {
  try {
    console.log(
      `Preparing local Wireguard credentials; use CTRL + C to stop`,
    );

    const config = await createLocalConfigFile(params.MASTER_ADMIN);
    
    // If rendering the QR fails, show error and the raw config
    const qrStr = await renderQrCode(config).catch(e => {
      console.error("Error rendering QR code", e)
      return config
    })

    console.log(`\n\n${qrStr}`);
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();
