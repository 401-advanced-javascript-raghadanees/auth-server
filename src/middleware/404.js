'use strict';
/**
 * middleware for 404 errors
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */
module.exports = (req, res, next ) => {
  res.status(404).send('page is not found 404 !!');
};