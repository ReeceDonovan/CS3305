import { Column, Entity as OrmEntity, JoinColumn, ManyToOne } from "typeorm";

import Application from "./application";
import Entity from "./entity";
import User from "./user";
import { IsEnum } from "class-validator";

export enum ReviewStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  DECLINED = "DECLINED",
}

@OrmEntity("reviews")
export default class Review extends Entity {
  constructor(review: Partial<Review>) {
    super();
    Object.assign(this, review);
  }

  @Column({ type: "text", nullable: true })
  comment: string;

  @Column({ type: "enum", enum: ReviewStatus, default: ReviewStatus.PENDING })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @ManyToOne(() => Application, (application) => application.reviews)
  @JoinColumn({ name: "application_id" })
  application: Application;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: "user_id" })
  user: User;
}
