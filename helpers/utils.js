async function getRandomKeyFromDictionary(dictionary) {
  const keysArray = Object.keys(dictionary);
  return keysArray[Math.floor(Math.random() * keysArray.length)];
}

async function parseFloating(element) {
  parseFloat(element.replace(/[^\d.]/g, ''))
}

module.exports = { getRandomKeyFromDictionary, parseFloating};