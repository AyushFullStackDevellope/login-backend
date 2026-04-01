function successResponse(res, data = {}, message = "") {
  return res.json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, status = 400, message = "", error_code = "") {
  return res.status(status).json({
    success: false,
    message,
    error_code,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};