// app/constant/error_code.js
'use strict';

module.exports = {
  SUCCESS: 0,
  FAIL: 1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,

  // 业务错误码
  USER_NOT_FOUND: 1001,
  INVALID_PASSWORD: 1002,
  TOKEN_EXPIRED: 1003,
  // ... 其他业务错误码
};
