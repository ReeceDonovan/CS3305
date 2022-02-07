import { IsEmail, IsEnum } from "class-validator";
import { Column, Entity as OrmEntity, Index, OneToMany } from "typeorm";

import { dbConn } from "./database";
import Entity from "./entity";
// import Review from "./review";
import UsersApplications from "./usersApplications";

export enum UserType {
  RESEARCHER = "RESEARCHER",
  REVIEWER = "REVIEWER",
  COORDINATOR = "COORDINATOR",
}

@OrmEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ type: "text", nullable: false, default: "RESEARCHER" })
  @IsEnum(UserType)
  role: UserType;

  @Index({ unique: true })
  @IsEmail()
  @Column({ nullable: false })
  email: string;

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "text", nullable: true })
  school: string;

  @Column({ type: "text", nullable: true })
  avatar: string;

  @OneToMany(
    () => UsersApplications,
    (usersApplications) => usersApplications.application
  )
  usersApplications: UsersApplications[];

  // @OneToMany(() => Review, (review) => review.reviewer)
  // reviews: Review[];
  //
  static async getByEmail(email: string) {
    return await dbConn.getRepository(User).findOne({ email });
  }

  static async getById(id: number, relations: string[] = []) {
    return await dbConn.getRepository(User).findOne({
      where: { id },
      relations,
    });
  }

  static async getByType(role: UserType) {
    return await dbConn.getRepository(User).find({ role });
  }
}
