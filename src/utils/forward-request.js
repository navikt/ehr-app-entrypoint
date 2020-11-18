const axios = require('axios');
async function forwardRequest(req, targetUrl,proxyHeader) {
  const options = {
    url: targetUrl,
    method: req.method,
    params: req.query,
    headers: {
      'Accept': 'application/json',
      'Authorization': proxyHeader ? proxyHeader : 'anonymous',
    },
    data: req.body,
  };
  const result = await axios(options);
  return result.data;
}

module.exports = forwardRequest;
