/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1734237373733_1928';

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'school_manager',
    username: 'root',
    password: '626488xqy',
    timezone: '+08:00',
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_unicode_ci',
      },
    },
    // 添加查询日志
    logging: (sql, timing) => {
      console.log('[Sequelize]', sql, timing);
    },
  };

  config.cookies = {
    // cookie 签名密钥
    keys: [ '626488xqy' ],
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 允许跨域请求
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  config.jwt = {
    secret: '626488xqy', // 请更换为复杂的密钥
    expiresIn: '1h', // access token 过期时间
  };

  config.refreshToken = {
    secret: '626488xqy', // refresh token 的密钥
    expiresIn: '8h', // refresh token 过期时间
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '626488xqy',
      db: 0,
    },
  };

  // add your middleware config here
  config.middleware = [ 'response' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
