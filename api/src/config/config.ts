import * as fs from "fs";
import path from "path";

// Add onto this as needed
export var config: configInterface = {
  emailProvider: "gmail",
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
  },
  signingKey: "",
};

interface configInterface {
  emailProvider: string;
  emailConfigs: Array<emailConfig>;
  oauthConfig: oauthConfig;
  signingKey: string;
}

interface emailConfig {
  host: string;
  port: number;
  secure?: boolean;
  tls?: {
    ciphers?: string;
  };
}

interface oauthConfig {
  oauthClientId: string;
  oauthClientSecret: string;
}

export class Config {
  path: string;
  currentConfig: configInterface;

  constructor() {
    this.path = path.join("config.json");
    this.currentConfig = config
    fs.readFile(this.path, "utf-8", (err, data) => {
      if (err) {
        this.update(config);
        this.currentConfig = config;
        return console.log(err);
      }
      try {
        this.currentConfig = JSON.parse(data);
        config = this.currentConfig;
      } catch (error) {
        fs.rename(this.path, "old." + this.path, () => {
          console.error("Failed to rename");
        });
        this.update(config);
        this.currentConfig = config;
      }
    });
  }

  public update(newJSON: configInterface) {
    fs.writeFile(this.path, JSON.stringify(newJSON), { flag: "w+" }, (err) => {
      if (err) return console.log(err);
      this.currentConfig = newJSON;
    });
  }

  public get(): configInterface {
    return this.currentConfig;
  }

  public read(): configInterface {
    fs.readFile(this.path, "utf-8", (err, data) => {
      if (err) return console.log(err);
      this.currentConfig = JSON.parse(data);
    });
    return this.currentConfig;
  }
}
