const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // Return errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
