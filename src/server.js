import http from 'node:http';
import { json } from './middlewares/application-json';

const port = 3333;

const server = http.createServer(async (req, res) => {

  await json(req, res);

  res.end('Hello World\n');
});

server.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
