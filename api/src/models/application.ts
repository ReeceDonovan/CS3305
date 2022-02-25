import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";
import { Column, Entity as OrmEntity, OneToMany } from "typeorm";

import Entity from "./entity";
import Review, { ReviewStatus } from "./review";
import UsersApplications from "./usersApplications";

export enum AppStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  REVIEW = "REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@OrmEntity("applications")
export default class Application extends Entity {
  constructor(application: Partial<Application>) {
    super();
    Object.assign(this, application);
  }

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  status: ReviewStatus;

  @Column({ type: "text", nullable: true })
  field: string;

  @Expose({ name: "user_connection" })
  @OneToMany(
    () => UsersApplications,
    (usersApplications) => usersApplications.application,
    {
      onDelete: "CASCADE",
    }
  )
  usersApplications: UsersApplications[];

  @OneToMany(() => Review, (review) => review.application, {
    onDelete: "CASCADE",
  })
  reviews: Review[];

  @Column({ type: "bool" })
  hasFile: boolean;

  @Column({
    type: "text",
    default: AppStatus.DRAFT,
  })
  @IsEnum(AppStatus)
  app_status: AppStatus;
}
