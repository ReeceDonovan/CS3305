import { Column, Entity as OrmEntity, JoinColumn, ManyToOne } from "typeorm";

import Application from "./application";
import Entity from "./entity";
import User from "./user";

export enum RoleType {
  SUBMITTER = "SUBMITTER",
  SUPERVISOR = "SUPERVISOR",
  COAUTHOR = "COAUTHOR",
  REVIEWER = "REVIEWER",
}

@OrmEntity({ name: "users_applications" })
export default class UsersApplications extends Entity {
  constructor(usersApplications: Partial<UsersApplications>) {
    super();
    Object.assign(this, usersApplications);
  }

  @Column({ type: "enum", enum: RoleType, default: RoleType.SUBMITTER })
  role: RoleType;

  @ManyToOne(() => User, (user) => user.usersApplications)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Application, (application) => application.usersApplications)
  @JoinColumn({ name: "application_id" })
  application!: Application;
}
