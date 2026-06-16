import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Time: ${new Date().toISOString()}`);
    console.error(`Path: ${req.path} | Method: ${req.method}`);
    console.error(`User ID: ${req.headers['x-user-id'] || 'N/A'}`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`); 
    res.status(err.status || 500).json({
        status: "error",
        message: err.status ? err.message : "Something went wrong on our end"
    });
};

export default class ErrorMiddleware {
    static errorHandler = globalErrorHandler;
}


