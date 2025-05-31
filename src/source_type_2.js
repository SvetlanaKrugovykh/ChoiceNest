const puppeteer = require('puppeteer')
const { getCookies } = require('./guards_out/getCredentials')
const fs = require('fs')
const path = require('path')
const { extractSentencesFromHTML_type_2 } = require('./parseHtml_type_2')
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
  const MAX_PAGE = parseInt(process.env.MAX_PAGE || '5', 5)
  const districtList = districts.length === 0 ? [null] : districts

  const screenshotDir = './path/out'
  if (DEBUG_LEVEL > 5 && !fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  for (const district of districtList) {
    let url
    let query = ''
    if (rooms && rooms.length > 0) {
      query += rooms.map(r => `search%5Bfilter_enum_rooms%5D=${r}`).join('&')
    }
    if (query.length > 0) {
      query += '&'
    }
    query += `search%5Bfilter_float_price:from%5D=${minPrice}&search%5Bfilter_float_price:to%5D=${maxPrice}`

    if (district) {
      const queryDistrict = `q-${district.toLowerCase().replace(/\s/g, "-")}/`
      url = `${baseUrl}${queryDistrict}?${query}`
    } else {
      url = `${baseUrl}?${query}`
    }

    let pageNum = 1
    let hasMore = true

    while (hasMore && pageNum <= MAX_PAGE) {
      const pagedUrl = `${url}&page=${pageNum}`

      await page.goto(pagedUrl, { waitUntil: "networkidle0" })
      const safeName = (district || 'all').replace(/[^\w-]+/g, '_')

      if (DEBUG_LEVEL > 5 && pageNum === 1) {
        const filePathScreenshot = path.join(screenshotDir, `src2_${safeName}_p${pageNum}.png`)
        await page.screenshot({ path: filePathScreenshot, fullPage: true })
      }

      const filePathHTML = path.join(screenshotDir, `src2_${safeName}_p${pageNum}.html`)
      const html = await page.content()
      fs.writeFileSync(filePathHTML, html)
      const listings = await extractSentencesFromHTML_type_2(filePathHTML, process.env.PHOTO_LINK_2 || '')

      if (listings.length === 0) {
        hasMore = false
      } else {
        results.push(...listings)
        pageNum++
      }
    }
  }

  await browser.close()
  return results
}

module.exports = { getSource2Listings }