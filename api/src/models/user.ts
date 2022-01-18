import faker = require("@faker-js/faker");

import { Entity, PrimaryColumn, Column } from "typeorm";
import { IsEmail } from 'class-validator'

@Entity()
export default class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  bio: string;

  @Column()
  school: string;

  @Column()
  // base64 png or URL
  avatar: string;

  getFromId(this: User): User {
    (this.name = faker.name.findName()),
      (this.email = faker.internet.email()),
      (this.bio = faker.lorem.sentence());
    return this;
  }

  getFromEmail(this: User): User {
    (this.id = faker.datatype.number()),
      (this.name = faker.name.findName()),
      (this.bio = faker.lorem.sentence());
    return this;
  }

  static create(email: string): User {
    var user = new User()
    user.id = faker.datatype.number(),
    user.name = faker.name.findName(),
    user.email = email,
    user.bio = faker.lorem.sentence()
    return user
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
