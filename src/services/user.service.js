import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create a new user account after checking for duplicates.
const createUser = async ({ email, password }) => {
  // Check whether a user with the same email already exists.
  const check_user = await prisma.user.findMany({
    where: {
      email,
    },
  });

  if (check_user.length > 0) {
    throw new Error("USER_EXIST");
  }
  // Hash the password before storing it.
  const password_hash = await bcrypt.hash(password, 10);
  // Create the user record with only the selected fields returned.
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

// Authenticate an existing user and issue a JWT token.
const loginUser = async ({ email, password }) => {
  // Find the user by email.
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  // Compare the provided password with the stored hash.
  const compair_password = await bcrypt.compare(password, user.passwordHash);
  if (!compair_password) throw new Error("INVALID_CREDENTIALS");

  // Generate a JWT for authenticated access.
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
