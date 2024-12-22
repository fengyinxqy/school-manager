// app/model/user.js
'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: STRING(255),
      allowNull: false,
    },
    role: {
      type: ENUM('super_admin', 'teacher'),
      allowNull: false,
    },
  }, {
    // 禁用 Sequelize 自动创建的 createdAt 和 updatedAt 字段
    timestamps: true,
    // 使用下划线命名
    underscored: true,
    // 不使用复数形式
    freezeTableName: true,
    tableName: 'user',
  });

  return User;
};
