const {postApi} = require('../helpers/apiHelper')
const {getApi} = require('../helpers/apiHelper')
require('dotenv').config();
const producrOrderJsonSchema = require('../data/productOrders.v1.json')

const { Validator } = require('jsonschema');
const validator = new Validator();

const { url, basicConfig } = require('../helpers/constants.js');





describe('POST request to pre-order new service', () => {
    let response;

    const productData = {"productType":"call_forwarding","productOfferingId":"4.294-20191008094203","subscriptionId":"000020007722165","callForwardingResponse":{"productId":"4.294-20191008094203","cfnry":"On","cfnryNumber":"375296000240","cfnryTime":"5"}}

    beforeEach(async () => {
        response = await getApi(url.basicURL, basicConfig);
        const bearerToken = response.data;
        const productOrderConfig = { headers: { 'Authorization': `${process.env.basicToken}`, 'x-sso-authorization': `${bearerToken}`, 'billing-account-id' : `${process.env.billingAccoutId}`, 'user-role' : 'SelfcareSupervisorLegal'}};
        productOrderResponse = await postApi(url.productOrderURL, productData, productOrderConfig);
    });

    test('The request should return status code 200', () => {
        expect(productOrderResponse.status).toEqual(200);
    });

    test("The response should match the appropriate JSON schema", () => {
        const validationResult = validator.validate(productOrderResponse.data, producrOrderJsonSchema);
        expect(validationResult.valid).toEqual(true);
    });


});