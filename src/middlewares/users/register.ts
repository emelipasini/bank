import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";

import { UserDB } from "../../database/user";
import { reply } from "../../domain/utils/functions";

export const registerChecks = [
    query("firstname", "The firstname is required").trim().isLength({ min: 2 }),
    query("lastname", "The lastname is required").trim().isLength({ min: 2 }),
    query("email", "The email is not valid").isEmail(),
    query("password", "The password is not secure").trim().isLength({ min: 8 }).isAlphanumeric(),
];

export async function registerValidation(req: Request, res: Response, next: NextFunction) {
    const emailExists = await UserDB.findUser(req.query.email as string);
    if (emailExists) {
        const response = reply(400, "The email already exists in the database");
        return res.status(400).json(response);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response = reply(400, "Bad Request", { errors: errors.array() });
        return res.status(400).json(response);
    }

    next();
}
