import { tryCatch } from "bullmq";
import userService from "../services/user.service.js";

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Created user successful.",
      result,
    });
  } catch (error) {
    if (error.message == "USER_EXIST") {
      res.status(409).json({ success: false, message: "User already exist." });
    }

    throw error;
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: result.token,
      ...result,
    });
  } catch (error) {
    if (error.message == "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    throw error;
  }
};

export { createUser, loginUser };
