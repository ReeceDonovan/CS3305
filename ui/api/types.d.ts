export interface User {}

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

export interface Review {}
