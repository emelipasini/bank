import express from "express";

import { UserDB } from "../database/user";
import { User } from "../models/user";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
    const userInfo = req.query as unknown as User;

    await UserDB.addUser(userInfo);

    const response = {
        meta: {
            status: 201,
            message: "User created succesfully",
        },
        data: {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            email: userInfo.email,
        },
    };
    return res.status(201).json(response);
});

export default usersRouter;
