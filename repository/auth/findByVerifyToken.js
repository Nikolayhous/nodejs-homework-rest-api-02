import User from "../../model/usersSchema";

const findByVerifyToken = async (verifyTokenEmail) => {
  return await User.findOne({ verifyTokenEmail });
};

export default findByVerifyToken;
