import { readFile } from "fs/promises";

export class RepositoriesRepository {
  constructor() {
    this.#init();
  }

  async #init() {
    if (!this.json) {
      this.json = await this.#getInstance();
    }
  }

  async #getInstance() {
    return JSON.parse(await readFile("../database/repositories.json"));
  }

  find() {
    return this.json;
  }
}
