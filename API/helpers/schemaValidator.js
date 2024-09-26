const { Validator } = require('jsonschema');
const validator = new Validator();

async function schemaValidator (data, schema) {
    const validationResult = await validator.validate(data, schema);
    if (validationResult.valid) {
        // Данные соответствуют схеме
        return true;
    } else {
        // Данные не соответствуют схеме
        console.error(validationResult.errors);
        return false;
    }
};

module.exports = { schemaValidator };
