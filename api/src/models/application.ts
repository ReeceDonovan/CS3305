import { IsEnum } from "class-validator";
import { Column, Entity as OrmEntity, OneToMany } from "typeorm";

import Entity from "./entity";
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

  @OneToMany(() => User, (user) => user.applications)
  supervisors: User[];

  @OneToMany(() => User, (user) => user.reviewerApplications)
  reviewers: User[];

  // enum of progress state
  @Column()
  @IsEnum(["pending", "in progress", "reviewed", "completed"])
  progress: string;

  // enum of acceptance state
  @Column()
  @IsEnum(["pending", "action needed", "accepted", "rejected"])
  acceptance: string;
}
