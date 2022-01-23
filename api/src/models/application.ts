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

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "text", nullable: false })
  field: string;

  @ManyToMany((_type) => User, (user) => user.applications)
  authors: User[];

  @ManyToMany((_type) => User, (user) => user.applications)
  supervisors: User[];

  @ManyToMany((_type) => User, (user) => user.applications)
  reviewers: User[];

  @OneToMany((_type) => Review, (review) => review.application)
  reviews: Review[];

  static async getById(id: number) {
    return await dbConn.getRepository(Application).findOne(id);
  }

  static async getByName(name: string) {
    return await dbConn.getRepository(Application).findOne({ name });
  }

  static async getByField(field: string) {
    return await dbConn.getRepository(Application).find({ field });
  }
}
