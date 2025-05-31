const fs = require('fs')
const getSource2Listings = require('./src/source_type_2').getSource2Listings
const getSource1Listings = require('./src/source_type_1').getSource1Listings

const screenshotDir = './path/out'
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}


//const districts = []
const districts = ["Bemowo"]
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
    districts,
    chatID: 12345678,
  })

  const items = 22
  const firstSome = source2Results.slice(0, items)
  const lastSome = source2Results.slice(-items)
  console.log(`First ${items}:`, firstSome)
  console.log(`Last ${items}:`, lastSome)
}

main().catch(err => {
  console.error("Error fetching listings:", err)
})