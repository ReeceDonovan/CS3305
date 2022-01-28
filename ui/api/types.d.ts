export interface User {
  name: string;
  email: string;
  bio: string;
  field: string;
  role: string;
  reviews: Review[];
}

export interface Application {
  id: number;
  name: string;
  description: string;
  field: string;
  submitter: User;
  authors?: User[];
  supervisors?: User[];
  reviewers?: User[];
  reviews?: Review[];
}

export interface Review {
  id: number;
  application: Application;
  reviewer: User;
  status: string;
  comment: string;
}

export interface configInterface {
  emailProvider: string;
  emailUser: string;
  emailToken: string;
  emailConfigs: Array<emailConfig>;
  oauthConfig: oauthConfig;
  signingKey: string;
  landingPageMD: string;
  databaseConfig: databaseConfig;
}

export interface emailConfig {
  host: string;
  port: number;
  secure?: boolean;
  tls?: {
    ciphers?: string;
  };
}

export interface oauthConfig {
  oauthClientId: string;
  oauthClientSecret: string;
  allowedDomains: Array<string>;
}

export interface databaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}