import express from "express";

import { register } from "./register";
import { login } from "./login";

import { registerChecks, registerValidation } from "../../middlewares/users/register";
import { loginChecks, loginValidation } from "../../middlewares/users/login";

const usersRouter = express.Router();

usersRouter.post("/register", registerChecks, registerValidation, register);

usersRouter.post("/login", loginChecks, loginValidation, login);

export default usersRouter;
