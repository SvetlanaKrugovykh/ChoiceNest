const puppeteer = require('puppeteer')
const { getCookies } = require('./guards_out/getCredentials')
const fs = require('fs')
const path = require('path')
const { extractSentencesFromHTML_type_1 } = require('./parseHtml_type_1')
require('dotenv').config()

async function getSource1Listings({ minPrice = 1000, maxPrice = 5000, rooms = [1, 2, 3], districts = [] } = {}) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  const cookies = getCookies(1)
  const context = browser.defaultBrowserContext()
  await context.setCookie(...cookies)

  const results = []
  const baseUrl = process.env.URL_1
  const DEBUG_LEVEL = parseInt(process.env.DEBUG_LEVEL || '0', 10)
  const districtList = districts.length === 0 ? [null] : districts

  const screenshotDir = './path/out'
  if (DEBUG_LEVEL > 5 && !fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  for (const district of districtList) {
    let url
    let query = `priceMin=${minPrice}&priceMax=${maxPrice}`
    for (const r of rooms) {
      query += `&roomsNumber=${r}`
    }
    if (district) {
      const districtPath = district.toLowerCase().replace(/\s/g, "-")
      url = `${baseUrl}/${districtPath}?${query}`
    } else {
      url = `${baseUrl}?${query}`
    }

    await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 })

    const safeName = (district || 'all').replace(/[^\w-]+/g, '_')

    if (DEBUG_LEVEL > 5) {
      const filePathScreenshot = path.join(screenshotDir, `src1_${safeName}.png`)
      await page.screenshot({ path: filePathScreenshot, fullPage: true })
    }

    const filePathHTML = path.join(screenshotDir, `src1_${safeName}.html`)
    const html = await page.content()
    fs.writeFileSync(filePathHTML, html)

    const listings = await extractSentencesFromHTML_type_1(filePathHTML, process.env.PHOTO_LINK_1 || '')
    results.push(...listings)
  }

  await browser.close()
  return results
}

module.exports = { getSource1Listings }