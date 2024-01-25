import { randomUUID } from 'node:crypto';
import { Database } from './db/database.js';
import { multipart } from './middlewares/multipart-form-data.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title } = req.query;

      const tasks = database.select(
        'tasks',
        title
          ? {
              title,
            }
          : null,
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.find('tasks', id);

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const body = req.body;

      database.update('tasks', id, {
        ...body,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      database.complete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/upload'),
    handler: async (req, res) => {
      multipart.single('file')(req, res, async (err) => {
        if (err) return res.writeHead(400).end('Error with file');

        if (!req.file) return res.writeHead(400).end('No such file');

        return res.writeHead(201).end('File registred');
      });
    },
  },
];
