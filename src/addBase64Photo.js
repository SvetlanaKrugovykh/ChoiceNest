const puppeteer = require('puppeteer')
const { getCookies } = require('./guards_out/getCredentials')
const fs = require('fs')
const path = require('path')

async function findMainPhotoUrl(page) {
  return await page.evaluate(() => {
    let img = document.querySelector('img[data-cy="adPageAdPhoto"]')
    if (img && img.src) return img.src

    img = document.querySelector('img[data-testid="gallery-image"]')
    if (img && img.src) return img.src

    img = document.querySelector('figure img')
    if (img && img.src) return img.src

    const meta = document.querySelector('meta[property="og:image"]')
    if (meta && meta.content) return meta.content

    img = document.querySelector('img')
    if (img && img.src) return img.src

    return ''
  })
}

async function addBase64Photo(listings, source_num, chatID = 'default') {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  try {
    const cookies = getCookies(source_num)
    const context = browser.defaultBrowserContext()
    await context.setCookie(...cookies)
  } catch (e) {
    console.error('Failed to set cookies:', e.message)
  }

  const screenshotDir = './path/out'
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }

  const results = []

  for (let i = 0; i < listings.length; i++) {
    const item = listings[i]
    try {
      await page.goto(item.link, { waitUntil: 'networkidle2' })
      const safeName = (item.title || 'item').replace(/[^\w-]+/g, '_').slice(0, 30)
      const filePathHTML = path.join(screenshotDir, `src2_photo_${chatID}_${safeName}_p${i + 1}.html`)
      const html = await page.content()
      fs.writeFileSync(filePathHTML, html)

      let photoUrl = await findMainPhotoUrl(page)

      let photo_base_64 = ''
      if (photoUrl) {
        const viewSource = await page.goto(photoUrl)
        const buffer = await viewSource.buffer()
        photo_base_64 = buffer.toString('base64')
      }

      results.push({ ...item, photo_base_64 })
    } catch (err) {
      results.push({ ...item, photo_base_64: '' })
      console.error(`Error processing link ${item.link}:`, err.message)
    }
  }

  await browser.close()
  return results
}

module.exports = { addBase64Photo }