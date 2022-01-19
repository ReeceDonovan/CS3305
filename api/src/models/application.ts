import faker = require("@faker-js/faker");
import { Entity, PrimaryColumn, Column } from "typeorm";
import User from "./user";

export default class Application {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  school: string;

  @Column()
  course: string;

  @Column()
  supervisors: User[] = [];

  constructor(
    id: number,
    name: string,
    description: string,
    school: string,
    course: string,
    supervisors: User[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.school = school;
    this.course = course;
    this.supervisors = supervisors;
  }

  getFromId(this: Application): Application {
    return new Application(
      this.id,
      faker.name.findName(),
      faker.lorem.sentences(2),
      faker.lorem.word(),
      faker.lorem.word(),
      [User.create(faker.internet.email(), faker.internet.avatar())]
    );
  }

  update(this: Application): Application {
    // update user to database
    return this;
  }

  delete(this: Application): Application {
    // delete user from database
    return this;
  }
}
