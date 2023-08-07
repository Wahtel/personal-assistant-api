import { to } from 'await-to-js';

import * as logger from '../logger/logger.js'
import { firebaseAuth } from "../../config/firebase/firebase.js";

const moduleName = 'User Service'

export async function deleteFirebaseUser(userId) {
  const [err] = await to(firebaseAuth.deleteUser(userId));

  if (err) {
    logger.critical(`Error while deleting firebase user with id ${userId}: ${logger.inspect(err)}`, moduleName);
  }
}