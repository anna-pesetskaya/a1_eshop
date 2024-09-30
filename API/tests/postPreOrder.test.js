const {postApi} = require('../helpers/apiHelper')
const {getApi} = require('../helpers/apiHelper')
require('dotenv').config();
const preorderJsonSchema = require('../data/preorderService.v1.json')

const { Validator } = require('jsonschema');
const validator = new Validator();
const { url, basicConfig } = require('../helpers/constants.js');




describe('POST request to pre-order new service', () => {
    let response;

    const serviceData = {"subscriptionId":"195401990","productOfferingId":"6.66-5.1.77_CURRENT","productType":"addon"}

    beforeEach(async () => {
        response = await getApi(url.basicURL, basicConfig);
        const bearerToken = response.data;
        const preOrderConfig = { headers: { 'Authorization': `${process.env.basicToken}`, 'x-sso-authorization': `${bearerToken}`} };
        preorderResponse = await postApi(url.productOrderCheckURL, serviceData, preOrderConfig);
    });

    test('The request should return status code 200', () => {
        expect(preorderResponse.status).toEqual(200);
    });

    test("The response should match the appropriate JSON schema", () => {
        const validationResult = validator.validate(preorderResponse.data, preorderJsonSchema);
        expect(validationResult.valid).toEqual(true);
    });


});