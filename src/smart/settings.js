
module.exports = (redirectUri) => {
  return {
    clientId: 'ehr-app-entrypoint.nav.no',
    redirectUri,
    scope: 'launch/patient patient/*.read openid fhirUser',
  };
};
