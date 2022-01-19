import { HttpCode } from "../../lib/constants";
import { authService } from "../../service/auth";
import {
  EmailService,
  SenderSendGrid,
  // SenderNodemailer,
} from "../../service/email";
class AuthControllers {
  async signupController(req, res, next) {
    try {
      const { email } = req.body;
      const isUserExist = await authService.isUserExist(email);
      if (isUserExist) {
        return res.status(HttpCode.CONFLICT).json({
          status: "error",
          code: HttpCode.CONFLICT,
          message: "Email is already exist",
        });
      }
      const userData = await authService.create(req.body);
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new SenderSendGrid()
      );

      const isSend = await emailService.sendVerifyEmail(
        email,
        userData.name,
        userData.verifyTokenEmail
      );
      delete userData.verifyTokenEmail;

      res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        data: { ...userData, isSendEmailVerify: isSend },
      });
    } catch (error) {
      next(error);
    }
  }

  async loginController(req, res, next) {
    const { email, password } = req.body;
    const user = await authService.getUser(email, password);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "invalid credentials",
      });
    }
    const token = authService.getToken(user);
    await authService.setToken(user.id, token);

    res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { token } });
  }

  async logoutController(req, res, next) {
    await authService.setToken(req.user.id, null);
    res
      .status(HttpCode.NO_CONTENT)
      .json({ status: "success", code: HttpCode.OK, data: {} });
  }

  async getCurrentUserController(req, res) {
    const { email, subscription } = req.user;
    console.log(req.user);
    if (!req.user.token || !req.user.id) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  }
}

export default new AuthControllers();
