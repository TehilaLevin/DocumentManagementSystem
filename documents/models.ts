import { ObjectId } from "mongodb";

export interface DocumentWithId extends DocumentModel {
    _id?: ObjectId;
}

export interface DocumentModel {
    id: string;
    author: string;
    path: string;
    title: string;
    content: string;
    createdAt: Date;
    lastUpdatedAt: string;
    lastUpdatedBy: string;
}

export interface DocumentDetails {
    id: string;
    author: string;
    path: string;
    title: string;
}


