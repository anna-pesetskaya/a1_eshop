const userJsonSchema = require('../data/user.v1.json')
const {putApi} = require('../helpers/apiHelper')

const url= 'https://fakerestapi.azurewebsites.net/api/v1/Users';
const config = { headers: { "Content-Type": "application/json" } };
const { Validator } = require('jsonschema');
const validator = new Validator();

async function executionPutTests() {

    describe('PUT /api/v1/users', () => {
        let response;
        const id = 5;
        const updatedUser = {
            "id": 5,
            "userName": "test",
            "password": "test"
            }

            beforeEach(async () => {
                response = await putApi(`${url}/${id}`, updatedUser, config);
            });

            test("Should return status code 200", () => {
                expect(response.status).toEqual(200);
            });

            test("The response should match the appropriate JSON schema", () => {
                const validationResult = validator.validate(response.data, userJsonSchema);
                expect(validationResult.valid).toEqual(true);
            });
    

            test("The response should be the same as the body", () => {
                expect(response.data).toEqual(updatedUser);
            });

    });
};

module.exports = { executionPutTests }