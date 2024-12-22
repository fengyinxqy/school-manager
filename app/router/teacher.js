/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth;

  router.get('/api/v1/teacher/list', auth(), controller.teacher.getAllTeachers);
  router.post('/api/v1/teacher/create', auth(), controller.teacher.createTeacher);
};
