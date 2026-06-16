import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}
export default class UserMiddleware {
    static validateUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId || userId.trim() === '') {
            const error: any = new Error("Unauthorized: Missing X-User-Id header");
            error.status = 401; 
            return next(error);
        }
        req.userId = userId;
        next();
    }
}
