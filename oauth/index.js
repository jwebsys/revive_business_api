const { Request, Response } = require("oauth2-server");
const oauth = require("./server");

function protect(req, res, next) {
  const request = new Request(req);
  const response = new Response(res);
  oauth
    .authenticate(request, response)
    .then((token) => {
      req.oauth = token;
      next();
    })
    .catch((err) => {
      res.status(err.statusCode).json({
        name: "oauth_error",
        message: err.message,
        code: err.code,
      });
    });
}

module.exports = {
  protect,
};
