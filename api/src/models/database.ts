import { createConnection } from "typeorm";

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
  } catch (err) {
    console.error(err);
  }
};
