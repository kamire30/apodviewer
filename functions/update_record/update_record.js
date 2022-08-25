const axios = require('axios');

const handler = async (event) => {
  const field_id = event.queryStringParameters.field_id;
  const email = event.queryStringParameters.email;
  const password = event.queryStringParameters.pass;
  const API_KEY = process.env.AIRTABLE_KEY;
  const url = `https://api.airtable.com/v0/app6lXK9YVcbG5kzu/login_details/${field_id}`;

  console.log(url)

  try {
    const param = {
      "fields": {
        "field-id": field_id,
        "email": email,
        "password": password
      }
    }

    const { data } = await axios.patch(url, param, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    const {status, statusText, headers, data} = error.response;

    return {
      statusCode: status, 
      body: JSON.stringify({status, statusText, headers, data})
    }
  }
}

module.exports = { handler }
