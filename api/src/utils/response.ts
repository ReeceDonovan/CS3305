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
