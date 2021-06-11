import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import {
  createLocalConfigFile,
  getRemoteConfigFilePath,
} from "./createLocalConfigFile";

const port = process.env.SERVER_PORT || 80;

const app = express();
app.use(cors());

// - remote:    '/dappnode_admin'
// - remote qr: '/dappnode_admin?qr'
// - local:     '/dappnode_admin?local'
// - local qr:  '/dappnode_admin?local&qr'
app.get("/:device", async (req: express.Request, res: express.Response) => {
  try {
    const { device } = req.params;
    // Allow to send `?local` without setting to `?local=1`
    const local = Boolean(req.query.local) || req.query.local === "";
    const qr = Boolean(req.query.qr) || req.query.qr === "";

    if (local) {
      if (qr) throw Error("qr mode not supported in local");
      const localConfigFile = await createLocalConfigFile(device);
      res.status(200).send(localConfigFile);
    } else {
      const fileExt = qr ? "png" : "conf";
      const remoteFilePath = getRemoteConfigFilePath(device, fileExt);
      res.status(200).sendFile(remoteFilePath);
    }
  } catch (e) {
    if (e.code === "ENOENT") res.status(404).send("Not found");
    else res.status(500).send(e.stack);
  }
});

// Return JSON instead of HTML
const errorJsonHandler: ErrorRequestHandler = async (err, req, res, next) => {
  res.status(500).send(err);
};
app.use(errorJsonHandler);

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
function shutdown() {
  console.log("Closing server...");
  server.close((err) => console.log(err || "Bye"));
}
