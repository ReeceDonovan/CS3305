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
