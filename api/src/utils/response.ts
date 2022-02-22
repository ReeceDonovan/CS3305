export default interface Response {
  status: number;
  message: string;
  data: unknown;
  // FIXME: Some weird syntax checking conflict
  // eslint-disable-next-line semi
}
