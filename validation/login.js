const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Make sure there are strings to check
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email Validation
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  //Password Validation
  if (Validator.isEmpty(data.password)) {
    errors.password = "Please enter your password";
  }

  // Return errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
