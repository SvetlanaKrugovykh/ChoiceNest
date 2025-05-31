const { getSource2Listings } = require('../source_type_2')
const { addBase64Photo } = require('../addBase64Photo')
require('dotenv').config()

exports.getListings = async (req, reply) => {
  const { minPrice, maxPrice, rooms, districts, chatID } = req.body
  const listings = await getSource2Listings({ minPrice, maxPrice, rooms, districts, chatID })
  const items = process.env.ITEMS ? parseInt(process.env.ITEMS) : 7
  const firstSome = listings.slice(0, items)
  const withBase64 = await addBase64Photo(firstSome, 2, chatID)
  return withBase64
}




