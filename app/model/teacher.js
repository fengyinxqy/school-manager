// app/model/teacher.js
'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Teacher = app.model.define('teacher', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    name: {
      type: STRING(100),
      allowNull: false,
    },
    subject: {
      type: STRING(100),
    },
  }, {
    // 配置索引
    indexes: [
      {
        fields: [ 'user_id' ],
      },
    ],
    // 配置选项
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'teacher',
  });

  return Teacher;
};
