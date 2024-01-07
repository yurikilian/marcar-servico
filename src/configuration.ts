import dotenv from "dotenv";

class Configuration {
  private env: ConfigurationEnvironment;

  constructor() {
    dotenv.config();

    const { URL, BROWSER_PATH } = process.env;

    if (!URL) throw "Invalid URL";
    if (!BROWSER_PATH) throw "Invalid browser path";

    this.env = {
      url: URL,
      browserPath: BROWSER_PATH,
    };
  }

  getEnv(): ConfigurationEnvironment {
    return this.env;
  }
}

export interface ConfigurationEnvironment {
  url: string;
  browserPath: string;
}

export default new Configuration();
