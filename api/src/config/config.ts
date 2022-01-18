import * as fs from 'fs'

interface configInterface {
    emailType: number;
    emailConfigs: Array<emailConfig>;
}

interface emailConfig {
    host: string;
    port: number;
    secure?: boolean;
    secureConnection?: boolean;
    tls?: {
        ciphers?: string;
    }
}

class config {
    path: string = 'default.json'
    currentConfig: configInterface;
    
    constructor() {
        fs.readFile(this.path, 'utf-8', (err, data) => {
            if (err) return console.log(err)
            this.currentConfig = JSON.parse(data);
        })
    }

    public update(newJSON: configInterface) {
        fs.writeFile(this.path, JSON.stringify(newJSON), (err) => {
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