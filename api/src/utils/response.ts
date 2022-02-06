export default interface Response {
  status: number;
  message: string;
  data: any;
};

export const sample_401_res: Response = {
  status: 401,
  message: "Unauthorized",
  data: null,
}

export const sample_404_res: Response = {
  status: 404,
  message: "Not found",
  data: null,
}

export const sample_200_res: Response = {
  status: 200,
  message: "Success",
  data: null,
}