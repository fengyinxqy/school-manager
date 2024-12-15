// app/middleware/response.js
'use strict';

module.exports = () => {
  return async function responseHandler(ctx, next) {
    try {
      // 添加统一响应方法
      ctx.success = ({ data = null, message = 'success', code = 0 }) => {
        ctx.body = {
          code,
          data,
          message,
        };
      };

      ctx.error = ({ data = null, message = 'error', code = 1 }) => {
        ctx.body = {
          code,
          data,
          message,
        };
      };

      // 执行后续中间件
      await next();

      // 如果没有使用 ctx.success 或 ctx.error 设置响应
      if (!ctx.body) {
        ctx.success({ message: 'empty response' });
      } else if (!ctx.body.hasOwnProperty('code')) {
        // 如果响应体不是统一格式，将其作为 data 包装
        const originalBody = ctx.body;
        ctx.success({ data: originalBody });
      }
      // 如果已经是统一格式，则不做处理
    } catch (error) {
      ctx.logger.error('[ResponseHandler] error:', error);
      ctx.error({
        message: error.message || 'Internal Server Error',
        code: error.status || 500,
      });
    }
  };
};
