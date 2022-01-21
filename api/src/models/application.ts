import { IsEnum } from "class-validator";
import { Column, Entity as OrmEntity, ManyToMany, OneToMany } from "typeorm";
import { dbConn } from "./database";

import Entity from "./entity";
import Review from "./review";
import User from "./user";

@OrmEntity("applications")
export default class Application extends Entity {
  constructor(application: Partial<Application>) {
    super();
    Object.assign(this, application);
  }

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  field: string;

  @ManyToMany(() => User, (user) => user.applications)
  supervisors: User[];

  @ManyToMany(() => User, (user) => user.applications)
  coauthors: User[];

  @ManyToMany(() => User, (user) => user.reviewerApplications)
  reviewers: User[];

  @OneToMany(() => Review, (review) => review.application)
  reviews: Review[];

  @IsEnum(["pending", "in progress", "completed"])
  @Column({ default: "pending" })
  progress: string;

  @IsEnum(["pending", "accepted", "rejected"])
  @Column({ default: "pending" })
  acceptance: string;

  static async getById(id: number): Promise<Application | undefined> {
    return await dbConn.getRepository(Application).findOne(id);
  }
}
