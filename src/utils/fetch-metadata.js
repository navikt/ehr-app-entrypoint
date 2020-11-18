const axios = require('axios');

async function fetchMetadata(serverUrl) {
  const options = {
    url: serverUrl + '/metadata',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  };
  const result = await axios(options);
  return result.data;
}

module.exports = fetchMetadata;
