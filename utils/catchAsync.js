/**
 * utility function to catch errors on async functions
 * @param {function} callback
 * @returns send new error for express error handler
 */
module.exports = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch((error) => next(error));
  };
};
