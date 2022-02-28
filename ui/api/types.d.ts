import { FileStatus } from "carbon-components-react/lib/components/FileUploader/shared";

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  role: string;
  email: string;
  name?: string;
  bio?: string;
  school?: string;
  avatar?: string;
  applications?: Application[];
  applicationRole?: string;
  reviews?: Review[];
}

export interface Application extends BaseEntity {
  name: string;
  description?: string;
  status?: string;
  field?: string;
  hasFile?: boolean;
  appStatus: AppStatus;
  users?: User[];
  applicationRole?: string;
  reviews?: Review[];
}

export interface UsersApplications extends BaseEntity {
  role: string;
  userId?: number;
  applicationId?: number;
  user?: User;
  application?: Application;
}

export interface Review extends BaseEntity {
  comment?: string;
  status: string;
  application_id?: number;
  application?: Application;
  user_id?: number;
  user?: User;
}

export interface FileRef {
  name: string;
  status: FileStatus;
}

export enum AppStatus {
  Draft,
  Review,
  Approval,
  Rejection,
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
