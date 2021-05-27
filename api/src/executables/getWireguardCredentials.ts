#!/usr/bin/env node

// This script must return the MASTER_ADMIN credentials formated
// as a nice message in the terminal + a QR code
//
// It will be run as a separate process, maybe in a different container

import { renderQrCode } from "../renderQrCode";
import { params } from "../params";
import { createLocalConfigFile, getRemoteConfigFilePath } from "../createLocalConfigFile";
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

    console.log(createStartingLog(isLocal ? "local" : "remote", isQr ? "qr" : "text"));
    console.log(await getCredentials(isLocal, isQr));
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();

// Utils
function createStartingLog(credentials: "local" | "remote", mode: "qr" | "text"): string {
  return `Preparing ${credentials} ${mode} Wireguard credentials; use CTRL + C to stop`;
}

async function getCredentials(isLocal: boolean, isQr: boolean) {
  // LOCAL
  if (isLocal) {
    const localTextCreds = await createLocalConfigFile(params.MASTER_ADMIN);
    if (!isQr) return localTextCreds;
    // If rendering the QR fails, show error and the raw config
    const localQrCreds = await renderQrCode(localTextCreds).catch((e) => {
      console.error("Error rendering local QR code", e);
      return localTextCreds;
    });

    return localQrCreds;
  }

  //REMOTE
  const remoteFilePath = getRemoteConfigFilePath(params.MASTER_ADMIN, "conf");
  const remoteTextCreds = fs.readFileSync(remoteFilePath, "utf-8");

  if (!isQr) return remoteTextCreds;

  // If rendering the QR fails, show error and the raw remoteTextCreds
  const remoteQrCreds = await renderQrCode(remoteTextCreds).catch((e) => {
    console.error("Error rendering remote QR code", e);
    return remoteTextCreds;
  });

  return remoteQrCreds;
}
