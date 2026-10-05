import express from "express";
import { createUser, loginUser } from "../controllers/user.controller.js";
import Validate from "../middlewares/validate.middleware.js";
import userSchema from "../schemas/user.schema.js";

const route = express.Router();

route.post("/user/register", Validate(userSchema), createUser);
route.post("/user/login", Validate(userSchema), loginUser);

export default route;
