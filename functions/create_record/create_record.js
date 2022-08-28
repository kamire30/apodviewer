const axios = require("axios");
const bcrypt = require("bcrypt");

const handler = async (event) => {
  // Var Declaring
  const salt_rounds = 10;
  const url = "https://api.airtable.com/v0/app6lXK9YVcbG5kzu/login_details";

  // Query String Parameters
  const email = event.queryStringParameters.email;
  const API_KEY = process.env.AIRTABLE_KEY;
  const password = await bcrypt.hash(event.queryStringParameters.pass, salt_rounds)
    .then(res => {
      return res});

  const param = {
    "fields": {
      "field-id": "placeholder",
      "email": email,
      "password": password,
      "saves": "[]"
    }
  }

  const { data } = await axios.post(url, param, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  }}
  
module.exports = { handler }
