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
  INREVIEW = "INREVIEW",
  DECLINED = "DECLINED",
}

// TODO: Nuke most of this cause reviews are just internal comments now.
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

  @ManyToOne(() => Application, (application) => application.reviews)
  application: Application;

  @ManyToMany(() => User, (user) => user.reviews)
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

// TODO: Clean up methods
export async function createReviewers() {
  let i = 0;
  for await (const reviewer of await dbConn
    .getRepository(User)
    .find({ where: { type: "REVIEWER" } })) {
    if (reviewer.reviews.length > 0) continue;

    const applications = dbConn
      .getRepository(Application)
      .find({ relations: ["reviewers"] });
    const application: Application = await applications[
      i++ % (await applications).length
    ];

    const review = new Review({
      status: ReviewStatus.PENDING,
      application: application,
      reviewer: reviewer,
    });

    await dbConn.getRepository(Review).save(review);
  }
}
