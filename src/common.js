module.exports.parsePolishDate = function (str) {
  const match = str.match(/(\d{1,2}) (\w+) (\d{4})/)
  if (!match) return new Date(0)
  const [_, day, monthPl, year] = match
  const months = {
    stycznia: 0, lutego: 1, marca: 2, kwietnia: 3, maja: 4, czerwca: 5,
    lipca: 6, sierpnia: 7, września: 8, października: 9, listopada: 10, grudnia: 11
  }
  const month = months[monthPl.toLowerCase()] ?? 0
  return new Date(Number(year), month, Number(day))
}