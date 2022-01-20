import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, UpdateResult, DeleteResult } from "typeorm";
import { IsEmail, IsEnum } from "class-validator";

import { dbConn } from "./database";

@Entity()
export default class User {
  @PrimaryGeneratedColumn("increment")
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEnum(["applicant", "reviewer"])
  role: string;

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

  static async fromDB(user: Partial<User>): Promise<User> {
    var u = new User();
    (u.id = user.id),
      (u.name = user.name),
      (u.email = user.email),
      (u.role = user.role),
      (u.bio = user.bio);
    (u.school = user.school), (u.avatar = user.avatar);
    return u;
  }

  async getFromId(this: User): Promise<User> {
    const user = await dbConn.getRepository(User).findOne(this.id);

    (this.name = user.name),
      (this.email = user.email),
      (this.role = user.role),
      (this.bio = user.bio);
      (this.school = user.school), (this.avatar = user.avatar);

    return this;
  }

  async getFromEmail(this: User): Promise<User> {
    const user = await dbConn.getRepository(User).findOne({
      where: { email: this.email },
    });

    (this.id = user.id), (this.name = user.name), (this.bio = user.bio);
    (this.school = user.school), (this.avatar = user.avatar);

    return this;
  }

  static create(email: string, avatar: string): User {
    var user = new User();
    (user.id = faker.datatype.number()),
      (user.name = faker.name.findName()),
      (user.email = email),
      (user.bio = faker.lorem.sentence());
    return user;
  }

  async update(this: User): Promise<UpdateResult> {
    return await dbConn.getRepository(User).update(this.id, this);
  }

  async delete(this: User): Promise<DeleteResult> {
    return await dbConn.getRepository(User).delete(this.id);
  }
}
