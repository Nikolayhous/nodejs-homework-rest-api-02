import jwt from "jsonwebtoken";
import { create, findByEmail, updateToken } from "../../repository/auth";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
  async isUserExist(email) {
    const user = await findByEmail(email);
    return !!user;
  }

  async create(body) {
    const { id, name, email, role, avatar, verifyTokenEmail } = await create(
      body
    );
    return {
      id,
      name,
      email,
      role,
      avatar,
      verifyTokenEmail,
    };
  }

  async getUser(email, password) {
    const user = await findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !null?.isVerify) {
      return null;
    }
    return user;
  }

  getToken(user) {
    const { id, email } = user;
    const payload = { id, email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });
    return token;
  }

  async setToken(id, token) {
    await updateToken(id, token);
  }
}

export default new AuthService();
