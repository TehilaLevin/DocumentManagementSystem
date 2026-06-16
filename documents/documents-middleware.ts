import { NextFunction, Request, Response } from "express";

export default class DocumentsMiddlewares {

    static validateCreateDocument(req: Request, res: Response, next: NextFunction) {
        const { path, title, content } = req.body;

        if (!path || typeof path !== 'string' || path.trim() === '') {
            const err: any = new Error("Invalid or missing path");
            err.status = 400;
            return next(err);
        }

        if (!title || typeof title !== 'string' || title.length < 2) {
            const err: any = new Error("Invalid or missing title (min 2 characters)");
            err.status = 400;
            return next(err);
        }

        if (!content || typeof content !== 'string') {
            const err: any = new Error("Invalid or missing content");
            err.status = 400;
            return next(err);
        }

        next();
    }
    static validateUpdateDocument(req: Request, res: Response, next: NextFunction) {
        const { content, title } = req.body;
        if (!content && !title) {
            const err: any = new Error("Nothing to update: content or title required");
            err.status = 400;
            return next(err);
        }

        next();
    }
    static validateDocumentId(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if (!id || id.trim() === '') {
            const err: any = new Error("Document ID is required");
            err.status = 400;
            return next(err);
        }

        next();
    }
}