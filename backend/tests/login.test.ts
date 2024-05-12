import request from "supertest";
import app from "../src/app";

describe("POST /api/v1/users/login", () => {
  it("should return 200 with an email and a token on successful login", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "user1@example.com", password: "password1" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 for invalid email or password", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "invalidemail@gmail.com", password: "invalidpass" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Invalid email or password");
  });

  it("should return 401 for incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "user1@example.com", password: "invalidpass" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid password");
  });
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/api/v1/users/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email and password are required" });
  });
});
