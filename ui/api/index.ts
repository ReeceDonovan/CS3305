import axios, { Method } from "axios";

export interface RequestParams {
  path: string;
  method: Method;
  data?: any;
  // headers?: any
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

const API_URL = "/api";

export const saveCredentials = async (token: string): Promise<void> => {
  await localStorage.setItem("token", token);
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
    return {
      data: req.data,
      message: "Success",
      status: req.status,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Error",
      data: null,
    };
  }
};

export const fetchPDF = async (id: string) => {
  try {
    const req = await axios({
      url: `/api/applications/${id}/form`,
      method: "GET",
      responseType: "blob",
      headers: {
        authorization:
          (await localStorage.getItem("token")) !== null
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
      },
    });
    return req.data;
  } catch (e) {
    console.log(e);
  }
};

export const formRequest = async (props: RequestParams) => {
  try {
    const req = await axios({
      url: `${API_URL}${props.path}`,
      ...props,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "authorization":
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
    return {
      status: 500,
      message: "Error",
      data: null,
    } as StandardResponse;
  } 
};
