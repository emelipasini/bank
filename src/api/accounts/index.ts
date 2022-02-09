import express from "express";

import { deposit } from "./deposit";

import { tokenValidation } from "../../middlewares/users/auth-token";

const accountsRouter = express.Router();

accountsRouter.post("/deposit", tokenValidation, deposit);

export default accountsRouter;
