const fs = require('fs')
const getSource2Listings = require('./src/source_type_2').getSource2Listings
const getSource1Listings = require('./src/source_type_1').getSource1Listings

const screenshotDir = './path/out'
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}


const districts = []
// const districts = ["", "", ""]  //TODO

async function main() {

  console.log("\n=== Source1 LISTINGS ===")
  const source1Results = await getSource1Listings({
    minPrice: 1500,
    maxPrice: 5000,
    rooms: [1, 2],
    districts
  })
  console.log(source1Results)

  // console.log("=== Source2 LISTINGS ===")
  // const source2Results = await getSource2Listings({
  //   minPrice: 2700,
  //   maxPrice: 2800,
  //   rooms: [1, 2],
  //   districts
  // })
  // console.log(source2Results)

}

main().catch(err => {
  console.error("Error fetching listings:", err)
})