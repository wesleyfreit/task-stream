import fs from 'node:fs/promises';

const databasePath = new URL('../../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    // This is the Singleton pattern implementation
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;

    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  find(table, id) {
    const data = this.#database[table].find((row) => row.id === id) ?? {};
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    const task = this.find(table, id);

    const updatedData = {
      id,
      ...task,
      ...data,
      updated_at: new Date(),
    };

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...updatedData };
      this.#persist();
    }
  }

  complete(table, id) {
    const task = this.find(table, id);

    if (task) {
      this.update(table, id, {
        ...task,
        completed_at: new Date(),
      });
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
