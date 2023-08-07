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
    await deleteFirebaseUser(uid);

    res.status(200).send('OK');
  }
}
