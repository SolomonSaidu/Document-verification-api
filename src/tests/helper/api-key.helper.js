import request from "supertest";
import app from "../../index.js";
import userHelper from "./user.helper.js";

const getApiKey = async () => {
  const token = await userHelper.getUserToken();

  const apiKeyResponse = await request(app)
    .post("/api/v1/api-key")
    .set("Authorization", `Bearer ${token}`)
    .send({
      api_name: "first test api2",
    });

  return await apiKeyResponse.body.api_key;
};

export default { getApiKey };
