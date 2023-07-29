import { to } from 'await-to-js';

import * as logger from '../services/logger/logger.js';
import { firebaseAuth } from '../config/firebase/firebase.js';
import { unauthorized, critical } from '../services/error/handler.js';

const moduleName = 'Authentication middleware';

/**
 * Middleware for validating user from idToken and extracting uid from this token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function verifyUser(req, res, next) {
  // Authorization: Bearer <token>
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) return next(unauthorized('No Authorization header provided'));

  const authorizationHeaderSplitArray = authorizationHeader.split(' ');

  if (authorizationHeaderSplitArray.length < 2 || authorizationHeaderSplitArray[0] !== 'Bearer')
    return next(unauthorized('Invalid Authorization header provided'));

  const idToken = authorizationHeaderSplitArray[1];

  const [err, decodedToken] = await to(firebaseAuth.verifyIdToken(idToken));

  if (err) {
    logger.critical(`Error while verifying user idToken: ${logger.inspect(err)}`, moduleName);

    return next(critical('Error while verifying user idToken'));
  }

  const uid = decodedToken.uid;
  req.uid = uid;

  logger.info(`Uid ${uid} was extracted from Authorization header`, moduleName);
  next();
}
