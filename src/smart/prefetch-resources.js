const storage = require('../utils/mock-storage');
const fetchMetadata = require('../utils/fetch-metadata');
/**
 *
 * @param {Client}smart
 * @param {String}iss
 * @return {boolean}
 */
module.exports = (smart, iss) => {
  storage.set('CapabilityStatement', fetchMetadata(iss));
  if (smart.getPatientId()) storage.set('Patient/' + smart.getPatientId(), smart.patient.read());
  if (smart.getEncounterId()) storage.set('Encounter/' + smart.getEncounterId(), smart.patient.read());
  if (smart.getUserId()) storage.set('User/' + smart.getUserId(), smart.patient.read());
}
