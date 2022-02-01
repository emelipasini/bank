import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";

import { UserDB } from "../database/user";
import { User } from "../domain/models/user";
import { reply } from "../domain/utils/functions";

import { registerChecks, registerValidation } from "../middlewares/users/register";
import { loginChecks, loginValidation } from "../middlewares/users/login";

const usersRouter = express.Router();

usersRouter.post("/register", registerChecks, registerValidation, async (req: Request, res: Response) => {
    const userInfo = req.query as unknown as User;

    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    const newUser = new User(userInfo.firstname, userInfo.lastname, userInfo.email, userInfo.password);

    await UserDB.addUser(newUser);

    const data = {
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
    };
    const response = reply(201, "User created succesfully", data);
    return res.status(201).json(response);
});

usersRouter.post("/login", loginChecks, loginValidation, async (req: Request, res: Response) => {
    const user = req.query.user as any;

    const token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        },
        config.get("JWT_SECRET")
    );

    const response = reply(200, "User logged in", { token });
    return res.status(200).json(response);
});

export default usersRouter;
