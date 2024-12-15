// app/model/relation.js
'use strict';

module.exports = app => {
  const { model } = app;
  if (!model) return;

  const { User, Teacher } = model;
  if (!User || !Teacher) return;

  try {
    User.hasOne(Teacher, {
      foreignKey: 'user_id',
      as: 'teacherProfile',
    });

    Teacher.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'teacherProfile',
    });

    console.log('模型关联建立成功');
  } catch (error) {
    console.error('建立模型关联失败:', error);
  }
};
