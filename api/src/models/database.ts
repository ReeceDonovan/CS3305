import { Connection, createConnection } from "typeorm";

import config from "../config/config";

// eslint-disable-next-line no-var
export var dbConn: Connection;

export const createConn = async (): Promise<void> => {
  try {
    dbConn = await createConnection({
      type: "postgres",
      host: config.get().databaseConfig.host,
      port: config.get().databaseConfig.port,
      username: config.get().databaseConfig.username,
      password: config.get().databaseConfig.password,
      database: config.get().databaseConfig.database,
      synchronize: true,
      logging: true,
      entities: [__dirname + "/../models/*.ts"],
    });
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};
