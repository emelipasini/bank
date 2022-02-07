import { Request, Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";

import { User } from "../../domain/models";
import { reply } from "../../domain/utils/functions";

export async function login(req: Request, res: Response) {
    try {
        const user = req.query.user as any;

        const token = generateToken(user);

        const response = reply(200, "User logged in", { token });
        return res.status(200).json(response);
    } catch (error) {
        const response = reply(500, "Unexpected error", { error });
        return res.status(500).json(response);
    }
}

function generateToken(user: User) {
    return jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        },
        config.get("JWT_SECRET")
    );
}
