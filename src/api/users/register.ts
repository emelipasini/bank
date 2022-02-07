import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserDB } from "../../database/user";
import { AccountDB } from "../../database/account";

import { User, Account, Currency } from "../../domain/models";
import { reply } from "../../domain/utils/functions";

export async function register(req: Request, res: Response) {
    try {
        const userInfo = req.query as unknown as User;

        userInfo.password = await bcrypt.hash(userInfo.password, 10);
        const newUser = new User(userInfo.firstname, userInfo.lastname, userInfo.email, userInfo.password);

        await UserDB.addUser(newUser);

        const arsAccount = new Account(newUser._id!, Currency.ARS);
        const usdAccount = new Account(newUser._id!, Currency.USD);

        await AccountDB.addAccount(arsAccount);
        await AccountDB.addAccount(usdAccount);

        const data = generateReplyData(newUser, arsAccount.cbu, usdAccount.cbu);

        const response = reply(201, "User created succesfully", data);
        return res.status(201).json(response);
    } catch (error) {
        const response = reply(500, "Unexpected error", { error });
        return res.status(500).json(response);
    }
}

function generateReplyData(newUser: User, arsCBU: string, usdCBU: string) {
    return {
        user: {
            id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
        },
        accounts: [
            {
                cbu: arsCBU,
                currency: "ARS",
            },
            {
                cbu: usdCBU,
                currency: "USD",
            },
        ],
    };
}
