const base64url = require('base64-url');

module.exports = (appUrl, iss, launchContext) => {
  const baseUrl = new URL(appUrl);
  const params = {
    iss,
    launch: base64url.encode(JSON.stringify(launchContext)),
  };
  Object.keys(params).forEach(key => {
    baseUrl.searchParams.append(key, params[key]);
  });
  return baseUrl.toString();
};
