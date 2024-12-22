'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Subject = app.model.define('subject', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(50),
      unique: true,
      allowNull: false,
      comment: '学科名称',
    },
    description: {
      type: STRING(255),
      allowNull: true,
      comment: '学科描述',
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'subject',
  });

  Subject.associate = function() {
    app.model.Subject.hasMany(app.model.Teacher, { foreignKey: 'subject_id' });
  };


  return Subject;
};
