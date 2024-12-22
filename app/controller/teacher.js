'use strict';
const Controller = require('egg').Controller;

class TeacherController extends Controller {
  async getAllTeachers() {
    const { ctx } = this;
    const teachers = await ctx.service.teacher.getAllTeachers();
    ctx.body = teachers;
  }

  async createTeacher() {
    const { ctx } = this;
    const teacherData = ctx.request.body;

    // 参数验证
    if (!teacherData.username || !teacherData.password) {
      return ctx.error({
        code: 400,
        message: '缺少必要参数',
      });
    }

    try {
      const result = await ctx.service.teacher.createTeacher(teacherData);
      if (!result.success) {
        return ctx.error(result);
      }
      ctx.success({
        data: result.data,
        message: '创建教师成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '创建教师失败',
      });
    }
  }
}

module.exports = TeacherController;
