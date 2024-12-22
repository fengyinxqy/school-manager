/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const auth = middleware.auth;

  // 登录相关路由
  router.post('/api/v1/login', controller.auth.login);
  router.post('/api/v1/logout', controller.auth.logout);
  router.post('/api/v1/refresh-token', controller.auth.refreshToken);

  // 教师相关路由
  require('./router/teacher')(app);

  // 需要验证的路由示例
  // router.get('/api/user/info', auth(), controller.user.info);

  // 学科相关路由
  require('./router/subject')(app);
};
