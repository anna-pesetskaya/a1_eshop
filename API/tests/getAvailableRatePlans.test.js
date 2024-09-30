const {getApi} = require('../helpers/apiHelper.js')
const {errorHandling} = require('../helpers/errorHandling.js');
require('dotenv').config();
const availableRatePlanJsonSchema = require('../data/availableRatePlan.v1.json');

const { Validator } = require('jsonschema');
const validator = new Validator();


const { url, basicConfig } = require('../helpers/constants.js');
const {parseTariffs} = require('../helpers/ratePlansParsing.js');



        
describe('GET available rate plans', () => {
    let response;

        beforeEach(async () => {
            response = await getApi(url.basicURL, basicConfig);
            const bearerToken = response.data;
            const ratePlanConfig = { headers: { 'Authorization': `${process.env.basicToken}`, 'x-sso-authorization': `${bearerToken}`} };
            ratePlanResponse = await getApi(url.ratePlanURL, ratePlanConfig);
        });

        test('The request should return status code 200', () => {
            expect(ratePlanResponse.status).toEqual(200);
        });


        test('Should return status code 401 if send incorrect URL', async () => {
            await errorHandling(getApi(url.ratePlanURL+test), 401);
        });

        test('The response should match the appropriate JSON schema', async () => {
            const validationResult = validator.validate(ratePlanResponse.data, availableRatePlanJsonSchema);
            expect(validationResult.valid).toEqual(true);
        });

        test('Get response from API', () => {
            const availableRatePlanResponse = ratePlanResponse.data;
            expect(availableRatePlanResponse.data).toHaveProperty('attributes');
            parseTariffs(availableRatePlanResponse)
        });
    

   
});
