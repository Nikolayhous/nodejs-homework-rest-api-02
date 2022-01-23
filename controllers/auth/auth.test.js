import { jest } from "@jest/globals";
import { HttpCode } from "../../lib/constants";
import { authControllers } from "./index";
import { authService } from "../../service/auth";

describe("Unit test registration", () => {
  // функції котрі можна визивати
  // beforeAll(fn)
  // beforeEach(fn)
  // afterAll(fn)
  // afterEach(fn)

  let req, res, next;
  beforeEach(() => {
    req = { body: { email: "test@test.com", password: "12345678" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn((data) => data) };
    next = jest.fn();
    authService.create = jest.fn(async (data) => data);
  });

  test("SignUp new User", async () => {
    authService.isUserExist = jest.fn(async () => false);
    await authControllers.signupController(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED);
  });

  test("Login", async () => {
    authService.getUser = jest.fn(async () => false);
    await authControllers.loginController(req, res, next);
    // expect(authService.isUserExist).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(HttpCode.UNAUTHORIZED);
  });

  test("SignUp already exist User", async () => {
    authService.isUserExist = jest.fn(async () => true);
    await authControllers.signupController(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT);
  });
  test("SignUp with error database", async () => {
    const testError = new Error("Database Error");
    authService.isUserExist = jest.fn(async () => {
      throw testError;
    });
    await authControllers.signupController(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(next).toHaveBeenCalledWith(testError);
  });
});
