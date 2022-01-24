import jwt from "jsonwebtoken";
import config from "../config/config";

export const decodeToken = async (
  token: string
): Promise<{ userID: number; exp: number } | null> => {
  try {
    return jwt.verify(
      token,
      config.get().signingKey,
      (err, decoded: { userID: number; exp: number }) => {
        if (err) {
          return null;
        }
        return decoded;
      }
    );
  } catch (err) {
    console.error(err)
    return null;
  }
};

export const createToken = async (userID: number): Promise<string> => {
  let expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  jwt.sign(
    {
      userID,
      exp: Date.now() / 1000 + 60 * 60 * 24, // 1 day
    },
    config.get().signingKey,
    (err: Error, token: string) => {
      if (err) {
        console.error(err);
        return "";
      }
      return token;
    }
  );
  return "";
};
