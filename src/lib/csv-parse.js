import { parse } from 'csv-parse';
import { randomUUID } from 'node:crypto';
import { Database } from '../db/database.js';

const database = new Database();

export class CsvParse {
  async _handleFile(req, file, cb) {
    const csvParse = parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2,
    });

    const linesParse = file.stream.pipe(csvParse);

    for await (const line of linesParse) {
      const [title, description] = line;
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);
    }

    cb(null);
  }

  _removeFile(req, file, cb) {
    cb(null);
  }
}
