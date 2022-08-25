const axios = require('axios');

const handler = async (event) => {
  const email = event.queryStringParameters.email;
  const password = event.queryStringParameters.pass;
  const API_KEY = process.env.AIRTABLE_KEY;
  const url = "https://api.airtable.com/v0/app6lXK9YVcbG5kzu/login_details"

  try {
    const param = {
      "fields": {
        "field-id": "placeholder",
        "email": email,
        "password": password
      }
    }

    const { data } = await axios.post(url, param, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log(data)

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    const {status, statusText, headers, data} = error.response;

    return {
      statusCode: 500, 
      body: JSON.stringify({status, statusText, headers, data})
    }
  }
}

module.exports = { handler }
