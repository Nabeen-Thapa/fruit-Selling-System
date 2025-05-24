// src/types/express.d.ts

import { User } from "src/users/models/user.model";

declare global {
  namespace Express {
   export interface Request {
      user?: User;
    }
  }
}
