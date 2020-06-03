const { Request, Response } = require("oauth2-server");
const { Router } = require("express");
const oauth = require("./server");

const router = Router();

router.post("/token", (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth
    .token(request, response)
    .then((token) => {
      res.json({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        scope: token.scope,
        expires: Math.floor(
          (token.accessTokenExpiresAt.getTime() - new Date().getTime()) / 1000
        ),
      });
    })
    .catch((err) => {
      console.error(err)
      res.status(err.statusCode).json({
        name: 'oauth_error',
        message: err.message,
        code: err.code
      })
    });
});

module.exports = router;
