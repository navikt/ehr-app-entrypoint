const vars = require('../vars');
const axios = require('axios');
const bodyParser = require('body-parser');
const storage = require('../utils/mock-storage');

async function forwardRequest(req, targetUrl) {
  const proxyHeader = storage.get('proxyHeader');
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

const proxyUrl = 'http://localhost:4343/proxy';
/**
 * @param {Application} app
 */
module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: false}));
  app.get(vars.PROXY_PATH + '/metadata', async (req, res) => {
    const FHIR_SERVER_R4 = 'https://r4.smarthealthit.org';
    const targetUrl = req.originalUrl.replace(vars.PROXY_PATH, FHIR_SERVER_R4);
    const resource = await forwardRequest(req, targetUrl);

    if (resource.resourceType === 'CapabilityStatement') {
      resource.implementation.url = proxyUrl;
      resource.rest[0].security.extension = resource.rest[0].security.extension || [];
      if (!resource.rest[0].security.extension[0]) {
        resource.rest[0].security.extension.push({
          'url': 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',
          'extension': [
            {
              'url': 'token',
              'valueUri': proxyUrl + '/auth/token',
            },
            {
              'url': 'authorize',
              'valueUri': proxyUrl + '/auth/authorize',
            },
          ],
        });
      }
    }
    res.send(resource);
  });
  app.get(vars.PROXY_PATH + '/auth/authorize', async (req, res) => {
    const {client_id, response_type, scope, redirect_uri, state, aud} = req.query;

    const url = new URL(redirect_uri);
    url.searchParams.append('code', '123');
    url.searchParams.append('state', state);
    res.redirect(url.toString());
  });
  app.post(vars.PROXY_PATH + '/auth/token', async (req, res) => {
    const tokenResponse = storage.get('tokenResponse');
    if (tokenResponse) {
      const {need_patient_banner, patient, encounter} = tokenResponse;
      res.send({
        need_patient_banner,
        smart_style_url: proxyUrl + '/smart-style.json',
        patient,
        encounter,
        token_type: 'bearer',
        scope: 'patient/*.read launch',
        client_id: req.body.client_id,
        access_token: 'abc',
      });
    } else {
      res.status(401).send({});
    }

  });
  app.all([
    vars.PROXY_PATH + '/Encounter/*',
    vars.PROXY_PATH + '/Patient/*',
  ], async (req, res) => {
    const proxyHeader = storage.get('proxyHeader');
    const FHIR_SERVER_R4 = 'https://r4.smarthealthit.org';
    const targetUrl = req.originalUrl.replace(vars.PROXY_PATH, FHIR_SERVER_R4);
    if (proxyHeader) {
      const result = await forwardRequest(req, targetUrl);
      res.send(result);
    } else {
      res.status(401).send({});
    }

  });

};
