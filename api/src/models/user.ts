import { Expose } from "class-transformer";
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

@OrmEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ default: "" })
  name: string;

  @Index({ unique: true })
  @IsEmail()
  @Column()
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  school: string;

  @Column({ default: "" })
  avatar: string;

  @IsEnum(["researcher", "reviewer"])
  @Column({ default: "researcher" })
  role: string;

  @ManyToMany(() => Application, (application) => application.supervisors)
  applications: Application[];

  @ManyToMany(() => Application, (application) => application.reviewers)
  reviewerApplications: Application[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];

  @Expose() get lastReviewed(): Date | undefined {
    if (this.reviews.length > 0) {
      return this.reviews[this.reviews.length - 1].createdAt;
    }
  }

  static async getById(id: number): Promise<User | undefined> {
    return await dbConn.getRepository(User).findOne(id);
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    return await dbConn.getRepository(User).findOne({ email });
  }
}
