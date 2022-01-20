import faker = require("@faker-js/faker");
import { Entity as OrmEntity, PrimaryColumn, Column } from "typeorm";
import User from "./user";
import Entity from "./entity";
import { IsEnum } from "class-validator";

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

  @Column()
  supervisors: User[];

  @Column()
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
