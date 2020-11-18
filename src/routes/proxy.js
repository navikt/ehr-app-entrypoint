const vars = require('../vars');
const bodyParser = require('body-parser');
const storage = require('../utils/mock-storage');
const rewriteCapabilityStatement = require('../utils/rewrite-capability-statement');
const forwardRequest = require('../utils/forward-request');
const proxyUrl = 'http://localhost:4343/proxy';

/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: false}));
  app.get(vars.PROXY_PATH + '/metadata', async (req, res) => {
    let resource;
    if (storage.has('CapabilityStatement')) {
      console.log('Resource delivered from cache', 'CapabilityStatement');
      resource = await storage.get('CapabilityStatement');
    } else {
      const FHIR_SERVER_R4 = 'https://r4.smarthealthit.org';
      const targetUrl = req.originalUrl.replace(vars.PROXY_PATH, FHIR_SERVER_R4);
      resource = await forwardRequest(req, targetUrl);
    }
    res.send(rewriteCapabilityStatement(resource, proxyUrl));
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
    vars.PROXY_PATH + '/:resourceType/:id',
  ], async (req, res) => {
    const {resourceType, id} = req.params;
    const resourceKey = resourceType + '/' + id;
    if (storage.has(resourceKey)) {
      console.log('Resource delivered from cache', resourceKey);
      return res.send(await storage.get(resourceKey));
    }
    console.log(req.params.resourceType);
    const FHIR_SERVER_R4 = 'https://r4.smarthealthit.org';
    const targetUrl = req.originalUrl.replace(vars.PROXY_PATH, FHIR_SERVER_R4);
    const proxyHeader = storage.get('proxyHeader');
    if (proxyHeader) {
      const result = await forwardRequest(req, targetUrl, proxyHeader);
      res.send(result);
    } else {
      res.status(401).send({});
    }

  });

};
