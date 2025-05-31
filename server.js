const fastify = require('fastify')({ logger: true })
const routes = require('./src/routes/listings')

fastify.register(routes, { prefix: '/api' })

const start = async () => {
  const PORT = process.env.PORT || 3333
  const HOST = process.env.HOST || '0.0.0.0'

  try {
    await fastify.listen({ port: PORT, host: HOST })
    fastify.log.info(`Server listening on http://${HOST}:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()