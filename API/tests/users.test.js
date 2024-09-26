const {executionGetTests} = require('../users_tests/getTests');
const {executionGetByIdTests} = require('../users_tests/getByIdTests');
const {executionPostTests} = require('../users_tests/postTests');
const {executionPutTests} = require('../users_tests/putTests');
const {executionDeleteTests} = require('../users_tests/deleteTests');


describe("USERS API tests", () => {
    executionGetTests();
    executionGetByIdTests();
    executionPostTests();
    executionPutTests();
    executionDeleteTests();
});