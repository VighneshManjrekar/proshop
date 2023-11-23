const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV == "development") console.log(err);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name == "CastError" && err.kind == "ObjectId") {
    message = "Resource not Found";
    statusCode = 404;
  }

  if (err.code == 11000 && err.name == "MongoServerError") {
    statusCode = 400;
    message = `${Object.keys(err.keyPattern).join(" ")} already exists`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV == "production" ? "🥞" : err.stack,
  });
};

export { notFound, errorHandler };
