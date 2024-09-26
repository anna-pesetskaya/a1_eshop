const userJsonSchema = require('../data/user.v1.json')
const {getApi} = require('../helpers/apiHelper')

const url= 'https://fakerestapi.azurewebsites.net/api/v1/Users';
const config = { headers: { "Content-Type": "application/json" } };
const { Validator } = require('jsonschema');
const validator = new Validator();

async function executionGetByIdTests() {
       describe('GET data by ID /api/v1/users', () => {
        let response;
        const id = 2;

        beforeEach(async () => {
            response = await getApi(`${url}/${id}`, config);
        });

        test('The request should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        test("The response should match the appropriate JSON schema", () => {
            const validationResult = validator.validate(response.data, userJsonSchema);
            expect(validationResult.valid).toEqual(true);
        });

        test("The response ID field should match the requested ID", () => {
            expect(response.data.id).toEqual(id);
        });

    });
};

module.exports = { executionGetByIdTests };