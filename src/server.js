const express = require('express');
/**
 * @typedef {Object} EnvVars
 * @property {string} SESSION_SECRET
 */

/**
 * @param {EnvVars} env
 * @return {Promise<*|FastifyInstance<http.Server, RawRequestDefaultExpression<http.Server>, RawReplyDefaultExpression<http.Server>, FastifyLoggerInstance>|PromiseLike<FastifyInstance<http.Server, RawRequestDefaultExpression<http.Server>, RawReplyDefaultExpression<http.Server>, FastifyLoggerInstance>>|FastifyInstance<https.Server, RawRequestDefaultExpression<https.Server>, RawReplyDefaultExpression<https.Server>, FastifyLoggerInstance>|PromiseLike<FastifyInstance<https.Server, RawRequestDefaultExpression<https.Server>, RawReplyDefaultExpression<https.Server>, FastifyLoggerInstance>>|FastifyInstance<http2.Http2Server, RawRequestDefaultExpression<http2.Http2Server>, RawReplyDefaultExpression<http2.Http2Server>, FastifyLoggerInstance>|PromiseLike<FastifyInstance<http2.Http2Server, RawRequestDefaultExpression<http2.Http2Server>, RawReplyDefaultExpression<http2.Http2Server>, FastifyLoggerInstance>>|FastifyInstance<http2.Http2SecureServer, RawRequestDefaultExpression<http2.Http2SecureServer>, RawReplyDefaultExpression<http2.Http2SecureServer>, FastifyLoggerInstance>|PromiseLike<FastifyInstance<http2.Http2SecureServer, RawRequestDefaultExpression<http2.Http2SecureServer>, RawReplyDefaultExpression<http2.Http2SecureServer>, FastifyLoggerInstance>>>}
 */
module.exports = async (env) => {
  const app = express();
  require('./routes')(app, env);
  return app;
};
