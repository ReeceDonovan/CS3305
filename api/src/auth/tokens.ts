import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../models/user";

export const decodeToken = async (
  token: string
): Promise<{ user: User; exp: Number; iat: Number }> => {
  try {
    return jwt.verify(token, config.get().signingKey, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded;
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};
