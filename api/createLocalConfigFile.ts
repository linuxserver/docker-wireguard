import fs from "fs";
import got from "got";
import ipRegex from "ip-regex";
import path from "path";

// Params
const dappnodeApiInternalIp = "http://my.dappnode/global-envs/INTERNAL_IP";
const serverPort = 51820;
const dataDir: string = process.env.DATA_DIR || "/config";

export async function createLocalConfigFile(device: string): Promise<string> {
  try {
    const remoteFilePath = getRemoteConfigFilePath(device, "conf");
    const localIp = await getLocalIp();
    const localEndpoint = `${localIp}:${serverPort}`;

    const remoteConfigFile = fs.readFileSync(remoteFilePath, "utf8");
    const localConfigFile = setLocalEndpoint(remoteConfigFile, localEndpoint);

    if (localConfigFile === remoteConfigFile) throw Error("Error generating localConfigFile");
    return localConfigFile;
  } catch (e) {
    e.message = `Error creating localConfigFile: ${e.message}`;
    throw e;
  }
}

// Utils

async function getLocalIp(): Promise<string> {
  try {
    const localIp = await got(dappnodeApiInternalIp).text();
    if (!localIp) throw Error("localIp is empty");
    if (!ipRegex({ exact: true }).test(localIp)) throw Error("Invalida localIp");
    return localIp;
  } catch (e) {
    e.message = `Error fetching localIp: ${e.message}`;
    throw e;
  }
}

export function setLocalEndpoint(configFile: string, localEndpoint: string): string {
  return configFile
    .split("\n")
    .map((row) => (row.startsWith("Endpoint =") ? `Endpoint = ${localEndpoint}` : row))
    .join("\n");
}

export function getRemoteConfigFilePath(device: string, mode: string): string {
  return path.join(dataDir, `peer_${device}`, `peer_${device}.local.${mode}`);
}
