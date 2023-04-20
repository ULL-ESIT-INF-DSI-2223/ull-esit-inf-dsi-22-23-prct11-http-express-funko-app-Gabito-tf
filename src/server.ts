import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import { exec } from 'child_process';

const app = express();
app.use(bodyParser.json());


app.get('/execmd', (req: Request, res: Response) => {
    const cmd = req.query.cmd
    const args = req.query.args
  
    if (!cmd) {
      res.status(400).send({ error: 'El parámetro "cmd" es obligatorio' });
      return;
    }
  
    const command = `${cmd} ${args ? args : ''}`;
    console.log(command)
  
    exec(command, (error, stdout, stderr) => {
      if (error) {
        res.status(500).send({ error: error.message });
      } else {
        res.send({ output: stdout });
      }
    });
  });
  
  app.use((req: Request, res: Response) => {
    res.status(500).send({ error: 'Ruta no válida' });
  });

app.use((req: Request, res: Response) => {
  res.status(404).send({ error: 'Ruta no válida' });
});

const server = app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

export default server;
