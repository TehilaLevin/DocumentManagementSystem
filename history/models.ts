import { ObjectId } from "mongodb";

export enum OperationType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export interface OperationWithId extends Operation {
    _id?: ObjectId;
}

export interface Operation {
    user: string;
    documentId: string;
    documentPath: string;
    documentAuthor: string;
    timestamp: Date;
    operationType: OperationType;
}

