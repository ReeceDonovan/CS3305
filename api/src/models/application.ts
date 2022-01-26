import { IsEnum } from "class-validator";

import { Column,
  Entity as OrmEntity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne
 } from "typeorm";
import { dbConn } from "./database";

import Entity from "./entity";
import Review from "./review";
import User from "./user";

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
  field: string;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinTable()
  submitter: User;

  @ManyToMany(() => User, (user) => user.applications)
  @JoinTable()
  supervisors: User[];

  @ManyToMany(() => User, (user) => user.applications)
  @JoinTable()
  coauthors: User[];

  @ManyToMany(() => User, (user) => user.reviewerApplications)
  @JoinTable()
  reviewers: User[];

  @OneToMany(() => Review, (review) => review.application)
  @JoinTable()
  reviews: Review[];

  static async getById(id: number, relations = false) {
    return await dbConn.getRepository(Application).findOne({
      where: { id },
      relations: (relations) ? ['reviews', 'submitter', 'supervisors', 'coauthors', 'reviewers'] 
        : []
    });
  }

  static async getByName(name: string) {
    return await dbConn.getRepository(Application).findOne({ name });
  }

  static async getByField(field: string) {
    return await dbConn.getRepository(Application).find({ field });
  }

  async addReview(review: Review) {
    if (review.reviewer?.id) {
      this.reviewers.push(review.reviewer);
      if (review.reviewer.reviews) {
        review.reviewer.reviews.push(review);
      } else {
        review.reviewer.reviews = [review];
      }
      review.reviewer.save();
    }

    await review.save();
    this.reviews = (this.reviews) ? [...this.reviews, review] : [review];
    await this.save();
  }
}
