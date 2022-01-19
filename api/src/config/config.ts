import * as fs from "fs";
import { ExitStatus } from "typescript";

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
};

interface configInterface {
  emailProvider: string;
  emailConfigs: Array<emailConfig>;
  oauthConfig: oauthConfig;
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
  path: string = "config.json";
  currentConfig: configInterface;

  constructor() {
    try {
      fs.readFile(this.path, "utf-8", (_err, data) => {
        try {
          config = JSON.parse(data);
          console.log("Loaded config from fs", config.oauthConfig.oauthClientId)
        } catch (e) {
          console.error("config file corrupted");

          fs.rename(this.path, "old." + this.path, () => {
            console.error("Failed to rename");
            return;
          });
        }
      });
    } catch (e) {
      this.update(config);
      this.currentConfig = config;
      console.error(e);
    }
  }
  //         try {
  //             this.currentConfig = JSON.parse(data);
  //         } catch (error) {
  //             fs.rename(this.path, "old." + this.path, () => {
  //                 console.error("Failed to rename")
  //             })
  //             this.update(config)
  //             this.currentConfig = config
  //         }
  //     })
  // }

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
