import axios, { Method } from "axios";
import { User } from "./types";

export const API_URL: string = "https://srec.netsoc.cloud/api";

export const UI_URL: string = "/";

console.log(process.env.API_URL);

export interface RequestParams {
  path: string;
  method: Method;
  data?: any;
}

export interface StandardResponse {
  status: number;
  message: string;
  data: any;
}

const exampleResponse: StandardResponse = {
  status: 100,
  message: "Success",
  data: { hello: "world" },
};

export const getToken = async (): Promise<User | null> => {
  const jwt = await localStorage.getItem("token");
  if (jwt) {
    const claims = jwt.split(".")[1];
    const parsedClaims: User = JSON.parse(atob(claims))?.user;
    return parsedClaims;
  }
  return null;
};

export const saveCredentials = async (token: string): Promise<void> => {
  return await localStorage.setItem("token", token);
};

export const deleteCredentials = async (): Promise<void> => {
  return await localStorage.clear();
};

export const request = async (
  props: RequestParams
): Promise<StandardResponse> => {
  try {
    const req = await axios(`${API_URL}${props.path}`, {
      ...props,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return req.data as StandardResponse;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Error",
      data: null,
    };
  }
};

export const fetchPDF = async (path: string) => {
  try {
    const req = await axios({
      url: `${API_URL}${path}`,
      method: "GET",
      responseType: "blob",
      headers: {
        authorization:
          (await localStorage.getItem("token")) !== null
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
      },
    });
    if (req.status === 200) {
      return [req.data, null];
    }
  } catch (e) {
    return [null, e];
  }
};

export const formRequest = async (props: RequestParams) => {
  try {
    const req = await axios({
      url: `${API_URL}${props.path}`,
      ...props,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization:
          (await localStorage.getItem("token")) !== null
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
      },
    });
    if (
      Object.keys(req.data).sort().toString() ==
      Object.keys(exampleResponse).sort().toString()
    ) {
      return req.data as StandardResponse;
    }
  } catch (e) {
    console.log(e);
  }
  return {
    status: 500,
    message: "Error",
    data: null,
  } as StandardResponse;
};
