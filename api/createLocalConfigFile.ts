import fs from "fs";

// Params
const dappnodeApiInternalIp = "my.dappnode/global-envs/INTERNAL_IP";
const serverPort = "51820";

export async function createLocalConfigFile(path: string): Promise<string> {
  try {
    const localIp = await getLocalIp();
    const localEndpoint = `${localIp}:${serverPort}`;

    const remoteConfigFile = fs.readFileSync(path, "utf8");
    const localConfigFile = remoteConfigFile
      .split("\n")
      .map((row) => (row.startsWith("Endpoint =") ? (row = `Endpoint = ${localEndpoint}`) : row))
      .join("\n");

    if (localConfigFile === remoteConfigFile) throw Error("Error generating localConfigFile");
    return localConfigFile;
  } catch (e) {
    throw Error(e);
  }
}

async function getLocalIp(): Promise<string> {
  try {
    const response = await fetch(dappnodeApiInternalIp);
    const localIp = response.text();
    if (!localIp) throw Error("localIp is empty");
    return localIp;
  } catch (e) {
    e.message = "Error fetching localIp" + e.message;
    throw Error(e);
  }
}
