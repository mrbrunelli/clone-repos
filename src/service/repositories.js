import cp from "child_process";
import util from "util";
import chalk from "chalk";

export class RepositoriesService {
  constructor({ repositoriesRepository, fileSystemService, readLineService }) {
    this.repositoriesRepository = repositoriesRepository;
    this.fileSystemService = fileSystemService;
    this.readLineService = readLineService;
    this.execCommand = util.promisify(cp.exec);
  }

  async cloneRepositories(path) {
    const repositoriesUrl =
      await this.repositoriesRepository.findRepositoriesUrl();

    this.log("Clonando...");

    for (const url of repositoriesUrl) {
      const command = `git clone ${url}`;
      await this.execCommand(command, { cwd: path })
        .then(() =>
          this.log(`Repositório ${url} clonado com sucesso!`, "success")
        )
        .catch(() =>
          this.log(
            `Já existe uma pasta clonada para esse repositório: ${url}`,
            "error"
          )
        );
    }

    this.log("Repositórios clonados!");
  }

  async createAdditionalFiles(path) {
    const clonedFolders = await this.fileSystemService.readDir(path);
    const additionalFiles =
      await this.repositoriesRepository.findAdditionalFiles();

    this.log("Adicionando arquivos...");

    for (const folder of clonedFolders) {
      for (const file of additionalFiles) {
        const fileDir = this.fileSystemService.getCompletePath(
          path,
          folder,
          file.name
        );
        await this.fileSystemService.createFile(fileDir, file.content);

        this.log(`${file.name} adicionado em ${folder}`, "success");
      }
    }

    this.log("Arquivos adicionados!");
  }

  log(text, type) {
    const options = {
      success: "green",
      warning: "yellowBright",
      error: "red",
    };
    console.log(chalk[options[type] || "cyan"].bold(text));
  }

  createReadLineObserver() {
    this.readLineService.onClose(() => {
      const folderName = this.repositoriesRepository.findFolderName();
      this.log(`\n $ cd ../${folderName} \n`, "success");
    });
  }

  async main() {
    this.createReadLineObserver();

    const question = "\nDeseja clonar os repositórios? (y/N): ";
    const answer = await this.readLineService.question(question);

    if (this.readLineService.isPositiveAnswer(answer)) {
      const folderName = this.repositoriesRepository.findFolderName();
      const folderPath = this.fileSystemService.getCompletePath(folderName);

      if (!this.fileSystemService.hasFolderPath(folderPath)) {
        this.log(`Criando pasta '${folderName}' para os repositórios...`);
        await this.fileSystemService.createFolder(folderPath);
      }

      await this.cloneRepositories(folderPath);

      const question = "\nDeseja adicionar os arquivos extras? (y/N): ";
      const answer = await this.readLineService.question(question);

      if (this.readLineService.isPositiveAnswer(answer)) {
        await this.createAdditionalFiles(folderPath);
      }

      this.readLineService.closeReadLine();
    } else {
      this.readLineService.closeReadLine();
    }
  }
}
