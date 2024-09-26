// const validateSchema = require('../helpers/schemaValidator')
// const errorHandling = require('../helpers/errorHandling')
const userJsonSchema = require('../data/user.v1.json')

const {postApi }= require('../helpers/apiHelper')

const url= 'https://fakerestapi.azurewebsites.net/api/v1/Users';
const config = { headers: { "Content-Type": "application/json" } };
const { Validator } = require('jsonschema');
const validator = new Validator();


async function executionPostTests() {
    describe('POST /api/v1/users', () => {
        let response;

        const newUser = {
            id: 5,
            userName: 'zenna',
            password: 'qwerty123',
        };

        beforeEach(async () => {
            response = await postApi(url, newUser, config);
        });

        test('The request should return status code 200', () => {
            expect(response.status).toEqual(200);
        });

        test("The response should match the appropriate JSON schema", () => {
            const validationResult = validator.validate(response.data, userJsonSchema);
            expect(validationResult.valid).toEqual(true);
        });

    });
};

module.exports = { executionPostTests }