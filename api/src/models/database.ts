import { Connection, createConnection } from "typeorm";

import config from "../config/config";

export var dbConn: Connection;

export const createConn = async (): Promise<void> => {
  await config.get();
  try {
    dbConn = await createConnection({
      type: "postgres",
      host: config.read().databaseConfig.host,
      port: config.read().databaseConfig.port,
      username: config.read().databaseConfig.username,
      password: config.read().databaseConfig.password,
      database: config.read().databaseConfig.database,
      synchronize: true,
      logging: true,
      entities: [__dirname + "/../models/*.ts"],
    });
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};
