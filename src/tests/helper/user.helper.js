import request from "supertest";
import app from "../../index.js";

const createUser = async (email, password) => {
  const response = request(app).post("/api/v1/user/register").send({
    email,
    password,
  });

  return await response;
};

const loginUser = async (email, password) => {
  const response = request(app).post("/api/v1/user/login").send({
    email,
    password,
  });

  return await response;
};

const getUserToken = async () => {
  const response = await request(app).post("/api/v1/user/login").send({
    email: "example@gmail.com",
    password: "mypass",
  });

  return response.body.token;
};

export default { getUserToken, createUser, loginUser };
