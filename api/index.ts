import express from "express";
import cors from "cors";
import path from "path";
import { createLocalConfigFile } from "./createLocalConfigFile";

const port = process.env.SERVER_PORT || 80;
const dataDir: string = process.env.DATA_DIR || "/config";

const app = express();
app.use(cors());

app.get("/:device/remote/:mode?", (req: express.Request, res: express.Response) => {
  const { mode, device } = req.params;
  const fileExt = mode === "qr" ? "png" : "conf";
  const remoteFilePath = path.join(dataDir, `peer_${device}`, `peer_${device}.remote.${fileExt}`);

  try {
    res.status(200).sendFile(remoteFilePath);
  } catch (e) {
    if (e.code === "ENOENT") res.status(404).send("Not found");
    else res.status(500).send(e.stack);
  }
});

app.get("/:device/local/:mode?", async (req: express.Request, res: express.Response) => {
  const { mode, device } = req.params;
  const fileExt = mode === "qr" ? "png" : "conf";
  const remoteFilePath = path.join(dataDir, `peer_${device}`, `peer_${device}.local.${fileExt}`);
  const localConfigFile = await createLocalConfigFile(remoteFilePath);

  try {
    res.status(200).send(localConfigFile);
  } catch (e) {
    if (e.code === "ENOENT") res.status(404).send("Not found");
    else res.status(500).send(e.stack);
  }
});

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
function shutdown() {
  console.log("Closing server...");
  server.close((err) => console.log(err || "Bye"));
}
