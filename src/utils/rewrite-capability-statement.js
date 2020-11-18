module.exports = (resource, proxyUrl) => {
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
  return resource;
};
