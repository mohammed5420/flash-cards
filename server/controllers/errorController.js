const handleProdErrors = (error,res) => {
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
}

const handleDevErrors = (error,res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack
  });
}
module.exports = (error, req, res, next) => {
  console.log(error)
  error.statusCode = error.statusCode || 500;
  error.status = error.status ||"Error";

  if (process.env.ENVIRONMENT === "development") {
    handleDevErrors(error,res);
  } else if(process.env.ENVIRONMENT === "production") {
    handleProdErrors(error,res);
  }
};
