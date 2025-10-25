const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { sport, eventId, markets, regions, oddsFormat } = event.queryStringParameters;
  
  // Koristi se direktno prosleđeni API ključ
  const apiKey = '1714eab412d57a517df644a71acf2685';

  const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/events/${eventId}/odds?apiKey=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;

  try {
    const response = await fetch(apiUrl);
     if (!response.ok) {
        const errorData = await response.json();
        return {
            statusCode: response.status,
            body: JSON.stringify(errorData),
        }
    }
    
    // Ekstrakcija podataka o potrošnji
    const requestsRemaining = response.headers.get('x-requests-remaining');
    const requestsUsed = response.headers.get('x-requests-used');
    
    const data = await response.json();
    
    // Vraćamo podatke i informaciju o potrošnji
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data, // Originalni podaci
        usageInfo: {
          keyUsed: apiKey.substring(0, 4) + '...', // Obfuskirani ključ
          remaining: requestsRemaining,
          used: requestsUsed
        }
      }),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch odds from The Odds API', error: error.message }),
    };
  }
};
