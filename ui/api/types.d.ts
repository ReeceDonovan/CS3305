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
  uiURL: string;
  apiURL: string;
  signingKey: string;
  landingPageMD: string;
  companyLogo: string;
  emailConfig: {
    provider: string;
    lessSecure?: boolean;
    user: string;
    clientId?: string;
    token: string;
    refreshToken?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    tls?: {
      ciphers: string;
    };
  };
  oauthConfig: {
    oauthClientId: string;
    oauthClientSecret: string;
    allowedDomains: string[];
  };
  databaseConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}