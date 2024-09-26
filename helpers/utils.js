function getRandomKeyFromDictionary(dictionary) {
  const keysArray = Object.keys(dictionary);
  return keysArray[Math.floor(Math.random() * keysArray.length)];
}

function makeParseFloat(element) {
  const changedElement = parseFloat(element.replace(/[^\d.]/g, ''));
  return changedElement
}
function getRandomInt(count) {
  return Math.floor(Math.random() * count);
}

module.exports = { getRandomKeyFromDictionary, makeParseFloat, getRandomInt};