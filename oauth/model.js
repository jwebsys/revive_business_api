const OAuthServer = require("oauth2-server");
const { oauth } = require("../config.json");
const Pessoa = require("../api/models/pessoa");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require('uuid')

/**  @type {OAuthServer.Client} */
const client = {
  id: oauth.client_id,
  grants: ["refresh_token", "password"],
  accessTokenLifetime: oauth.access_token_lifetime,
  refreshTokenLifetime: oauth.refresh_token_lifetime,
};

/**
 * Retorna o cliente do oauth
 * @param {string} clientId
 * @param {string} secret
 * @returns {OAuthServer.Client}
 */
function getClient(clientId, secret) {
  if (clientId !== oauth.client_id || secret !== oauth.client_secret) {
    return null;
  }

  return client;
}

/**
 * Busca o usuário no banco de dados
 * @param {string} username
 * @param {string} password
 * @returns {OAuthServer.User}
 */
async function getUser(username, password) {
  const user = await Pessoa.findOne({
    email: username,
  });

  if (!user) return null;

  if (await bcrypt.compare(password, user.senha)) {
    return user;
  }

  // Encriptar a senha caso não esteja encriptada
  if (user.senha === password) {
    user.senha = await bcrypt.hash(password, 10)
    return user.save()
  }
}

/**
 * Gera um novo token de acesso
 * @param {OAuthServer.Client} client
 * @param {OAuthServer.User} user
 * @returns {string}
 */
async function generateAccessToken(client, user) {
  return jwt.sign(
    {
      // Adicione campos ao token aqui
      user: {
        id: user._id,
        email: user.email,
      },
      sub: user._id,
      aud: client.id,
    },
    oauth.jwt_secret,
    {
      keyid: uuid.v4(),
      expiresIn: oauth.access_token_lifetime,
    }
  );
}

/**
 * Gera um novo token de atualização
 * @param {OAuthServer.Client} client
 * @param {OAuthServer.User} user
 * @returns {string}
 */
function generateRefreshToken(client, user) {
  return jwt.sign({ sub: user._id, aud: client.id }, oauth.jwt_secret, {
    keyid: uuid.v4(),
    expiresIn: oauth.refresh_token_lifetime,
  });
}

/**
 * Obtém p token de acesso
 * @param {string} accessToken
 * @return {OAuthServer.Token}
 */
async function getAccessToken(accessToken) {
  const payload = jwt.verify(accessToken, oauth.jwt_secret);
  const user = await Pessoa.findById(payload.sub);

  return {
    accessToken,
    client,
    user,
    accessTokenExpiresAt: new Date(payload.exp * 1000),
  };
}

/**
 * Consulta o refreshToken no banco de dados
 * @param {string} refreshToken
 * @returns {OAuthServer.RefreshToken}
 */
async function getRefreshToken(refreshToken) {
  const payload = jwt.verify(refreshToken, oauth.jwt_secret);
  const user = await Pessoa.findById(payload.sub);

  return {
    client,
    refreshToken,
    user,
    refreshTokenExpiresAt: new Date(payload.exp * 1000),
  };
}

/**
 * Salva o token no banco de dados
 * @param {OAuthServer.Token} token
 * @param {OAuthServer.Client} client
 * @param {OAuthServer.User} user
 * @returns {OAuthServer.Token}
 */
function saveToken(token, client, user) {
  return {
    ...token,
    client,
    user
  };
}

/**
 * Revoga o token
 * @param {OAuthServer.Token} token
 */
function revokeToken () { return true }

module.exports = {
  getClient,
  getUser,
  generateAccessToken,
  generateRefreshToken,
  getAccessToken,
  getRefreshToken,
  saveToken,
  revokeToken
};
