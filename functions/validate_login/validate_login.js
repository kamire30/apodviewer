const bcrypt = require("bcrypt");

const handler = async (event) => {
  const email = event.queryStringParameters.email;
  const password = event.queryStringParameters.pass;
  const plaintext_password = event.queryStringParameters.ptext_pass;

  const match = await bcrypt.compare(plaintext_password, password)

  if (match == true) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: true }),
    } 
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: false })
    }
  }
  

  
}

module.exports = { handler }
