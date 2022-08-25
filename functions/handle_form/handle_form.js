const axios = require('axios');


const handler = async (event) => {
  // Vars
  const email = event.queryStringParameters.email;
  const password = event.queryStringParameters.pass;
  const API_KEY = process.env.AIRTABLE_KEY;
  const url = "https://api.airtable.com/v0/app6lXK9YVcbG5kzu/login_details"

  // Requests
  
  try {
    const { data } = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }

  } catch (error) {
    const {status, statusText, headers, data} = error.response

    return {
      statusCode: status, 
      body: JSON.stringify({status, statusText, headers, data})
    }
  }

};

module.exports = { handler }
