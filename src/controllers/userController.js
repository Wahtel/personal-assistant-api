import { deleteFirebaseUser } from "../services/user/user.js";

/**
 * Controller for handling all interactions with the user
 */
export default class UserController {
  /**
   * Delete firebase user along with  all user's chats and messages
   * @param {*} req
   * @param {*} res
   */
  static async deleteUser(req, res) {
    const { uid } = req;
    const [err, result] = await deleteFirebaseUser(uid);

    if (err) return res.status(err.statusCode).send({ message: err.message });

    res.status(200).send(result);
  }
}
