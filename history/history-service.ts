import HistoryDal from "./history-dal";
import { Operation } from "./models";

export default class HistoryService {
    constructor(private historyDal: HistoryDal) { }

    async create(operation: Operation): Promise<void> {
        return await this.historyDal.create(operation);
    }

    async listOperations(userId: string, queryParams: any): Promise<Array<Operation>> {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (queryParams.pathPrefix) {
            filter.documentPath = { $regex: `^${queryParams.pathPrefix}` };
        }

        const supportedFields = ['user', 'documentId', 'documentAuthor', 'operationType'];
        supportedFields.forEach(field => {
            if (queryParams[field]) {
                filter[field] = queryParams[field];
            }
        });

        return await this.historyDal.listOperations(userId, filter, skip, limit);
    }

    async clearHistory(): Promise<void> {
        return await this.historyDal.clearHistory();
    }

    async getAllHistory() {
        return await this.historyDal.getAll();
    }
}




