const puppeteer = require('puppeteer')
const { getCookies } = require('./guards_out/getCredentials')
const fs = require('fs')
const path = require('path')
const { extractSentencesFromHTML_type_2 } = require('./parseHtml_type_2')
const { parsePolishDate } = require('./common')
require('dotenv').config()

async function getSource2Listings({ minPrice = 1000, maxPrice = 5000, rooms = [], districts = [], chatID } = {}) {
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
  const logger = require('../src/logger')
  const screenshotDir = './path/out'
  if (DEBUG_LEVEL > 5 && !fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  for (const district of districtList) {
    let url
    let query = ''
    query += `search%5Bfilter_float_price:from%5D=${minPrice}&search%5Bfilter_float_price:to%5D=${maxPrice}`

    if (district) {
      const districtParam = `q=${encodeURIComponent(district)}&`
      url = `${baseUrl}?${districtParam}${query}`
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
        const filePathScreenshot = path.join(screenshotDir, `src2_${chatID}_${safeName}_p${pageNum}.png`)
        await page.screenshot({ path: filePathScreenshot, fullPage: true })
      }

      const filePathHTML = path.join(screenshotDir, `src2_${chatID}_${safeName}_p${pageNum}.html`)
      const html = await page.content()
      fs.writeFileSync(filePathHTML, html)
      const listings = await extractSentencesFromHTML_type_2(filePathHTML, process.env.PHOTO_LINK_2 || '')

      if (listings.length === 0) {
        hasMore = false
      } else {
        results.push(...listings)
        fs.unlinkSync(filePathHTML)
        pageNum++
      }
    }
  }

  await browser.close()

  logger.log('Results before deduplication:', results.length)
  const unique = []
  const seen = new Set()
  for (const item of results) {
    if (item.link && !seen.has(item.link)) {
      unique.push(item)
      seen.add(item.link)
    }
  }

  logger.log('Results after deduplication:', unique.length)

  unique.sort((a, b) => {
    const dateA = parsePolishDate(a.location)
    const dateB = parsePolishDate(b.location)
    return dateB - dateA
  })

  return unique
}

module.exports = { getSource2Listings }