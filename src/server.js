'use strict';
require('dotenv').config(); // npm i express dotenv
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./auth/router.js');
const extraRoutes = require ('./auth/extra-routes');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const status_404 = require('./middleware/404.js');
const status_500 = require('./middleware/500.js');

app.use(router);
app.use(extraRoutes);
// test
// app.get('/', (req, res) => {
//     res.status(200).send('Home Page');
//   });

// 404 500 must be at the end
app.use('*', status_404);
app.use(status_500);

// http://localhost:4000
module.exports = {
  server: app,
  start: PORT => {
    PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};
