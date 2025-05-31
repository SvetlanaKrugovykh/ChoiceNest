const controller = require('../controllers/listingsController')
const { listingsRequestSchema, listingsResponseSchema } = require('../schemas/listings')

module.exports = async function (fastify, opts) {
  fastify.post('/listings', {
    schema: {
      body: listingsRequestSchema,
      response: { 200: listingsResponseSchema }
    },
    handler: controller.getListings
  })
}