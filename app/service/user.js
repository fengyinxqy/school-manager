// app/service/user.js
'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcryptjs');

class UserService extends Service {
  /**
   * 创建用户
   * @param {Object} payload 用户数据
   * @return {Promise<Object>} 创建的用户
   */
  async create(payload) {
    try {
      const { username, password, role } = payload;

      // 检查用户名是否已存在
      const existUser = await this.findByUsername(username);
      if (existUser) {
        return {
          success: false,
          code: 400,
          message: '用户名已存在',
        };
      }

      // 密码加密
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await this.ctx.model.User.create({
        username,
        password: hashedPassword,
        role,
      });

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      this.ctx.logger.error('[UserService][create] error:', error);
      return {
        success: false,
        code: 500,
        message: '创建用户失败',
      };
    }
  }

  /**
   * 根据用户名查找用户
   * @param {string} username 用户名
   * @return {Promise<Object>} 用户信息
   */
  async findByUsername(username) {
    try {
      return await this.ctx.model.User.findOne({
        where: { username },
        include: [{
          model: this.ctx.model.Teacher,
          as: 'teacherProfile',
          required: false,
        }],
      });
    } catch (error) {
      this.ctx.logger.error('[UserService][findByUsername] error:', error);
      return null;
    }
  }

  /**
   * 验证密码
   * @param {string} password 原始密码
   * @param {string} hashedPassword 加密后的密码
   * @return {Promise<boolean>} 验证结果
   */
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.ctx.logger.error('[UserService][verifyPassword] error:', error);
      return false;
    }
  }

  /**
   * 生成令牌
   * @param {Object} user 用户信息
   * @return {Promise<Object>} 令牌对象
   */
  async generateTokens(user) {
    const { app } = this;
    try {
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      // 生成访问令牌
      const accessToken = app.jwt.sign(payload, app.config.jwt.secret, {
        expiresIn: app.config.jwt.expiresIn,
      });

      // 生成刷新令牌
      const refreshToken = app.jwt.sign(payload, app.config.refreshToken.secret, {
        expiresIn: app.config.refreshToken.expiresIn,
      });

      // 将刷新令牌存储到 Redis
      const refreshExpiresIn = parseInt(
        app.config.refreshToken.expiresIn.replace(/[^0-9]/g, ''),
        10
      ) * 24 * 60 * 60;

      await this.ctx.service.cache.setRefreshToken(user.id, refreshToken, refreshExpiresIn);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.ctx.logger.error('[UserService][generateTokens] error:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   * @param {number} userId 用户ID
   * @param {Object} updates 更新内容
   * @return {Promise<Object>} 更新结果
   */
  async updateUser(userId, updates) {
    try {
      const user = await this.ctx.model.User.findByPk(userId);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: '用户不存在',
        };
      }

      // 如果要更新密码，需要加密
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      await user.update(updates);

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      this.ctx.logger.error('[UserService][updateUser] error:', error);
      return {
        success: false,
        code: 500,
        message: '更新用户失败',
      };
    }
  }

  /**
   * 删除用户
   * @param {number} userId 用户ID
   * @return {Promise<Object>} 删除结果
   */
  async deleteUser(userId) {
    try {
      const user = await this.ctx.model.User.findByPk(userId);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: '用户不存在',
        };
      }

      await user.destroy();

      return {
        success: true,
        message: '用户删除成功',
      };
    } catch (error) {
      this.ctx.logger.error('[UserService][deleteUser] error:', error);
      return {
        success: false,
        code: 500,
        message: '删除用户失败',
      };
    }
  }

  /**
   * 登出处理
   * @param {number} userId 用户ID
   * @param {string} accessToken 访问令牌
   * @return {Promise<Object>} 登出结果
   */
  async logout(userId, accessToken) {
    try {
      // 将访问令牌加入黑名单
      const decoded = this.app.jwt.decode(accessToken);
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        await this.ctx.service.cache.addTokenToBlacklist(accessToken, expiresIn);
      }

      // 删除刷新令牌
      await this.ctx.service.cache.removeRefreshToken(userId);

      return {
        success: true,
        message: '登出成功',
      };
    } catch (error) {
      this.ctx.logger.error('[UserService][logout] error:', error);
      return {
        success: false,
        code: 500,
        message: '登出失败',
      };
    }
  }
}

module.exports = UserService;
