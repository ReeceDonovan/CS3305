import { createConnection } from "typeorm";
import User, { UserType } from "./user";

import config from "../config/config";

export const createConn = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: config.get().databaseConfig.host,
      port: config.get().databaseConfig.port,
      username: config.get().databaseConfig.username,
      password: config.get().databaseConfig.password,
      database: config.get().databaseConfig.database,
      synchronize: true,
      logging: false,
      entities: [__dirname + "/../models/*.ts"],
    });
    console.log("Connected to database");

    const coordinatorEmails = config.get().coordinatorEmails;
    if (coordinatorEmails.length > 0) {
      coordinatorEmails.forEach(async (email) => {
        if (email !== "") {
          
          const user = await User.findOne({ email });
          if (!user) {
            const user = new User({
              email,
            });
            user.role = UserType.COORDINATOR;
            await user.save();

          console.log("Created coordinator user: ", user);
          }
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};
