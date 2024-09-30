const {getApi} = require('../helpers/apiHelper.js')
const {errorHandling} = require('../helpers/errorHandling.js');
require('dotenv').config();
const { url, basicConfig } = require('../helpers/constants.js');

const trimmedUrl = url.basicURL.replace(/&realm=[^&]*/, '');
const finalUrl = trimmedUrl.replace(/\?&/, '?').replace(/\?$/, '');



describe('GET bearer token', () => {
    let response;

        beforeEach(async () => {
            response = await getApi(url.basicURL, basicConfig);
        });

        test('The request should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

      

        test('Should return status code 400 for invalid config', async () => {
            await errorHandling(getApi(finalUrl, basicConfig), 400);
        });

        test('Token should not be null', () => {
            token = response.data;
            expect(token).toBeDefined(); 
            expect(token).not.toBeNull();
          });

        test('Get response from API to use it as input to other API', () => {
            const bearerToken = response.data;
            console.log(bearerToken)
        });

   
});
