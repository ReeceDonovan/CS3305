import { Column, Entity as OrmEntity, OneToMany } from "typeorm";

import Entity from "./entity";
import Review, { ReviewStatus } from "./review";
import UsersApplications from "./usersApplications";

export enum AppStatus{
  Draft,
  Review,
  Approval,
  Rejection
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

  @OneToMany(
    () => UsersApplications,
    (usersApplications) => usersApplications.user,
    {
      onDelete: "CASCADE",
    }
  )
  usersApplications: UsersApplications[];

  @OneToMany(() => Review, (review) => review.application, {
    onDelete: "CASCADE",
  })
  reviews: Review[];

  @Column({type: "bool"})
  hasFile: boolean;

  @Column({
        type: "enum",
        enum: AppStatus,
        default: AppStatus.Draft
  })
  app_status: AppStatus;
}
