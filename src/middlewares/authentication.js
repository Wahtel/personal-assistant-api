import { firebaseAuth } from "../config/firebase/firebase.js";
import { unauthorized } from "../services/error/handler.js";

/**
 * Middleware for validating user from idToken and extracting uid from this token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function verifyUser(req, res, next) {
  // Authorization: Bearer <token>
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) throw unauthorized('No Authorization header provided')

  // firebaseAuth
  // .verifyIdToken(idToken)
  // .then(async (decodedToken) => {
  //   const uid = decodedToken.uid;

  //   console.log('uid: ', uid);
    
  //   const docRef = firebaseFirestore.collection('users').doc('alovelace').collection('chats').doc('chat-1').collection('messages').doc('message-3');

  //   await docRef.set({
  //     first: 'user',
  //     last: 'What is the capital of US?',
  //   });
  // })
  // .catch((error) => {
  //   console.error(error)
  // });
  console.log('Verified')
  next();
}