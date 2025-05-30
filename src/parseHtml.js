const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path')

module.exports.extractSentencesFromHTML = async function (filename, photo_link) {
  try {
    const filePath = path.resolve(filename)
    const html = fs.readFileSync(filePath, 'utf-8')
    const $ = cheerio.load(html)

    const results = []

    $('[data-testid="l-card"]').each((_, el) => {
      const $el = $(el)
      const title = $el.find('h4').first().text().trim()
      const price = $el.find('[data-testid="ad-price"]').first().text().trim()
      const location = $el.find('[data-testid="location-date"]').first().text().trim()
      const link = $el.find('a.css-1tqlkj0').first().attr('href') || ''
      let photo = $el.find('img.css-8wsg1m').first().attr('src') || ''
      if (photo && photo.startsWith('/')) {
        photo = photo_link + photo
      }
      let fullLink = link
      if (link && link.startsWith('/')) {
        fullLink = photo_link + link
      }

      results.push({
        title,
        price,
        location,
        link: fullLink,
        photo
      })
    })

    return results
  } catch (err) {
    console.error('Ошибка при чтении HTML:', err.message)
    return []
  }
}