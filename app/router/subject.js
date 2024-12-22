module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth;

  router.post('/api/v1/subjects', auth(), controller.subject.create);
  router.get('/api/v1/subjects', auth(), controller.subject.index);
  router.put('/api/v1/subjects/:id', auth(), controller.subject.update);
  router.delete('/api/v1/subjects/:id', auth(), controller.subject.destroy);
};
