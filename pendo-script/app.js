// const fetch = require('node-fetch');
const axios = require("axios");
// const cheerio = require("cheerio");
const crypto = require('crypto');

// const url = "http://quotes.toscrape.com/";
// https://lxgplhwh03.execute-api.us-west-1.amazonaws.com/Prod/quotes

// const url = "https://lxgplhwh03.execute-api.us-west-1.amazonaws.com/Prod/quotes";

exports.lambdaHandler = async (_event, _context) => {
  const appKey = _event.queryStringParameters.key;
  const url = `https://cdn.pendo.io/agent/static/${appKey}/pendo.js`;
  try {
    // const response = await axios(url);
    const types = [
      // 'sha256',
      // 'sha384',
      'sha512',
    ];

    async function getResourceContent(url) {
      // const response = await fetch(url);
      const response = await axios(url);
      console.log(response);
      // const text = await response.text();
      // return text;
      return response.data;
    }

    // const pendoJs = await getResourceContent(url);
    function getHash(type, content) {
      return crypto.createHash(type).update(content, 'utf8').digest('base64');
    }
    
    async function getBase64HashFromUrl(types, url) {
      const content = await getResourceContent(url);
      return types.map(type => `${type}-${getHash(type, content)}`).join(' ');
    }

    const hash = await getBase64HashFromUrl(types, url);

    function getResourceHTML(url, hash) {
      return `<script src="${url}" integrity="${hash}" crossorigin="anonymous"></script>`;
    }

    const htmlScript = await getResourceHTML(url, hash);



    return {
      statusCode: 200,
      body: htmlScript,
      // body: JSON.stringify({response: htmlScript}),
      // body: pendoJs.toString(),
      // body: JSON.stringify(appKey),
      // body: JSON.stringify(_event),
      // body: JSON.stringify(_context),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
