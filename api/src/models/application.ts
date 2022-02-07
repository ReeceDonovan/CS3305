import { Column, Entity as OrmEntity, OneToMany } from "typeorm";

import { dbConn } from "./database";
import Entity from "./entity";
import { /*Review,*/ ReviewStatus } from "./review";
import UsersApplications from "./usersApplications";

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

  // @OneToMany(() => Review, (review) => review.application, {
  //   onDelete: "CASCADE",
  // })
  // reviews: Review[];

  // TODO: Clean up methods
  static async getById(id: number, relations: string[] = []) {
    const resp = await dbConn.getRepository(Application).findOne({
      where: { id },
      relations,
    });
    console.log(resp);
    return resp;
  }

  static async getByName(name: string) {
    return await dbConn.getRepository(Application).findOne({ name });
  }

  static async getByField(field: string) {
    return await dbConn.getRepository(Application).find({ field });
  }

  // async addReview(review: Review) {
  //   console.log("addReview");
  //   // if (review.reviewer?.id) {
  //   //   if (this.reviewers) {
  //   //     this.reviewers.push(review.reviewer);
  //   //   } else {
  //   //     this.reviewers = [review.reviewer];
  //   //   }
  //   //   review.reviewer.save();
  //   // }

  //   await review.save();
  //   this.reviews = this.reviews ? [...this.reviews, review] : [review];
  //   await this.save();
  // }
}
