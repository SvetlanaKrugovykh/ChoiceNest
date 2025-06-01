const fs = require('fs')
const getSource2Listings = require('./src/source_type_2').getSource2Listings
const getSource1Listings = require('./src/source_type_1').getSource1Listings
const { addBase64Photo } = require('./src/addBase64Photo')
const logger = require('./src/logger')
require('dotenv').config()

const screenshotDir = './path/out'
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}



const districts = ["Mokotów"]
// const districts = ["Mokotów", "Wola"]

async function main() {

  // logger.log("\n=== Source1 LISTINGS ===")
  // const source1Results = await getSource1Listings({
  //   minPrice: 2700,
  //   maxPrice: 2800,
  //   rooms: [1, 2],
  //   districts
  // })
  // logger.log(source1Results)

  logger.info("=== Source2 LISTINGS ===")
  const source2Results = await getSource2Listings({
    minPrice: 3500,
    maxPrice: 4000,
    rooms: [],
    districts: [],
    chatID: 12345678,
  })

  const items = process.env.ITEMS ? parseInt(process.env.ITEMS) : 7

  const firstSome = source2Results.slice(0, items)
  // const lastSome = source2Results.slice(-items)
  logger.info(`First ${items}: ${JSON.stringify(firstSome, null, 2)}`)
  // logger.log(`Last ${items}:`, lastSome)
  const withBase64 = await addBase64Photo(firstSome, 2, '12345678')
  logger.info("=== Listings with Base64 Photos ===")
  logger.info(JSON.stringify(withBase64, null, 2))

}

main().catch(err => {
  logger.error("Error fetching listings:", err)
})