import {
  Column,
  Entity as OrmEntity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";

import Application from "./application";
import { dbConn } from "./database";
import Entity from "./entity";
import User from "./user";

export enum ReviewStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  DECLINED = "DECLINED",
}

@OrmEntity("reviews")
export default class Review extends Entity {
  constructor(review: Partial<Review>) {
    super();
    Object.assign(this, review);
  }

  @Column({ type: "text", nullable: true })
  comment: string;

  @Column({ type: "text", nullable: true })
  status: ReviewStatus;

  @ManyToOne((_type) => Application, (application) => application.reviews)
  // @JoinTable()
  application: Application;

  @ManyToMany((_type) => User, (user) => user.reviews)
  @JoinTable()
  reviewer: User;

  static async findById(id: string) {
    return await dbConn.getRepository(Review).findOne(id);
  }

  static async findByApplication(application: Application) {
    return await dbConn.getRepository(Review).find({ application });
  }

  static async findByReviewer(reviewer: User) {
    return await dbConn.getRepository(Review).find({ reviewer });
  }

  static async findByStatus(status: ReviewStatus) {
    return await dbConn.getRepository(Review).find({ status });
  }
}

export async function createReviewers() {
  let i = 0;
  for await (const reviewer of await dbConn
    .getRepository(User)
    .find({ where: { type: "REVIEWER" } })) {
    if (reviewer.reviews.length > 0) continue;

    let applications = dbConn
      .getRepository(Application)
      .find({ relations: ["reviewers"] });
    let application: Application = await applications[
      i++ % (await applications).length
    ];

    let review = new Review({
      status: ReviewStatus.PENDING,
      application: application,
      reviewer: reviewer,
    });

    await dbConn.getRepository(Review).save(review);
  }
}
