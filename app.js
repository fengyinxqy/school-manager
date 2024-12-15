// app.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = app => {
  app.beforeStart(async () => {
    try {
      // 确保所有模型都已加载
      await app.model.sync({ alter: true });

      // 建立模型关联
      require('./app/model/relation')(app);

      // 创建默认的超级管理员账号
      const superAdmin = await app.model.User.findOne({
        where: { username: 'admin' },
      });

      if (!superAdmin) {
        // 对密码进行加密
        const hashedPassword = await bcrypt.hash('123456', 10);
        await app.model.User.create({
          username: 'admin',
          password: hashedPassword,
          role: 'super_admin',
        });
        console.log('超级管理员账号创建成功');
      }
    } catch (error) {
      console.error('应用启动错误:', error);
    }
  });
};
