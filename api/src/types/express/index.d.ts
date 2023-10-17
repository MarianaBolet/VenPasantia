// src/types/express/index.d.ts

import { JwtPayload } from "jsonwebtoken";
import { User } from "../../models/User";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      userId: User["id"];
      user?: User;
    }
  }
}
