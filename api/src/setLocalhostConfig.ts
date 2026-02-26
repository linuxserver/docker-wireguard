export function setLocalhostConfig(configFile: string): string {
  return configFile
    .split("\n")
    .filter((row) => !row.includes("ListenPort"))
    .map((row) =>
      row.match(/^Endpoint\s*=/) ? "Endpoint = localhost:51820" : row,
    )
    .join("\n");
}
