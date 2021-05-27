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
import fs from "fs";

(async function (): Promise<void> {
  try {
    // getWireguardCredentials --local => return wireguard local credentials in plain text
    // getWireguardCredentials --local --qr => return wireguard local credentials in qr format

    const args = process.argv;
    if (
      args.length > 2 ||
      (args.length > 0 && !args.includes("local" || "qr" || "help"))
    )
      throw Error(params.ERROR_MESSAGE);

    // getWireguardCredentials => return wireguard remote credentials in plain text
    if (args.length === 0) {
      console.log(createStartingLog("remote", "text"));
      console.log(await getCredentials("remote", "text"));
    }

    switch (args[0]) {
      // getWireguardCredentials --qr => return wireguard remote credentials in qr format
      case "--qr":
        if (args[1] === "local") {
          console.log(createStartingLog("local", "qr"));
          console.log(await getCredentials("local", "qr"));
          return;
        } else if (!args[1]) {
          console.log(createStartingLog("remote", "qr"));
          console.log(await getCredentials("remote", "qr"));
          return;
        }
        throw Error(params.ERROR_MESSAGE);

      case "--local":
        if (args[1] === "qr") {
          console.log(createStartingLog("local", "qr"));
          console.log(await getCredentials("local", "qr"));
          return;
        } else if (!args[1]) {
          console.log(createStartingLog("local", "text"));
          console.log(await getCredentials("local", "text"));
          return;
        }
        throw Error(params.ERROR_MESSAGE);

      case "--help":
        console.log(params.HELP_MESSAGE);
      default:
        throw Error(params.ERROR_MESSAGE);
    }
  } catch (e) {
    // Exit process cleanly to prevent showing 'Unhandled rejection'
    console.error(e);
    process.exit(1);
  }
})();

// Utils
function createStartingLog(
  credentials: "local" | "remote",
  mode: "qr" | "text"
): string {
  return `Preparing ${credentials} ${mode} Wireguard credentials; use CTRL + C to stop`;
}

async function getCredentials(
  credentials: "local" | "remote",
  mode: "qr" | "text"
) {
  switch (credentials) {
    case "local":
      const localTextCreds = await createLocalConfigFile(params.MASTER_ADMIN);
      if (mode === "qr") return localTextCreds;

      // If rendering the QR fails, show error and the raw config
      const localQrCreds = await renderQrCode(localTextCreds).catch((e) => {
        console.error("Error rendering local QR code", e);
        return localTextCreds;
      });

      return localQrCreds;

    case "remote":
      const remoteFilePath = getRemoteConfigFilePath(
        params.MASTER_ADMIN,
        "conf"
      );
      const remoteTextCreds = fs.readFileSync(remoteFilePath, "utf-8");

      if (mode === "text") return remoteTextCreds;

      // If rendering the QR fails, show error and the raw remoteTextCreds
      const remoteQrCreds = await renderQrCode(remoteTextCreds).catch((e) => {
        console.error("Error rendering remote QR code", e);
        return remoteTextCreds;
      });

      return remoteQrCreds;
  }
}
