import { ErrorRequestHandler } from "express";
import HttpException from "../exceptions/HttpException";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  let customError = err;

  if (!(err instanceof HttpException)) {
    customError = new HttpException(
      500,
      "Oh no, this is embarrasing. We are having troubles my friend",
      err
    );
  }

  // we are not using the next function to prvent from triggering
  // the default error-handler. However, make sure you are sending a
  // response to client to prevent memory leaks in case you decide to
  // NOT use, like in this example, the NextFunction .i.e., next(new Error())
  res.status((customError as HttpException).status).send(customError);
};

export default handleError;
