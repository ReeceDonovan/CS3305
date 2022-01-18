import { Request, Response } from "express";
import * as faker from "@faker-js/faker";

export class UserHandler {
  getUser(req: Request, res: Response) {
    res.json({
      id: faker.random.number(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
      bio: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
}
