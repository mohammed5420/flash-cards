const AppError = require("./../utils/errorsHandler");
const handleCastErrors = (error) => {
  //Handle invalid flashcards IDs
  return new AppError(`Invalid ${error.path}: ${error.value}`, 406);
};
const handleProdErrors = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const handleDevErrors = (error, res) => {
  //Handle invalid flashcards IDs
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";
  // console.log("Current env => ", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return handleDevErrors(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (error.name === "CastError") {
      err = handleCastErrors(err);
    }
    return handleProdErrors(err, res);
  }
};
