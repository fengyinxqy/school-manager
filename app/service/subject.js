'use strict';

const Service = require('egg').Service;

class SubjectService extends Service {
  // 创建学科
  async create(data) {
    const { ctx } = this;
    return await ctx.model.Subject.create(data);
  }

  // 获取所有学科
  async findAll() {
    const { ctx } = this;
    return await ctx.model.Subject.findAll();
  }

  // 更新学科
  async update(id, data) {
    const { ctx } = this;
    const subject = await ctx.model.Subject.findByPk(id);
    if (!subject) {
      return null;
    }
    return await subject.update(data);
  }

  // 删除学科
  async delete(id) {
    const { ctx } = this;
    const subject = await ctx.model.Subject.findByPk(id);
    if (!subject) {
      return null;
    }
    await subject.destroy();
    return true;
  }
}

module.exports = SubjectService;
