'use strict';

const Controller = require('egg').Controller;

class SubjectController extends Controller {
  // 创建学科
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;

    if (!data.name) {
      return ctx.error({
        code: 400,
        message: '学科名称不能为空',
      });
    }

    try {
      const result = await ctx.service.subject.create(data);
      ctx.success({
        data: result,
        message: '创建学科成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '创建学科失败',
      });
    }
  }

  // 获取所有学科
  async index() {
    const { ctx } = this;
    try {
      const subjects = await ctx.service.subject.findAll();
      ctx.success({
        data: subjects,
        message: '获取学科列表成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '获取学科列表失败',
      });
    }
  }

  // 更新学科
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const data = ctx.request.body;

    try {
      const result = await ctx.service.subject.update(id, data);
      if (!result) {
        return ctx.error({
          code: 404,
          message: '学科不存在',
        });
      }
      ctx.success({
        data: result,
        message: '更新学科成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '更新学科失败',
      });
    }
  }

  // 删除学科
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;

    try {
      const result = await ctx.service.subject.delete(id);
      if (!result) {
        return ctx.error({
          code: 404,
          message: '学科不存在',
        });
      }
      ctx.success({
        message: '删除学科成功',
      });
    } catch (error) {
      ctx.error({
        code: 500,
        message: '删除学科失败',
      });
    }
  }
}

module.exports = SubjectController;
