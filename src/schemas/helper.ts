import { z } from "zod";

export const dateParser = z.preprocess((arg) => {
  if (typeof arg === "string") {
    return new Date(arg.split("#")[0]);
  }
  if (arg instanceof Date) {
    return new Date(arg);
  }
}, z.date());
