import { IsEmail, IsEnum } from "class-validator";
import {
  Column,
  Entity as OrmEntity,
  Index,
  ManyToMany,
  OneToMany,
} from "typeorm";

import Application from "./application";
import { dbConn } from "./database";
import Entity from "./entity";
import Review from "./review";

export enum UserType {
  RESEARCHER = "RESEARCHER",
  REVIEWER = "REVIEWER",
}

@OrmEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ type: "text", nullable: false, default: "RESEARCHER" })
  @IsEnum(UserType)
  type: UserType;

  @Index({ unique: true })
  @IsEmail()
  @Column({ nullable: false })
  email: string;

  @Column({ type: "text", nullable: true })
  avatar: string;

  @ManyToMany((_type) => Application, (application) => application.authors)
  applications: Application[];

  @OneToMany((_type) => Review, (review) => review.reviewer)
  reviews: Review[];

  static async getByEmail(email: string) {
    return await dbConn.getRepository(User).findOne({ email });
  }

  static async getById(id: number) {
    return await dbConn.getRepository(User).findOne(id);
  }

  static async getByType(type: UserType) {
    return await dbConn.getRepository(User).find({ type });
  }
}
