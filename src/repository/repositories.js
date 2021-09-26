import { readFile } from "fs/promises";
import path from "path";

export class RepositoriesRepository {
  constructor() {
    this.init();
  }

  async init() {
    if (!this.json) {
      this.json = await this.getInstance();
    }
  }

  async getInstance() {
    const filePath = path.resolve("src", "database", "repositories.json");
    return JSON.parse(await readFile(filePath));
  }

  find() {
    return this.json;
  }

  findFolderName() {
    return this.json.folder_name;
  }

  findRepositoriesUrl() {
    return this.json.repositories_url;
  }

  findAdditionalFiles() {
    return this.json.additional_files;
  }
}
