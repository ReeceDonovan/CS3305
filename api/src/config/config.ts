import * as fs from "fs";
import path from "path";

// Add onto this as needed
var defaultConfig: configInterface = {
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
  landingPageMD: "Landing Page Markdown Sample \n > Hello World \n `Lorem Ipsum` <script>alert('xss!')</script> [some text](javascript:alert('xss'))"
};

interface configInterface {
  emailProvider: string;
  emailConfigs: Array<emailConfig>;
  oauthConfig: oauthConfig;
  signingKey: string;
  landingPageMD: string;
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

class Config {
  private path: string;
  private static currentConfig: configInterface;

  constructor() {
    this.path = path.join("config.json");
    Config.currentConfig = defaultConfig
    fs.readFile(this.path, "utf-8", (err, data) => {
      if (err) {
        this.update(defaultConfig);
        Config.currentConfig = defaultConfig;
        return console.log(err);
      }
      try {
        Config.currentConfig = JSON.parse(data);
        if (Object.keys(Config.currentConfig).sort() != Object.keys(defaultConfig).sort()) console.log('Discrepancy within the config/Missing parameters')
      } catch (error) {
        fs.rename(this.path, "old." + this.path, () => {
          console.error("Failed to rename");
        });
        this.update(defaultConfig);
        Config.currentConfig = defaultConfig;
      }
    });
  }

  public update(newJSON: configInterface) {
    fs.writeFile(this.path, JSON.stringify(newJSON), { flag: "w" }, (err) => {
      if (err) return console.log(err);
      Config.currentConfig = newJSON;
    });
  }

  public get(): configInterface {
    return Config.currentConfig;
  }

  public read(): configInterface {
    fs.readFile(this.path, "utf-8", (err, data) => {
      if (err) return console.log(err);
      Config.currentConfig = JSON.parse(data);
    });
    return Config.currentConfig;
  }
}

const config = new Config();

export default config