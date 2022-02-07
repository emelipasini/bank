import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { UserDB } from "../../database/user";

import { User } from "../../domain/models/user";
import { reply } from "../../domain/utils/functions";

export const loginChecks = [
    query("email", "The email is not valid").isEmail(),
    query("password", "The password is not secure").trim().isLength({ min: 8 }).isAlphanumeric(),
];

export async function loginValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const response = reply(400, "Bad Request", { errors: errors.array() });
            return res.status(400).json(response);
        }

        const { email, password } = req.query as { email: string; password: string };

        const user = (await UserDB.findUser(email)) as unknown as User;
        if (!user) {
            const response = reply(400, "Invalid credentials");
            return res.status(400).json(response);
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            const response = reply(400, "Invalid credentials");
            return res.status(400).json(response);
        }

        req.query.user = {
            _id: user._id as unknown as string,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };

        next();
    } catch (error) {
        const response = reply(500, "Unexpected error", { error });
        return res.status(500).json(response);
    }
}
