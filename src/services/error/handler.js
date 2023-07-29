/**
 * Using to standardize creating error
 * @param {*} options 
 * @returns 
 */
export function create(options) {
  const error = new Error(options.msg);

  error.statusCode = options.code;

  if (options.data) error.data = options.data;

  return error;
}

/**
 * Easy access to a 404 error
 * @returns {*|Error}
 */
export function notFound(message = 'Not Found') {
  return create({
    code: 404,
    msg: message
  });
}

/**
 * Easy access to a 400 error
 * @param message
 * @returns {*|Error}
 */
export function badRequest(message = 'Bad Request') {
  return create({
    code: 400,
    msg: message
  });
}

/**
 * Easy access to a 403 error
 * @param message
 * @returns {*|Error}
 */
export function forbidden(message = 'Forbidden') {
  return create({
    code: 403,
    msg: message
  });
}

/**
 * Easy access to a 401 error
 * @param message
 * @returns {Error}
 */
export function unauthorized(message = 'Unauthorized') {
  return create({
    code: 401,
    msg: message
  });
}

/**
 * Easy access to a 405 error
 * @param message
 * @returns {Error}
 */
export function notAllowed(message = 'Not allowed') {
  return create({
    code: 405,
    msg: message
  });
}

/**
 * Easy access to a 500 error
 * @param message
 * @returns {Error}
 */
export function critical(message = 'Unresponsive') {
  return create({
    code: 500,
    msg: message
  });
}