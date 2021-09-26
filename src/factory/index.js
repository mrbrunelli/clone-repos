import { RepositoriesRepository } from "../repository/index.js";
import { ReadLineService, RepositoriesService } from "../service/index.js";

function createRepositoriesRepository() {
  return new RepositoriesRepository();
}

function createReadLineService() {
  return new ReadLineService();
}

export function createRepositoriesService() {
  const repositoriesRepository = createRepositoriesRepository();
  const readLineService = createReadLineService();
  return new RepositoriesService({
    repositoriesRepository,
    readLineService,
  });
}
