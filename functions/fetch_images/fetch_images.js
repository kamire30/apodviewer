const axios = require('axios');

const handler = async (event) => {
    const API_KEY = process.env.API_KEY;
    const start_date = event.queryStringParameters.start_date;
    const current_date = event.queryStringParameters.today_date;
    const end_date = event.queryStringParameters.tomorrow_date;
    var url = ""

    try {
        if (end_date == "n") {
            url = `https://apod.ellanan.com/api?start_date=${start_date}`;
        } else {
            url = `https://apod.ellanan.com/api?start_date=${start_date}&end_date=${end_date}`
        }

        const { data } = await axios.get(url);
        
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
}

module.exports = { handler }
