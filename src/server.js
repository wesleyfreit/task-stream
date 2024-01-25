import http from 'node:http';

const port = 3333;

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
