import express from "express";
import { createUser, loginUser } from "../controllers/user.controller.js";

const route = express.Router();

route.post("/user/register", createUser);
route.post("/user/login", loginUser);

export default route;
