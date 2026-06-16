import { Collection } from "mongodb";
import { Operation, OperationWithId } from "./models";
import DbConnect from "../utils/db-conn";

const HISTORY_COLLECTION_NAME = 'history';

export default class HistoryDal {
    [x: string]: any;
    private historyCollection!: Collection<Operation>;

    constructor(private dbConn: DbConnect) {
    }

    async init() {
        const db = this.dbConn.getStoreDb('store'); 
        this.historyCollection = db.collection<Operation>(HISTORY_COLLECTION_NAME);
    }

    async create(operation: Operation) {
        await this.historyCollection.insertOne(operation);
    }

    async listOperations(userId: string, filter: any, skip: number, limit: number): Promise<Array<Operation>> {
        const Filter = { ...filter, author: userId };
        const operations: Array<OperationWithId> =
            await this.historyCollection
                .find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();

        operations.forEach(o => {
            if (o._id) delete (o as any)._id;
        });
        return operations;
    }

    async clearHistory() {
        await this.historyCollection.deleteMany({});
    }

    async getAll() {
        const operations = await this.historyCollection.find().sort({ timestamp: -1 }).toArray();
        operations.forEach(o => {
            if (o._id) delete (o as any)._id;
        });
        return operations;
    }
}