import { NextFunction, Request, Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";

import { reply } from "../../domain/utils/functions";

export function tokenValidation(req: Request, res: Response, next: NextFunction) {
    const auth = req.get("authorization");

    if (!(auth && auth.startsWith("Bearer"))) {
        const response = reply(401, "Unauthorized");
        return res.status(401).json(response);
    }

    const token = auth.slice("Bearer ".length);
    const decodedToken = jwt.verify(token, config.get("JWT_SECRET"));

    if (!decodedToken) {
        const response = reply(401, "Unauthorized");
        return res.status(401).json(response);
    }

    req.query.user = decodedToken;

    next();
}
