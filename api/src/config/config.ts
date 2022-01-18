import * as fs from 'fs'

// Add onto this as needed
const config: configInterface = {
    emailProvider: 'gmail',
    emailConfigs: [
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        },
        {
            host: "smtp-mail.outlook.com",
            secure: false,
            port: 587,
            tls: {
               ciphers:'SSLv3'
            }
        }
    ]
}

interface configInterface {
    emailProvider: string;
    emailConfigs: Array<emailConfig>;
}

interface emailConfig {
    host: string;
    port: number;
    secure?: boolean;
    tls?: {
        ciphers?: string;
    }
}

class Config {
    path: string = 'config.json'
    currentConfig: configInterface;
    
    constructor() {
        fs.readFile(this.path, 'utf-8', (err, data) => {
            if (err) {
                this.update(config)
                this.currentConfig = config
                return console.log(err)
            } 
            try {
                this.currentConfig = JSON.parse(data);
            } catch (error) { 
                fs.rename(this.path, "old." + this.path, () => {
                    console.error("Failed to rename")
                })
                this.update(config)
                this.currentConfig = config
            }
        })
    }

    public update(newJSON: configInterface) {
        fs.writeFile(this.path, JSON.stringify(newJSON), {flag: "w+"}, (err) => {
            if (err) return console.log(err)
            this.currentConfig = newJSON
        })
    }

    public get(): configInterface {
        return this.currentConfig
    }

    public read(): configInterface {
        fs.readFile(this.path, 'utf-8', (err, data) => {
            if (err) return console.log(err)
            this.currentConfig = JSON.parse(data);
        })
        return this.currentConfig
    }
}

export default config