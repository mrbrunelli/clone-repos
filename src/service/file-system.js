import fs from "fs";
import path from "path";

export class FileSystemService {
  getCompletePath(...pathSegments) {
    return path.resolve("..", ...pathSegments);
  }

  hasFolderPath(path) {
    return fs.existsSync(path);
  }

  async createFolder(path) {
    await fs.promises.mkdir(path);
  }

  async createFile(path, content) {
    await fs.promises.writeFile(path, content);
  }

  async readDir(path) {
    return fs.promises.readdir(path);
  }
}
