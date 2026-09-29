import { email } from "zod";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async ({ email, password }) => {
  const check_user = await prisma.user.findMany({
    where: {
      email,
    },
  });

  if (check_user.length > 0) {
    throw new Error("USER_EXIST");
  }
  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: password_hash,
    },
    select: {
      id: true,
      email: true,
    },
  });
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const compair_password = await bcrypt.compare(password, user.passwordHash);
  if (!compair_password) throw new Error("INVALID_CREDENTIALS");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token, user: { id: user.id, email: user.email } };
};
export default {
  createUser,
  loginUser,
};
