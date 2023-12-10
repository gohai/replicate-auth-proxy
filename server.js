require('dotenv').config()
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const port = process.env.PORT || 3000;


// Its strongly suggested to put the API token *not* here, but
// instead create a new file named ".env" with the following
// content:
// REPLICATE_API_TOKEN=...
// That file should never be committed to GitHub or made public
// in some other way.

const api_token = process.env.REPLICATE_API_TOKEN || '';
if (!api_token) {
  console.error('REPLICATE_API_TOKEN is not set');
}


app.use(cors({
  origin: '*'
}));

app.use('/', proxy('api.replicate.com', {
  filter: (req, res) => {
    return req.path != '/';
  },
  https: true,
  limit: '10mb',
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['Authorization'] = 'Token ' + api_token;
    return proxyReqOpts;
  },
  userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    // unset the header since the proxy might be serving on http
    if (headers['strict-transport-security']) {
      delete headers['strict-transport-security'];
    }
    return headers;
  }
}));

app.all('/', (req, res) => {
  res.send('Running');
});


try {
  let privateKey = fs.readFileSync('certs/privkey.pem', 'utf8');
  let certificate = fs.readFileSync('certs/fullchain.pem', 'utf8');
  let server = https.createServer({ key: privateKey, cert: certificate }, app);
  server.listen(port);
  console.log('Server listening on port ' + port + ' for HTTPS');
} catch (e) {
  console.warn('No TLS certificates available');
  let server = http.createServer(app);
  server.listen(port);
  console.log('Server listening on port ' + port + ' for HTTP');
}
