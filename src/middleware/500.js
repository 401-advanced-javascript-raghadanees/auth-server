'use strict';

/**
 * middleware will respond with 500 server errors
 * @param {*} err
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
module.exports = (err, req, res, next) => {
  res.status(500).send('Server Error !! ..............');
};