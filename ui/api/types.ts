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
  app_connection?: UsersApplications[];
  reviews?: Review[];
}

export interface Application extends BaseEntity {
  name: string;
  description?: string;
  status?: string;
  field?: string;
  user_connection?: UsersApplications[];
  reviews?: Review[];
  hasFile?: boolean;
  app_status: AppStatus;
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
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  PENDING = "PENDING",
  REVIEW = "REVIEW",
  APPROVAL = "APPROVED",
  REJECTED = "REJECTED",
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
