import dotenv from "dotenv";

class Configuration {
  private env: ConfigurationEnvironment;

  constructor() {
    dotenv.config();

    const { URL, BROWSER_PATH, CRONTAB } = process.env;

    if (!URL) throw "Invalid URL";
    if (!BROWSER_PATH) throw "Invalid browser path";
    if (!CRONTAB) throw "Invalid crontab";

    this.env = {
      url: URL,
      browserPath: BROWSER_PATH,
      crontab: CRONTAB,
    };
  }

  getEnv(): ConfigurationEnvironment {
    return this.env;
  }
}

export interface ConfigurationEnvironment {
  url: string;
  browserPath: string;
  crontab: string;
}

export default new Configuration();
