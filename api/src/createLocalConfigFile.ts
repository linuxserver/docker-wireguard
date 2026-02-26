import fs from "fs";
import got from "got";
import ipRegex from "ip-regex";
import path from "path";
import { params } from "./params";

export async function createLocalConfigFile(device: string): Promise<string> {
  try {
    const remoteFilePath = getRemoteConfigFilePath(device, "conf");
    const localIp = await getLocalIpWithRetries(30);
    const localEndpoint = `${localIp}:${params.SERVER_PORT}`;

    const remoteConfigFile = fs.readFileSync(remoteFilePath, "utf8");
    const localConfigFile = setLocalEndpoint(remoteConfigFile, localEndpoint);

    if (localConfigFile === remoteConfigFile)
      throw Error("Error generating localConfigFile");
    return localConfigFile;
  } catch (e) {
    e.message = `Error creating localConfigFile: ${e.message}`;
    throw e;
  }
}

// Utils

async function getLocalIpWithRetries(retries: number): Promise<string> {
  // An integer n >= 1
  retries = Math.max(Math.floor(retries), 1);

  for (let i = 0; i < retries - 1; i++) {
    try {
      return await getLocalIp();
    } catch (e) {
      console.log(`Error getting local IP: ${e.message}`);
      console.log(`Retrying... (${i + 1}/${retries})`);
    }
  }

  return await getLocalIp();
}

async function getLocalIp(): Promise<string> {
  const dappmanagerHostnames = params.DAPPMANAGER_HOSTNAMES;
  const getLocalIpUrls = dappmanagerHostnames.map(
    (hostname) => `http://${hostname}${params.GET_INTERNAL_IP_ENDPOINT}`,
  );

  let errorMessages: string[] = [];

  for (const url of getLocalIpUrls) {
    try {
      const localIp = await got(url).text();
      if (!localIp) throw Error("Local IP is empty");
      if (!ipRegex({ exact: true }).test(localIp))
        throw Error("Invalid local IP");
      return localIp;
    } catch (e) {
      errorMessages.push(
        `Local IP could not be fetched from ${url}: ${e.message}`,
      );
    }
  }
  throw Error(errorMessages.join("\n"));
}

export function setLocalEndpoint(
  configFile: string,
  localEndpoint: string,
): string {
  return configFile
    .split("\n")
    .map((row) =>
      row.startsWith("Endpoint =") ? `Endpoint = ${localEndpoint}` : row,
    )
    .join("\n");
}

export function getRemoteConfigFilePath(device: string, mode: string): string {
  return path.join(params.DATA_DIR, `peer_${device}`, `peer_${device}.${mode}`);
}
