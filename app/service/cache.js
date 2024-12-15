// app/service/cache.js
'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class CacheService extends Service {
  /**
   * 对 token 进行哈希处理
   * @param {string} token
   * @return {string}
   */
  hashToken(token) {
    return crypto.createHash('md5').update(token).digest('hex');
  }

  /**
   * 存储 refresh token
   * @param userId
   * @param refreshToken
   * @param expiresIn
   */
  async setRefreshToken(userId, refreshToken, expiresIn) {
    try {
      const key = `rt:${userId}`; // 缩短 key
      const expiry = parseInt(expiresIn, 10);
      if (isNaN(expiry)) {
        throw new Error('Invalid expiration time');
      }
      await this.app.redis.set(key, refreshToken, 'EX', expiry);
    } catch (error) {
      this.ctx.logger.error('[CacheService][setRefreshToken] error:', error);
      throw error;
    }
  }

  /**
   * 获取 refresh token
   * @param userId
   */
  async getRefreshToken(userId) {
    try {
      const key = `rt:${userId}`;
      return await this.app.redis.get(key);
    } catch (error) {
      this.ctx.logger.error('[CacheService][getRefreshToken] error:', error);
      return null;
    }
  }

  /**
   * 删除 refresh token
   * @param userId
   */
  async removeRefreshToken(userId) {
    try {
      const key = `rt:${userId}`;
      await this.app.redis.del(key);
    } catch (error) {
      this.ctx.logger.error('[CacheService][removeRefreshToken] error:', error);
      throw error;
    }
  }

  /**
   * 将 token 加入黑名单
   * @param token
   * @param expiresIn
   */
  async addTokenToBlacklist(token, expiresIn) {
    try {
      // 使用 token 的哈希值作为 key
      const key = `bl:${this.hashToken(token)}`;
      const expiry = parseInt(expiresIn, 10);
      if (isNaN(expiry)) {
        throw new Error('Invalid expiration time');
      }
      await this.app.redis.set(key, '1', 'EX', expiry);
    } catch (error) {
      this.ctx.logger.error('[CacheService][addTokenToBlacklist] error:', error);
      throw error;
    }
  }

  /**
   * 检查 token 是否在黑名单中
   * @param token
   */
  async isTokenBlacklisted(token) {
    try {
      const key = `bl:${this.hashToken(token)}`;
      const exists = await this.app.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.ctx.logger.error('[CacheService][isTokenBlacklisted] error:', error);
      return false;
    }
  }
}

module.exports = CacheService;
