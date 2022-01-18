import faker = require("@faker-js/faker");
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  bio: string;

  @Column()
  school: string;

  @Column()
  // base64 png
  avatar: string;

  constructor(id: number, name: string, email: string, bio: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.bio = bio;
  }

  getFromId(this: User) {
    return new User(
      this.id,
      faker.name.findName(),
      faker.internet.email(),
      faker.lorem.sentence()
    );
  }

  getFromEmail(this: User): User {
    return new User(
      faker.datatype.number(),
      faker.name.findName(),
      this.email,
      faker.lorem.sentence()
    );
  }

  static create(email: string): User {
    return new User(
      faker.datatype.number(),
      faker.name.findName(),
      email,
      faker.lorem.sentence()
    );
  }

  update(this: User): User {
    // update user to database
    return this;
  }

  delete(this: User): User {
    // delete user from database
    return this;
  }
}
