import http from 'node:http';

import { json } from './middlewares/application-json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const port = 3333;

const server = http.createServer(async (req, res) => {

  if (req.url !== '/tasks/upload') {
    await json(req, res);
  }

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
