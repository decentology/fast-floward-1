import Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fs from 'fs';

const fastify = Fastify({
  logger: false
});

fastify.register(fastifyStatic, {
  root: `${process.cwd()}/build/`,
  prefix: '/public/'
});

fastify.get('/*', async (request, reply) => {
  reply
    .type('text/html')
    .send(fs.readFileSync('./build/index.html', 'utf-8'));
});

fastify.listen(3100, '0.0.0.0', (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});
