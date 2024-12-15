// app/controller/auth.js
'use strict';

const error_code = require('../constant/error_code');

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;

    try {
      // 查找用户
      const user = await service.user.findByUsername(username);
      if (!user) {
        return ctx.error({
          code: 401,
          message: '用户名或密码错误',
        });
      }

      // 验证密码
      const isValid = await service.user.verifyPassword(password, user.password);
      if (!isValid) {
        return ctx.error({
          code: 401,
          message: '用户名或密码错误',
        });
      }

      // 生成 token
      const tokens = await service.user.generateTokens(user);

      // 设置 cookie
      ctx.cookies.set('access_token', tokens.accessToken, {
        maxAge: 3600 * 1000, // 1小时
        httpOnly: true, // 防止 XSS 攻击
        secure: false, // 开发环境设为 false，生产环境设为 true
        sameSite: 'strict', // 防止 CSRF 攻击
      });

      ctx.cookies.set('refresh_token', tokens.refreshToken, {
        maxAge: 8 * 3600 * 1000, // 8小时
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      // 返回用户信息
      ctx.success({
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            ...(user.teacherProfile ? {
              teacherInfo: {
                name: user.teacherProfile.name,
                subject: user.teacherProfile.subject,
              },
            } : {}),
          },
        },
        message: '登录成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '服务器错误',
      });
    }
  }

  async logout() {
    const { ctx } = this;
    const token = ctx.cookies.get('access_token');
    const userId = ctx.state.user.id;

    try {
      await ctx.service.user.logout(userId, token);

      // 清除 cookie
      ctx.cookies.set('access_token', null);
      ctx.cookies.set('refresh_token', null);

      ctx.success({
        message: '登出成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '登出失败',
      });
    }
  }

  async refreshToken() {
    const { ctx, app } = this;
    const refreshToken = ctx.get('refresh-token');

    if (!refreshToken) {
      return ctx.error({
        code: error_code.UNAUTHORIZED,
        message: '缺少刷新令牌',
      });
    }

    try {
      // 验证 refresh token
      const decoded = app.jwt.verify(refreshToken, app.config.refreshToken.secret);

      // 检查 refresh token 是否存在于 Redis
      const storedToken = await ctx.service.cache.getRefreshToken(decoded.id);
      if (!storedToken || storedToken !== refreshToken) {
        return ctx.error({
          code: error_code.UNAUTHORIZED,
          message: '无效的刷新令牌',
        });
      }

      // 获取用户信息
      const user = await ctx.service.user.findById(decoded.id);
      if (!user) {
        return ctx.error({
          code: error_code.USER_NOT_FOUND,
          message: '用户不存在',
        });
      }

      // 生成新的令牌对
      const tokens = await ctx.service.user.generateTokens(user);

      ctx.success({
        data: tokens,
        message: '令牌刷新成功',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        ctx.error({
          code: error_code.TOKEN_EXPIRED,
          message: '刷新令牌已过期',
        });
      } else {
        ctx.error({
          code: error_code.UNAUTHORIZED,
          message: '无效的刷新令牌',
        });
      }
    }
  }
}

module.exports = AuthController;
