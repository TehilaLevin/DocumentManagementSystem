import { Request, Response, Router, NextFunction } from "express";
import HistoryService from "./history-service";

export default class HistoryApi {
    public router: Router;

    constructor(private historyService: HistoryService) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get("/", this.getAllHistory.bind(this));
                this.router.delete("/", this.clearHistory.bind(this));
    }

    private async getAllHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.headers['x-user-id'] as string;
            const history = await this.historyService.listOperations(userId, req.query);
            res.status(200).json(history);
        } catch (error) {
            next(error);
        }
    }

    private async clearHistory(req: Request, res: Response, next: NextFunction) {
        try {
            await this.historyService.clearHistory();
            res.status(204).send(); 
        } catch (error) {
            next(error); 
        }
    }
}
