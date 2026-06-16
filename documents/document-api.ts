import { Request, Response, Router, NextFunction } from "express";
import DocumentsService from "./document-service";
import HistoryService from "../history/history-service";
import HistoryMiddleware from "../history/history-middleware";
import UserMiddleware, { AuthenticatedRequest } from "../utils/user-middleware";
import DocumentsMiddlewares from "./documents-middleware";

export default class DocumentsApi {
    public router: Router;
    constructor(
        private documentsService: DocumentsService,
        private historyService: HistoryService
    ) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        const historyLog = HistoryMiddleware.createHistoryLog(this.historyService);
        this.router.use(UserMiddleware.validateUserId);
        this.router.post("/",
            DocumentsMiddlewares.validateCreateDocument,
            this.createDocument.bind(this),
            historyLog
        );
        this.router.get("/", this.getAllDocuments.bind(this));
        this.router.get("/:id",
            DocumentsMiddlewares.validateDocumentId,
            this.getById.bind(this)
        );
        this.router.put("/:id",
            DocumentsMiddlewares.validateDocumentId,
            this.update.bind(this),
            historyLog
        );
        this.router.delete("/:id",
            DocumentsMiddlewares.validateDocumentId,
            this.deleteDocument.bind(this),
            historyLog
        );
        this.router.get("/:id/download",
            DocumentsMiddlewares.validateDocumentId,
            this.downloadPdf.bind(this)
        );
    }

    private async createDocument(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { path, title, content } = req.body;
            const document = await this.documentsService.createDocument(path, title, content, req.userId!);
            res.locals.document = document;
            res.locals.operationType = 'CREATE';

            res.status(201).json(document);
            next();
        } catch (error) {
            next(error);
        }
    }

    private async getAllDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const { pathPrefix, author, sortBy } = req.query;
            const documents = await this.documentsService.getAllDocuments(
                pathPrefix as string,
                author as string,
                sortBy as string
            );
            res.status(200).json(documents);
        } catch (error) {
            next(error);
        }
    }

    private async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const document = await this.documentsService.getDocumentById(id);
            if (!document) {
                const err: any = new Error("Document not found");
                err.status = 404;
                return next(err);
            }
            res.json(document);
        } catch (error) {
            next(error);
        }
    }

    private async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const updatedDoc = await this.documentsService.updateDocument(req.params.id, req.body, req.userId!);

            if (!updatedDoc) {
                const err: any = new Error("Document not found");
                err.status = 404;
                return next(err);
            }

            res.locals.document = updatedDoc;
            res.locals.operationType = 'UPDATE';

            res.status(200).json(updatedDoc);
            next();
        } catch (error) {
            next(error);
        }
    }

    private async deleteDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedDocument = await this.documentsService.deleteDocument(req.params.id);

            if (!deletedDocument) {
                const err: any = new Error("Document not found");
                err.status = 404;
                return next(err);
            }

            res.locals.document = deletedDocument;
            res.locals.operationType = 'DELETE';

            res.status(200).json(deletedDocument);
            next();
        } catch (error) {
            next(error);
        }
    }

    private async downloadPdf(req: Request, res: Response, next: NextFunction) {
        try {
            const pdfStream = await this.documentsService.generateDocumentPdf(req.params.id);
            res.setHeader('Content-Type', 'application/pdf');
            pdfStream.pipe(res);
        } catch (error) {
            next(error);
        }
    }
}