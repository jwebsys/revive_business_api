const OAuth2Server = require("oauth2-server");
const model = require('./model')

module.exports = new OAuth2Server({ model })