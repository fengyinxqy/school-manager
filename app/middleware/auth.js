// app/middleware/auth.js
const ErrorCode = require('../constant/error_code');
module.exports = (options = { required: true }) => {
  return async function auth(ctx, next) {
    const token = ctx.cookies.get('access_token');

    if (!token && options.required) {
      ctx.status = 401;
      return ctx.error({
        code: ErrorCode.UNAUTHORIZED,
        message: '未登录',
      });
    }

    try {
      if (token) {
        const isBlacklisted = await ctx.service.cache.isTokenBlacklisted(token);
        if (isBlacklisted) {
          ctx.status = 401;
          return ctx.error({
            code: ErrorCode.TOKEN_INVALID,
            message: 'token 已失效',
          });
        }

        const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
        ctx.state.user = decoded;
      }

      await next();
    } catch (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          ctx.status = 401;
          ctx.error({
            code: ErrorCode.TOKEN_EXPIRED,
            message: 'token 已过期',
          });
          break;
        case 'JsonWebTokenError':
          ctx.status = 401;
          ctx.error({
            code: ErrorCode.TOKEN_INVALID,
            message: '无效的 token',
          });
          break;
        default:
          ctx.status = 500;
          ctx.error({
            code: ErrorCode.INTERNAL_ERROR,
            message: '服务器错误',
          });
      }
    }
  };
};
