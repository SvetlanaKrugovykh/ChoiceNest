const fastify = require('fastify')({ logger: true })
const routes = require('./src/routes/listings')
const logger = require('./src/logger')

fastify.register(routes, { prefix: '/api' })

const start = async () => {
  const PORT = process.env.PORT || 3333
  const HOST = process.env.HOST || '0.0.0.0'

  try {
    await fastify.listen({ port: PORT, host: HOST })
    const msg = `Server listening on http://${HOST}:${PORT}`
    const timestamp = new Date().toISOString()
    fastify.log.info(`${timestamp} ${msg}`)
    logger.info(`${timestamp} ${msg}`)
  } catch (err) {
    const timestamp = new Date().toISOString()
    fastify.log.error(`${timestamp} ${err}`)
    logger.error(`${timestamp} ${err}`)
    process.exit(1)
  }
}

start()