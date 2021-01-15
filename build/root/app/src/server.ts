import express from 'express';
import { param, validationResult } from 'express-validator';
import cors from 'cors';
import path from 'path';
import Logger from 'bunyan';

const app = express();

const port = process.env.SERVER_PORT || 80;
const dataDir: string = process.env.DATA_DIR || "/config";
app.use(cors())

let silent;
const log = Logger.createLogger({
    name: "Server",
    streams: [{
      stream: process.stdout,
      level: silent ? 'fatal' : 30
    }]
  });
  

app.get('/:mode/:device',
 [
     param('mode').isIn(['conf', 'qr'])
 ],
  (req: express.Request, res: express.Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let ext = 'conf';

      if (req.params.mode === 'qr') ext = 'png';

      const device: string = req.params.device;

      try {
        res.status(200).sendFile(path.join(dataDir, `peer_${device}/peer_${device}.${ext}`));
      } catch(error: any){
          res.status(404).end('Not found');
      }
  });


app.listen(port, () => log.info({loc: '[LISTEN]'}, `Injector listening on port ${port}!`))

export default app;
