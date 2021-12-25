import repositoryContacts from "../../repository";
import { HttpCode } from "../../lib/constants";

const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await repositoryContacts.getContactById(id);
  console.log(contact);
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { contact } });
  }
  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "Not found",
  });
};

export default getContactByIdController;
