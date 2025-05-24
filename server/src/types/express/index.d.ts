// src/types/express/index.d.ts

import { JwtUserPayload } from "src/users/types/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
