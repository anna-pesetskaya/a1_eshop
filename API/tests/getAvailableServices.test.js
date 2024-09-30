const {getApi} = require('../helpers/apiHelper.js')
const {errorHandling} = require('../helpers/errorHandling.js');
require('dotenv').config();
const availableServicesJsonSchema = require('../data/availableServices.v1.json');

const { Validator } = require('jsonschema');
const validator = new Validator();

const { url, basicConfig } = require('../helpers/constants.js');



describe('GET available services', () => {
    let response;

        beforeEach(async () => {
            response = await getApi(url.basicURL, basicConfig);
            const bearerToken = response.data;
            const servicesConfig = { headers: { 'Authorization': `${process.env.basicToken}`, 'x-sso-authorization': `${bearerToken}`} };
            servicesResponse = await getApi(url.servicesURL, servicesConfig);
        });

        test('The request should return status code 200', () => {
            expect(servicesResponse.status).toEqual(200);
        });


        test('Should return status code 500 if send incorrect URL', async () => {
            await errorHandling(getApi(url.servicesURL+test), 500);
        });

        test('The response should match the appropriate JSON schema', async () => {
            const validationResult = validator.validate(servicesResponse.data, availableServicesJsonSchema);
            expect(validationResult.valid).toEqual(true);
        });

        
        test('Get response from API', () => {
            const availableServicesApiResponse = servicesResponse.data;
            console.log(availableServicesApiResponse)
            expect(availableServicesApiResponse.data).toHaveProperty('attributes');
            expect(Array.isArray(availableServicesApiResponse.data.attributes.availableItems)).toBe(true);
            console.log(Array(availableServicesApiResponse.data.attributes.availableItems))
        });
        
});

  