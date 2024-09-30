require('dotenv').config();

const url = {
    basicURL: `https://appopenapi.a1.by/v1new_prod/public/access-token?password=${process.env.password}&realm=${process.env.msisdn}@a1.by`,
    ratePlanURL: "https://appopenapi.a1.by/v1new_prod/tariff/available",
    servicesURL: "https://appopenapi.a1.by/v1new_prod/available-services",
    productOrderCheckURL: "https://appopenapi.a1.by/v1new_prod/product-order-checks",
    productOrderURL: "https://appopenapi.a1.by/v1new_prod/product-orders",
};

const basicConfig = { headers: { 'Authorization': `${process.env.basicToken}` } };

module.exports = {
    url,
    basicConfig,
};