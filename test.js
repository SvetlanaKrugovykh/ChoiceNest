const fs = require('fs')
const getSource2Listings = require('./src/source_type_2').getSource2Listings
const getSource1Listings = require('./src/source_type_1').getSource1Listings
const { addBase64Photo } = require('./src/addBase64Photo')
require('dotenv').config()

const screenshotDir = './path/out'
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}



const districts = ["Mokotów"]
// const districts = ["Mokotów", "Wola"]

async function main() {

  // console.log("\n=== Source1 LISTINGS ===")
  // const source1Results = await getSource1Listings({
  //   minPrice: 2700,
  //   maxPrice: 2800,
  //   rooms: [1, 2],
  //   districts
  // })
  // console.log(source1Results)

  console.log("=== Source2 LISTINGS ===")
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
  console.log(`First ${items}:`, firstSome)
  // console.log(`Last ${items}:`, lastSome)
  const withBase64 = await addBase64Photo(firstSome, 2, '12345678')
  console.log("=== Listings with Base64 Photos ===")
  console.log(withBase64)

}

main().catch(err => {
  console.error("Error fetching listings:", err)
})