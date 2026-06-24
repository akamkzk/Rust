const response = (res, data = null, message = 'success', code = 200) => {
  res.status(code).json({
    code,
    message,
    data
  });
};

const success = (res, data = null, message = '操作成功') => {
  response(res, data, message, 200);
};

const error = (res, message = '操作失败', code = 400) => {
  response(res, null, message, code);
};

const unauthorized = (res, message = '未授权，请先登录') => {
  response(res, null, message, 401);
};

const forbidden = (res, message = '没有权限') => {
  response(res, null, message, 403);
};

const notFound = (res, message = '资源不存在') => {
  response(res, null, message, 404);
};

const serverError = (res, message = '服务器内部错误') => {
  response(res, null, message, 500);
};

module.exports = {
  response,
  success,
  error,
  unauthorized,
  forbidden,
  notFound,
  serverError
};
