// FIXME
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as fs from "fs";
import path from "path";

// Add onto this as needed
const defaultConfig: configInterface = {
  apiURL: "http://localhost:8000",
  uiURL: "http://localhost:3000",
  emailProvider: "gmail",
  emailUser: "",
  emailToken: "",
  emailConfigs: [
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
    },
    {
      host: "smtp-mail.outlook.com",
      secure: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
    },
  ],
  oauthConfig: {
    oauthClientId: "",
    oauthClientSecret: "",
    allowedDomains: [
      "gmail.com",
      "umail.ucc.ie",
      "ucc.ie",
      "cs.ucc.ie",
      "hse.ie",
    ],
  },
  signingKey: "",
  landingPageMD:
    "Landing Page Markdown Sample \n > Hello World \n `Lorem Ipsum` <script>alert('xss!')</script> [some text](javascript:alert('xss'))",
  databaseConfig: {
    host: "pgres",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
  },
  coordinatorEmails: [""],
};

export interface configInterface {
  uiURL: string;
  apiURL: string;
  emailProvider: string;
  emailUser: string;
  emailToken: string;
  emailConfigs: emailConfigInterface[];
  oauthConfig: {
    oauthClientId: string;
    oauthClientSecret: string;
    allowedDomains: string[];
  };
  signingKey: string;
  landingPageMD: string;
  databaseConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  coordinatorEmails: string[];
}

interface emailConfigInterface {
  host: string;
  port: number;
  secure?: boolean;
  tls?: {
    ciphers: string;
  };
}

class Config {
  private static path: string = path.join("config.json");
  private static config: configInterface;

  constructor() {
    if (!Config.config) {
      const newConfig: configInterface = Config.readConfig();
      if (this.validate(newConfig)) {
        Config.config = newConfig;
      } else {
        Config.config = defaultConfig;
        Config.writeConfig(Config.config);
      }
    }
  }

  // read config
  public static readConfig(): configInterface {
    if (!fs.existsSync(Config.path)) {
      Config.writeConfig(defaultConfig);
    }
    return JSON.parse(fs.readFileSync(Config.path, "utf8"));
  }

  // write config
  public static writeConfig(config: configInterface): void {
    // if there is already a config file, create a backup before writing
    if (fs.existsSync(Config.path)) {
      fs.writeFileSync(Config.path + ".bak", fs.readFileSync(Config.path));
    }
    fs.writeFileSync(Config.path, JSON.stringify(config, null, 2));
  }

  // get config
  public get(): configInterface {
    return Config.config;
  }

  // set config
  public set(config: configInterface): void {
    if (this.validate(config)) {
      Config.writeConfig(config);
      Config.config = config;
    }
  }

  // validate config
  private validate(newConfig: configInterface): boolean {
    const newKeys = Object.keys(newConfig).sort();
    const defaultKeys = Object.keys(defaultConfig).sort();
    return JSON.stringify(newKeys) === JSON.stringify(defaultKeys);
  }
}

export default new Config();
