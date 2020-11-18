const fhirClient = require('fhirclient');
const appLaunchUrl = require('../utils/app-launch-url');
const allowedIssuer = require('../utils/allowed-issuer');
const storage = require('../utils/mock-storage');
const timer = require('../utils/timer');
const prefetchResources = require("../smart/prefetch-resources");
const smartSettings = require("../smart/settings");
const {launchPath,redirectUri} = require("../paths.js");

/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app) => {
  app.use(async (req, res, next) => {
    console.log(timer.getTime(), 'Requested: ', req.path);
    next();
  });

  app.get(launchPath(":app"), async (req, res, next) => {
    timer.start();
    const {iss, launch} = req.query;
    const {app} = req.params;
    const redirUri = redirectUri(app);
    if (!iss) return res.status(400).send('Require parameter `iss`');
    if (!launch) return res.status(400).send('Require parameter `launch`');
    if (!allowedIssuer(iss)) return res.status(400).send('Issuer is not allowed');
    await fhirClient(req, res).authorize(smartSettings(redirUri)).catch(next);
  });

  app.get(redirectUri(":app"), async (req, res, next) => {
    const {app} = req.params;
    const redirUri = redirectUri(app);
    const smart = await fhirClient(req, res).init(smartSettings(redirUri));

    console.debug('Created a new login with EHR user', smart.getUserId());
    console.log(smart.getUserId());
    const {need_patient_banner, patient, encounter} = smart.getState().tokenResponse;
    storage.set('proxyHeader', smart.getAuthorizationHeader());
    storage.set('tokenResponse', {
      need_patient_banner,
      patient,
      encounter,
    });
    prefetchResources(smart,'https://r4.smarthealthit.org');
    const sampleApp = 'https://launch.smarthealthit.org/sample-app/launch.html';
    const iss = 'http://localhost:4343/proxy';
    res.redirect(appLaunchUrl(sampleApp, iss, {}));
  });
};
