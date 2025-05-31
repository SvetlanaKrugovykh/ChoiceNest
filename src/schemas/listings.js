const listingsRequestSchema = {
  type: 'object',
  required: ['minPrice', 'maxPrice', 'rooms', 'districts', 'chatID'],
  properties: {
    minPrice: { type: 'integer' },
    maxPrice: { type: 'integer' },
    rooms: { type: 'array', items: { type: 'integer' } },
    districts: { type: 'array', items: { type: 'string' } },
    chatID: { type: 'integer' }
  }
}

const listingsResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      price: { type: 'string' },
      location: { type: 'string' },
      link: { type: 'string' },
      photo: { type: 'string' },
      photo_base_64: { type: 'string' }
    }
  }
}

module.exports = { listingsRequestSchema, listingsResponseSchema }