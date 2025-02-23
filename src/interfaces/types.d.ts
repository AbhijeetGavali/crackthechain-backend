export interface CustomResponse {
  data: unknown;
  error: unknown;
  message: string;
}

export type RequestContext = {
  auth?: string;
};
