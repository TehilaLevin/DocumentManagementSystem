import { DocumentModel } from "../documents/models";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            document?: DocumentModel;
        }
    }
}

export {};