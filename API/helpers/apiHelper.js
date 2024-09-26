const axios = require('axios');

// Функции для работы с API
async function getApi(url, config) {
    return axios.get(url, config);
}

async function postApi(url, body, config) {
    return axios.post(url, body, config);
}

async function putApi(url, body, config) {
    return axios.put(url, body, config);
}

async function deleteApi(url, config) {
    return axios.delete(url, config);
}

// Экспортируем функции
module.exports = {
    getApi,
    postApi,
    putApi,
    deleteApi
};