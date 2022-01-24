import axios, { Method } from "axios";

export interface RequestParams {
  path: string;
  method: Method;
  body?: any;
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

const API_URL = "http://localhost:8000";

export const saveCredentials = async (token: string): Promise<void> => {
  await localStorage.setItem("token", token);
};

export const request = async (
  props: RequestParams
): Promise<StandardResponse> => {
  try {
    const req = await axios(`${API_URL}${props.path}`, {
      method: props.method,
      data: props.body,
      headers: {
        authorization:
          localStorage.getItem("token") !== null
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
  } finally {
    return {
      message: "Unkown error",
      status: 500,
      data: null,
    } as StandardResponse;
  }
};

export const fetchPDF = async (id: number) => {
  try {
    const req = await axios.get(
      `http://localhost:8000/applications/${id}/form`,
      {
        responseType: "blob",
        headers: {
          authorization:
            (await localStorage.getItem("token")) !== null
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
        },
      }
    );
    return req.data;
  } catch (e) {
    console.log(e);
  }
};

export const formRequest = async (props: RequestParams) => {
  try {
    const req = await axios({
      url: `${API_URL}${props.path}`,
      method: props.method,
      data: props.body,
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
  } finally {
    return {
      message: "Unkown error",
      status: 500,
      data: null,
    } as StandardResponse;
  }
};
