import { Request, Response, NextFunction } from 'express';
import HistoryService from '../history/history-service';

export default class HistoryMiddleware {

    static createHistoryLog(historyService: HistoryService) {
        return (req: Request, res: Response, next: NextFunction) => {
            res.on('finish', async () => {
                const doc = res.locals.document;
                const opType = res.locals.operationType;
                const userId = req.headers['x-user-id'] as string;
                if (res.statusCode >= 200 && res.statusCode < 300 && doc && opType) {
                    try {
                        await historyService.create({
                            user: userId,
                            documentId: doc.id,
                            documentPath: doc.path,
                            documentAuthor: doc.author,
                            timestamp: new Date(),
                            operationType: opType
                        });
                    }
                    catch (err) {
                        console.error("History logging failed:", err);
                    }
                }
            });
            next();
        };
    }
}

