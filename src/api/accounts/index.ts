import express from "express";

import { deposit } from "./deposit";
import { transfer } from "./transfer";

import { tokenValidation } from "../../middlewares/users/auth-token";

const accountsRouter = express.Router();

accountsRouter.post("/deposit", tokenValidation, deposit);

accountsRouter.post("/transfer", tokenValidation, transfer);

export default accountsRouter;
