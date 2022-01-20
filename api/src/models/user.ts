import {
  Entity as OrmEntity,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
  UpdateResult,
  DeleteResult,
  Index,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { IsEmail, IsEnum } from "class-validator";

import { dbConn } from "./database";
import faker from "@faker-js/faker";
import Entity from "./entity";
import Application from "./application";

@OrmEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Column()
  name: string;

  @Index({ unique: true })
  @IsEmail()
  @Column()
  email: string;

  @Column()
  bio: string;

  @Column()
  school: string;

  // avatar as base64 string
  @Column()
  avatar: string;

  @Column()
  @IsEnum(["researcher", "reviewer"])
  role: string;

  // Many to Many relationship between user and application based off application supervisors
  @ManyToMany(() => Application, (application) => application.supervisors)
  applications: Application[];

  // if the user is a reviewer, have a relationship between user and applications they are assigned to review based on application.reviewers
  @OneToMany(() => Application, (application) => application.reviewers)
  reviewerApplications: Application[];

  // get user by id
  static async getById(id: number): Promise<User | undefined> {
    return await dbConn.getRepository(User).findOne(id);
  }

  // get user by email
  static async getByEmail(email: string): Promise<User | undefined> {
    return await dbConn.getRepository(User).findOne({ email });
  }
}
