const logger = require('./src/utils/logger');
const server = require('./src/server');
const vars = require('./src/vars');

const serve = async (port) => {
  const app = await server(process.env);
  logger.info(`Server is starting...`);
  await app.listen(port, '0.0.0.0');
  if(!process.env.NAIS_CLUSTER_NAME){
    logger.info(`Server listening on ${port}, visit http://localhost:${port}/`);
  } else {
    logger.info(`Server listening on ${port}`);
  }

};
try {
  serve(process.env.PORT || vars.PORT).then();
} catch (e) {
  logger.error(e.message);
}

