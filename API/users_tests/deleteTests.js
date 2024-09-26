const {deleteApi} = require('../helpers/apiHelper')

const url= 'https://fakerestapi.azurewebsites.net/api/v1/Users';
const config = { headers: { "Content-Type": "application/json" } };

async function executionDeleteTests() {
    describe("DELETE", () => {
        let response;
        const id = 5;

        beforeEach(async () => {
            response = await deleteApi(`${url}/${id}`, config);
        });

        test("Should return status code 200", () => {
            expect(response.status).toEqual(200);
        });

    
    });

};

module.exports = { executionDeleteTests };