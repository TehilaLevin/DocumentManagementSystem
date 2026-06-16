import { MongoClient, Db } from "mongodb";

const DB_URL = 'mongodb+srv://db:db@cluster0.px9p7tx.mongodb.net/';

export default class DbConnect {
    [x: string]: any;
    private mongoClient!: MongoClient;
    constructor(private url = DB_URL) { }
    public async init() {
        this.mongoClient = await MongoClient.connect(this.url);
    }

    public getStoreDb(dbName: string = 'store'): Db {
        return this.mongoClient.db(dbName);
    }

    public async terminate() {
        await this.mongoClient.close();
    }
}