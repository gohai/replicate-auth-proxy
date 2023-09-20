require('dotenv').config()
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


app.use('/', proxy('api.replicate.com', {
  filter: (req, res) => {
    return req.path != '/';
  },
  https: true,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['Authorization'] = 'Token ' + api_token;
    return proxyReqOpts;
  }
}));

app.use(cors({
  origin: '*'
}));

app.all('/', (req, res) => {
  res.send('Running');
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
