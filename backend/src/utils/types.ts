import { ZodType, z } from "zod";

type DeepNonNullable<T> = T extends (infer U)[]
  ? DeepNonNullable<U>[]
  : T extends object
  ? { [K in keyof T]: DeepNonNullable<T[K]> }
  : NonNullable<T>;

export type Infer<T extends ZodType> = DeepNonNullable<z.infer<T>>;
