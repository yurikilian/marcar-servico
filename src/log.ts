import { appendFile, writeFile } from "fs";

function log(message: string) {
  const date = new Date().toISOString();

  console.log(`${date}|${message}\n`);
  appendFile("./app.log", `${date}|${message}\n`, () => {});
}

export function flushFile(): Promise<void> {
  return new Promise(() => {
    writeFile("./app.log", "", (err) => {
      if (err) {
        console.error(err);
      }

      Promise.resolve();
    });
  });
}

export default log;
