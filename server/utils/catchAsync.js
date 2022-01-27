module.exports = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch((error) => next(error));
  };
};
