const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
});

const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

module.exports = { HTTP_STATUS, ROLES };
