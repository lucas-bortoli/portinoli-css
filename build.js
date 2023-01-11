import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { statSync, watch, writeFileSync } from "fs";
import chalk from "chalk";
import sass from "sass";

const __dirname = dirname(fileURLToPath(import.meta.url));

const log = (...args) => {
  const time = new Date().toLocaleTimeString("pt-BR");
  console.log(chalk.gray(time), ...args);
};

const error = (...args) => {
  const time = new Date().toLocaleTimeString("pt-BR");
  console.error(chalk.gray(time), chalk.red("ERRO"), ...args);
};

const build = () => {
  const inputFile = join(__dirname, "src/index.scss");
  const outputFile = join(__dirname, "index.css");

  log("Iniciando compilação");
  log(chalk.blue("Output") + ": " + outputFile);

  try {
    const compiled = sass.compile(inputFile, { style: "compressed" });

    // Escrever CSS resultante na pasta raiz da biblioteca
    writeFileSync(outputFile, compiled.css);
    const outputStat = statSync(outputFile);

    log(chalk.green("Sucesso") + ` (${outputStat.size} bytes)`);
  } catch (exception) {
    error("Falha na compilação do CSS!");

    // Mostrar uma mensagem de erro por linha
    for (const line of exception.toString().split("\n")) {
      error(line);
    }
  }
};

if (process.argv.includes("--watch")) {
  watch(join(__dirname, "src/"), null, () => {
    log("");
    log("Arquivo mudou!");
    build();
  });
}

build();
