import { Collection } from "mongodb";
import { DocumentDetails, DocumentModel } from "./models";
import DbConnect from "../utils/db-conn";

const COLLECTION_NAME = 'documents';
const DOCUMENT_NOT_FOUND_ERROR = 'Document not found';

export default class DocumentsDal {
    private collection!: Collection<DocumentModel>;

    constructor(private dbConn: DbConnect) { }

    async init() {
        const db = this.dbConn.getStoreDb('documents');
        return this.collection = db.collection<DocumentModel>(COLLECTION_NAME);
    }

    async createDocument(document: DocumentModel): Promise<DocumentDetails> {
        await this.collection.insertOne(document);
        return {
            id: document.id,
            title: document.title,
            path: document.path, 
            author: document.author
        };
    }

    async getAllDocuments(pathPrefix?: string, sortBy?: string, author?: string): Promise<Array<DocumentDetails>> {
        const filter: any = {};
        if (pathPrefix) {
            filter.path = { $regex: `^${pathPrefix}` };
        }
        if (author) {
            filter.author = author;
        }

        let sortOptions: any = {};
        if (sortBy) {
            const isDescending = sortBy.startsWith('-');
            const fieldName = isDescending ? sortBy.substring(1) : sortBy;
            sortOptions[fieldName] = isDescending ? -1 : 1;
        } else {
            sortOptions = { createdAt: 1 };
        }

        const documents = await this.collection
            .find(filter)
            .sort(sortOptions)
            .project({ content: 0, _id: 0 })
            .toArray();

        return documents as unknown as DocumentDetails[];
    }
    
    async getDocumentById(id: string): Promise<DocumentModel> {
        const document = await this.collection.findOne({ id }, { projection: { _id: 0 } });
        if (!document) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        return document;
    }

    async updateDocument(id: string, updateData: Partial<DocumentModel>): Promise<DocumentDetails> {
        const res = await this.collection.updateOne({ id }, { $set: updateData });
        if (!res.modifiedCount) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        const updatedDoc = await this.collection.findOne({ id }, { projection: { content: 0, _id: 0 } });
        return updatedDoc as DocumentDetails;
    }
    
    async deleteDocument(id: string): Promise<DocumentDetails> {
        const document = await this.collection.findOne({ id }, { projection: { content: 0, _id: 0 } });
        if (!document) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        await this.collection.deleteOne({ id });
        return document as DocumentDetails;
    }
}
