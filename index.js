import readLine from "readline";
import childProcess from "child_process";
import util from "util";
import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  rmdir,
  access,
} from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const json = JSON.parse(await readFile("./repositories.json"));
const exec = util.promisify(childProcess.exec);

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Deseja clonar os repositórios? (y/N): ", async (answer) => {
  if (answer === "y") {
    const devApiFolder = path.resolve("..", "devapi");

    const hasDevApiFolder = existsSync(devApiFolder);

    if (!hasDevApiFolder) {
      console.log("Criando pasta 'devapi' para os repositórios...");
      await mkdir(devApiFolder);
    }

    console.log("Clonando...");

    for (const url of json.repositories_url) {
      const command = `git clone ${url}`;
      await exec(command, { cwd: devApiFolder })
        .then(() => console.log(`Repositório ${url} clonado com sucesso!`))
        .catch(() =>
          console.log(
            `Já existe uma pasta clonada para esse repositório ${url}`
          )
        );
    }

    console.log("Repositórios clonados com sucesso!");

    console.log("Criando arquivos adicionais (tokens, envs, scripts)...");
    const clonedFolders = await readdir(devApiFolder);

    for (const folder of clonedFolders) {
      for (const file of json.additional_files) {
        const fileDir = path.resolve("..", "devapi", folder, file.name);
        await writeFile(fileDir, file.content);
      }
    }

    console.log("Arquivos adicionados com sucesso!");

    rl.close();
  } else {
    rl.close();
  }
});

rl.on("close", () => {
  console.log("\nFalou pilantra!");
  process.exit(0);
});
