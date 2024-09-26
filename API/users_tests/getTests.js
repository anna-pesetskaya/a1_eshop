const {getApi} = require('../helpers/apiHelper')
const {schemaValidator} = require('../helpers/schemaValidator')
const usersJsonSchema = require('../data/users.v1.json');
const {errorHandling} = require('../helpers/errorHandling');
const { Validator } = require('jsonschema');
const validator = new Validator();

const url= 'https://fakerestapi.azurewebsites.net/api/v1/Users';
const config = { headers: { "Content-Type": "application/json" } };

async function executionGetTests() {
    describe('GET /api/v1/users', () => {
        let response;

        beforeEach(async () => {
            response = await getApi(url, config);
        });

        test('The request should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        //Пробовала положить вызов проверки схемы в отдельную функцию, но она возвращает пустой обънект, не поняла почему.
        // it('The response should match the appropriate JSON schema', async () => {
        //     expect(schemaValidator(response.data, usersJsonSchema)).toEqual(true);
        // });

        it('The response should match the appropriate JSON schema', async () => {
            const validationResult = validator.validate(response.data, usersJsonSchema);
            expect(validationResult.valid).toEqual(true);
        });

        test('Should return status code 404 for invalid endpoint', async () => {
            await errorHandling(getApi(url+test, config), 404);
        });
    });
};

module.exports = { executionGetTests };