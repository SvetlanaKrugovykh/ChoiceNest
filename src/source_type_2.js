const puppeteer = require('puppeteer')
const { getCookies } = require('./guards_out/getCredentials')
const fs = require('fs')
const path = require('path')
const { extractSentencesFromHTML } = require('./parseHtml')
require('dotenv').config()

async function getSource2Listings({ minPrice = 1000, maxPrice = 5000, rooms = [1, 2, 3], districts = [] } = {}) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  const cookies = getCookies(2)
  const context = browser.defaultBrowserContext()
  await context.setCookie(...cookies)

  const results = []
  const baseUrl = process.env.URL_2
  const DEBUG_LEVEL = parseInt(process.env.DEBUG_LEVEL || '0', 10)
  const districtList = districts.length === 0 ? [null] : districts

  const screenshotDir = './path/out'
  if (DEBUG_LEVEL > 5 && !fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  for (const district of districtList) {
    const queryDistrict = district ? `q-${district.toLowerCase().replace(/\s/g, "-")}/` : ''
    const url = `${baseUrl}${queryDistrict}?search%5Bfilter_float_price:from%5D=${minPrice}&search%5Bfilter_float_price:to%5D=${maxPrice}`

    await page.goto(url, { waitUntil: "networkidle0" })
    const safeName = (district || 'all').replace(/[^\w-]+/g, '_')

    if (DEBUG_LEVEL > 5) {
      const filePathScreenshot = path.join(screenshotDir, `src2_${safeName}.png`)
      await page.screenshot({ path: filePathScreenshot, fullPage: true })
    }

    const filePathHTML = path.join(screenshotDir, `src2_${safeName}.html`)
    const html = await page.content()
    fs.writeFileSync(filePathHTML, html)
    const listings = await extractSentencesFromHTML(filePathHTML, process.env.PHOTO_LINK_2 || '')


    results.push(...listings)
  }

  await browser.close()
  return results
}

module.exports = { getSource2Listings }
