import { IsEnum } from "class-validator";
import { Column, Entity as OrmEntity, ManyToOne } from "typeorm";

import Application from "./application";
import Entity from "./entity";
import User from "./user";

@OrmEntity("reviews")
export default class Review extends Entity {
  constructor(review: Partial<Review>) {
    super();
    Object.assign(this, review);
  }

  @ManyToOne(() => User, (user) => user.reviews)
  reviewer: User;

  @ManyToOne(() => Application, (application) => application.reviews)
  application: Application;

  // Review status (Approved, Rejected, Needs Action)
  @IsEnum(["approved", "needs action", "rejected"])
  @Column()
  status: string;

  @Column()
  comments: string;
}
