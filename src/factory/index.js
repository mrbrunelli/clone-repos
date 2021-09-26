import { RepositoriesRepository } from "../repository/index.js";
import {
  ReadLineService,
  RepositoriesService,
  FileSystemService,
} from "../service/index.js";

function createRepositoriesRepository() {
  return new RepositoriesRepository();
}

function createReadLineService() {
  return new ReadLineService();
}

function createFileSystemService() {
  return new FileSystemService();
}

export function createRepositoriesService() {
  const repositoriesRepository = createRepositoriesRepository();
  const fileSystemService = createFileSystemService();
  const readLineService = createReadLineService();

  return new RepositoriesService({
    repositoriesRepository,
    fileSystemService,
    readLineService,
  });
}
