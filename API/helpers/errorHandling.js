const axios = require('axios');

async function errorHandling (request, expectedStatus) {
  return request
    .then(() => {
      throw new Error(`Expected a ${expectedStatus} error, but succeeded`);
    })
    .catch((error) => {
      if (error.response && error.response.status === expectedStatus) {
        // Ошибка с ожидаемым статусом, тест пройден
        return; 
      } else {
        // Неожиданная ошибка, перебрасываем ее дальше
        throw error;
      }
    });
};

module.exports = { errorHandling };