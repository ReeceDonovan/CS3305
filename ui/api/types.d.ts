import { FileStatus } from "carbon-components-react/lib/components/FileUploader/shared";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  email: string;
  name?: string;
  bio?: string;
  school?: string;
  avatar?: string;
  appConnection?: UsersApplications[];
  reviews?: Review[];
}

export interface FileRef{
  name: string;
  status: FileStatus;
}

export enum AppStatus{
  Draft,
  Review,
  Approval,
  Rejection
}

export interface Application {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  status?: string;
  field?: string;
  userConnection?: UsersApplications[];
  reviews?: Review[];
  hasFile?: boolean;
  appStatus: AppStatus;
}

export interface UsersApplications {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  userId?: number;
  applicationId?: number;
  user?: User;
  application?: Application;
}

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  comment?: string;
  status: string;
  applicationId?: number;
  userId?: number;
  application?: Application;
  reviewer: User;
  user?: User;
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
