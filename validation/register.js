const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Make sure there are strings to check
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Email Validation
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Please enter your email";
  }

  //Password Validation
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 2 and 30 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords do not match";
  }

  // Return errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
