const vars = require('../vars');
const fhirClient = require('fhirclient');
const session = require('express-session');
const appLaunchUrl = require('../utils/app-launch-url');
const storage = require('../utils/mock-storage');
/**
 * @param {Application} app
 */
module.exports = (app) => {
  app.use(session({
    secret: 'something vise',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    name: "entrypoint.sid"
  }));
  app.use(async (req, res, next) => {
    const {launch, iss, code} = req.query
    if (launch && iss || code) {
      const smart = await fhirClient(req, res).init({
        client_id: 'my_web_app',
        scope: 'patient/*.read',
        redirectUri: vars.CONTEXT_PATH,
      });
      const {need_patient_banner,patient,encounter} = smart.getState().tokenResponse;
      storage.set("proxyHeader",smart.getAuthorizationHeader());
      storage.set("tokenResponse",{
        need_patient_banner,
        patient,
        encounter,
      });
      console.log("Created a new login");
    }
    console.log(req.path, req.session.id);
    next();
  });
  app.get(vars.CONTEXT_PATH,async (req, res)=>{
    const sampleApp = 'https://launch.smarthealthit.org/sample-app/launch.html';
    const iss = 'http://localhost:4343/proxy';
    res.redirect(appLaunchUrl(sampleApp, iss, {}));
  });
};
