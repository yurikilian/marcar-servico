import { appendFile } from "fs";

function log(message: string) {
  const date = new Date().toISOString();

  console.log(`${date}|${message}\n`);
  appendFile("./app.log", `${date}|${message}\n`, () => {});
}

export default log;
