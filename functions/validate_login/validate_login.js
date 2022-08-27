const axios = require("axios");
const bcrypt = require("bcrypt");

const handler = async (event) => {
  email = event.queryStringParameters.email;
  password = event.queryStringParameters.pass;
  plaintext_password = event.queryStringParameters.ptext_pass;

  try {
    bcrypt.compare(plaintext_password, password, function(err, result) {
      if (result == true) {
        console.log("RIOTHYIOJRJIOGJOGIIOGJJGDFI")
        return {
          statusCode: 200,
          body: "hehehe",
        }
      }
  });

  } catch (error) {
    const {status, statusText, headers, data} = error.response;

    return {
      statusCode: status, 
      body: JSON.stringify({status, statusText, headers, data})
    }
  }
}

module.exports = { handler }
