import express from "express";
import cors from "cors";
import { createLocalConfigFile, getRemoteConfigFilePath } from "./createLocalConfigFile";

const port = process.env.SERVER_PORT || 80;

const app = express();
app.use(cors());

app.get("/:device/remote/:mode?", (req: express.Request, res: express.Response) => {
  try {
    const { mode, device } = req.params;
    const fileExt = mode === "qr" ? "png" : "conf";
    const remoteFilePath = getRemoteConfigFilePath(device, fileExt);
    res.status(200).sendFile(remoteFilePath);
  } catch (e) {
    if (e.code === "ENOENT") res.status(404).send("Not found");
    else res.status(500).send(e.stack);
  }
});

app.get("/:device/local/:mode?", async (req: express.Request, res: express.Response) => {
  try {
    const { mode, device } = req.params;
    if (mode === "qr") throw Error("qr mode not supported in local");

    const localConfigFile = await createLocalConfigFile(device);
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
