import express, { Express } from "express";
import DbConnect from "./utils/db-conn";
import UserMiddleware from "./utils/user-middleware";
import { globalErrorHandler } from "./utils/error-middleware";
import 'dotenv/config';

const HOST = "127.0.0.1";
const PORT = 5000;

// Documents
import DocumentsDal from "./documents/document-dal";
import DocumentsService from "./documents/document-service";
import DocumentsApi from "./documents/document-api";

// History
import HistoryDal from "./history/history-dal";
import HistoryService from "./history/history-service";
import HistoryApi from "./history/history-api";

export default class App {
    [x: string]: any;
    private app: Express;
    private dbConn: DbConnect;

    constructor() {
        this.app = express();
        this.dbConn = new DbConnect();
    }

    async init() {
        await this.dbConn.init();
        const documentsDal = new DocumentsDal(this.dbConn);
        await documentsDal.init();
        const historyDal = new HistoryDal(this.dbConn);
        await historyDal.init();
        const documentsService = new DocumentsService(documentsDal);
        const historyService = new HistoryService(historyDal);
        const documentsApi = new DocumentsApi(documentsService, historyService);
        const historyApi = new HistoryApi(historyService);
        this.setRoutes(documentsApi, historyApi);

        this.app.listen(PORT, HOST, () => {
            console.log(`Listening on: http://${HOST}:${PORT}`);
        });
    }

    private setRoutes(documentsApi: DocumentsApi, historyApi: HistoryApi) {
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');
            next();
        });
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/api-test-page.html');
        });
        this.app.use(UserMiddleware.validateUserId);
        this.app.use("/api/documents", documentsApi.router);
        this.app.use("/api/history", historyApi.router);
        this.app.use(globalErrorHandler);
    }
}