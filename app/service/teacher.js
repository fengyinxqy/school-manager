// app/service/user.js
'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcryptjs');

class TeacherService extends Service {
  async getAllTeachers() {
    try {
      const teachers = await this.ctx.model.Teacher.findAll();
      return teachers;
    } catch (error) {
      this.ctx.logger.error('[TeacherService][getAllTeachers] error:', error);
      return {
        success: false,
        code: 500,
        message: '获取教师信息失败',
      };
    }
  }

  async createTeacher(teacherData) {
    const { ctx } = this;
    const { username, password, subject } = teacherData;

    try {
      // 检查用户名是否已存在
      const existUser = await ctx.service.user.findByUsername(username);
      if (existUser) {
        return {
          success: false,
          code: 400,
          message: '用户名已存在',
        };
      }

      // 创建事务
      const result = await ctx.model.transaction(async t => {
        // 创建用户账号
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await ctx.model.User.create({
          username,
          password: hashedPassword,
          role: 'teacher',
        }, { transaction: t });

        // 创建教师信息
        const teacher = await ctx.model.Teacher.create({
          user_id: user.id,
          name: username,
          subject,
        }, { transaction: t });

        return {
          user,
          teacher,
        };
      });

      return {
        success: true,
        data: {
          id: result.teacher.id,
          subject: result.teacher.subject,
          username: result.user.username,
        },
      };
    } catch (error) {
      ctx.logger.error('[TeacherService][createTeacher] error:', error);
      return {
        success: false,
        code: 500,
        message: '创建教师信息失败',
      };
    }
  }
}

module.exports = TeacherService;
