import { HttpCode } from "../../lib/constants";
import getStatisticsContacts from "../../repository/usersAggregate/getStatisticsContacts";
import {
  UploadFileService,
  LocalFileStorage,
  // CloudFileStorage, //можно сменить хранилище на облачное
} from "../../service/storageAvatar";
import { findByVerifyToken, findByEmail } from "../../repository/auth";
import {
  EmailService,
  SenderNodemailer,
  SenderSendGrid,
} from "../../service/email";

const aggregationController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getStatisticsContacts(id);
  if (data) {
    return res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data });
  }
  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "Not found",
  });
};

const uploadAvatar = async (req, res, next) => {
  const uploadService = new UploadFileService(
    LocalFileStorage,
    req.file,
    req.user
  );

  const avatarUrl = await uploadService.updateAvatar();

  res
    .status(HttpCode.OK)
    .json({ status: "success", code: HttpCode.OK, data: { avatarUrl } });
};

const verifyUser = async (req, res, next) => {
  const verifyToken = req.params.token;
  const userFromToken = await findByVerifyToken(verifyToken);
  console.log(
    "🚀 ~ file: index.js ~ line 47 ~ verifyUser ~ userFromToken",
    userFromToken
  );

  if (userFromToken) {
    await updateVerify(userFromToken.id, true);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { message: "Success" },
    });
  }
  res.status(HttpCode.BAD_REQUEST).json({
    status: "success",
    code: HttpCode.BAD_REQUEST,
    data: { message: "Invalid token" },
  });
};

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await findByEmail(email);
  if (user) {
    const { email, name, verifyTokenEmail } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderNodemailer()
    );

    const isSend = await emailService.sendVerifyEmail(
      email,
      name,
      verifyTokenEmail
    );
    if (isSend) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { message: "Success" },
      });
    }
    return res.status(HttpCode.UE).json({
      status: "error",
      code: HttpCode.UE,
      data: { message: "Unprocessable Entity" },
    });
  }

  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    data: { message: "User with email not found" },
  });
};

export {
  aggregationController,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
};
