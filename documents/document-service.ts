import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import DocumentsDal from './document-dal';
import { DocumentDetails, DocumentModel } from './models';

export default class DocumentsService {
    constructor(private documentsDal: DocumentsDal) { }

    async createDocument(path: string, title: string, content: string, author: string): Promise<DocumentDetails> {
        const document: DocumentModel = {
            id: this.generateId(),
            author,
            path,
            title,
            content,
            createdAt: new Date(),
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: author
        };
        return await this.documentsDal.createDocument(document);
    }

    async getAllDocuments(pathPrefix?: string, sortBy?: string, author?: string): Promise<Array<DocumentDetails>> {
        return this.documentsDal.getAllDocuments(pathPrefix, sortBy, author);
    }

    async getDocumentById(id: string): Promise<DocumentModel | null> {
        try {
            return await this.documentsDal.getDocumentById(id);
        } catch (err: any) {
            if (err.message === 'Document not found') {
                return null;
            }
            throw err;
        }
    }

    async updateDocument(id: string, updateData: Partial<DocumentModel>, userId: string): Promise<DocumentDetails | null> {
        try {
            const data = {
                ...updateData,
                lastUpdatedAt: new Date().toISOString(),
                lastUpdatedBy: userId
            };
            return await this.documentsDal.updateDocument(id, data);
        } catch (err: any) {
            if (err.message === 'Document not found') {
                return null;
            }
            throw err;
        }
    }

    async deleteDocument(id: string): Promise<DocumentDetails | null> {
        try {
            return await this.documentsDal.deleteDocument(id);
        } catch (err: any) {
            if (err.message === 'Document not found') {
                return null;
            }
            throw err;
        }
    }

    async generateDocumentPdf(id: string): Promise<NodeJS.ReadableStream> {
        const document = await this.documentsDal.getDocumentById(id);
        
        const pdf = new PDFDocument();
        const stream = new PassThrough();
        pdf.pipe(stream);

        pdf.fontSize(24).text(document.title, { align: 'center' });
        pdf.moveDown();
        pdf.fontSize(14).text(document.content);

        pdf.end();
        return stream;
    }

    private generateId(): string {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
}