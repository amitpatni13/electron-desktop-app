import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IProductItemsFooterData, IProductItemsData } from '../Model/productItemsData.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ConstantMessages } from '../Constants/constant';
import { TransactionDataService } from './transactionDataService';

@Injectable()
export class PurchaseData {

    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, public TransactionData: TransactionDataService,  public logService: ErrorLogService) { }

    // Add Purchase Data to the database
    async addPurchase(Purchase: IProductItemsFooterData) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO PurchaseInvoices ("PurchaseInvoiceDate", "PurchaseInvoiceNumber", "PurchaseReceiptDate", "PartyID", "PartyName", "InvoiceAmount", "AmountPaid", "TotalAmount", "TotalTax", "TotalDue", "PaymentModeID", "PaymentRef", "PaymentRefImagePath", "IsActivate", "otherCosts", "reverseCharge", "BusinessID") VALUES (?,?, DATETIME("now", "localtime"), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "1", ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [Purchase.ReceiptDate, Purchase.invoiceNumber, Purchase.partyId, Purchase.partyName, Purchase.InvoiceAmount, Purchase.AmountPaid, Purchase.totalBillPrice, Purchase.totalTax, Purchase.totalBillPrice - Purchase.AmountPaid, Purchase.paidIn, Purchase.paymentRefNo, Purchase.PurchaseImg, Purchase.otherCosts, Purchase.ReverseCharge];
        return await this.dbProvider.executeSql(query, data).then((PurchaseInvoiceResponse) => {
            console.log(PurchaseInvoiceResponse);
            const TodaysDate = new Date().getTime();
            this.TransactionData.UpdateAnalyticsData(TodaysDate, ConstantMessages.TransactionDateAnalytics.PURCHASE, false);
            this.TransactionData.UpdateAnalyticsDataForDay(ConstantMessages.TransactionDateAnalyticsForDay.PURCHASE, 1);
            return PurchaseInvoiceResponse;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // Add Purchase Data to the PurchaseDraft Table for future transaction
    async addDraftPurchase(Purchase: IProductItemsFooterData) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO PurchaseDraftInvoices ("PurchaseInvoiceDate", "PurchaseInvoiceNumber", "PurchaseReceiptDate", "PartyID", "PartyName", "InvoiceAmount", "AmountPaid", "TotalAmount", "TotalTax", "TotalDue", "PaymentModeID", "PaymentRef", "PaymentRefImagePath", "IsActivate", "otherCosts", "reverseCharge", "isPurchaseQuotation", "PurchaseQuotationStatus", "BusinessID") VALUES ( ?, ?, DATETIME("now", "localtime"), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "1", ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [Purchase.ReceiptDate, Purchase.invoiceNumber, Purchase.partyId, Purchase.partyName, Purchase.InvoiceAmount, Purchase.AmountPaid, Purchase.totalBillPrice, Purchase.totalTax, Purchase.balance, Purchase.paidIn, Purchase.paymentRefNo, Purchase.PurchaseImg, Purchase.otherCosts, Purchase.ReverseCharge, Number(Purchase.isPurchaseQuotation), Purchase.PurchaseQuotationStatus];
        return await this.dbProvider.executeSql(query, data).then((PurchaseInvoiceResponse) => {
            console.log(PurchaseInvoiceResponse);
            return PurchaseInvoiceResponse;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // Insert the item list in the database
    async insertPurchaseInvoiceItemsDataToDB(item: IProductItemsData) {
        if (undefined !== item && null !== item) {
            if (item.TaxSlabData === 0) {
                item.TaxSlabData = null;
            }
            if (item.TaxSlabIGSTData === 0) {
                item.TaxSlabIGSTData = null;
            }
            if (item.TaxSlabCESSData === 0) {
                item.TaxSlabCESSData = null;
            }
            if (item.weightUnit === undefined) {
                item.weightUnit = '';
            }
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO PurchaseInvoiceItems ("PurchaseInvoiceNo", "Item_ID", "ItemName", "PurchasePrice", "Quantity", "TaxSlab1", "TaxSlab2", "TaxSlab3", "TaxSlab4", "TaxSlab1Amt", "TaxSlab2Amt", "TaxSlab3Amt", "TaxSlab4Amt", "HSNCode", "IsActivate", "Measurement", "BusinessID") VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'1\', ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
            // tslint:disable-next-line:max-line-length
            const data = [item.salesInvoiceID, item.id, item.name, item.discountedPrice, item.TotalQuantity, item.TaxSlabData, item.TaxSlabData, item.TaxSlabIGSTData, item.TaxSlabCESSData, item.TaxSlabCGST, item.TaxSlabSGST, item.TaxSlabIGST, item.TaxSlabCESS, item.HSN_SAC, item.weightUnit];
            return await this.dbProvider.executeSql(query, data).then((dataRow: any) => {
                console.log(dataRow);
                return dataRow;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }

    // Insert the item list in the Purchase Draft table
    async insertPurchaseDraftInvoiceItemsDataToDB(item: IProductItemsData) {
        if (undefined !== item && null !== item) {
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO PurchaseDraftInvoiceItems (\'PurchaseInvoiceNo\', \'Item_ID\', \'ItemName\', \'PurchasePrice\', \'Quantity\', \'TaxSlab1\', \'TaxSlab2\', \'TaxSlab3\', \'TaxSlab4\', \'TaxSlab1Amt\', \'TaxSlab2Amt\', \'TaxSlab3Amt\', \'TaxSlab4Amt\', \'HSNCode\', \'IsActivate\', \'Measurement\', \'BusinessID\') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'1\', ?, (SELECT BusinessID FROM Business WHERE IsActive = \'1\'))';
            // tslint:disable-next-line:max-line-length
            const data = [item.salesInvoiceID, item.id, item.name, item.discountedPrice, item.TotalQuantity, item.TaxSlabID1, item.TaxSlabID2, item.TaxSlabID3, item.TaxSlabID4, item.TaxSlabValue1, item.TaxSlabValue2, item.TaxSlabValue3, item.TaxSlabValue4, item.HSN_SAC, item.weightUnit];
            return await this.dbProvider.executeSql(query, data).then((dataRow) => {
                console.log(dataRow);
                return dataRow;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }

    // tslint:disable-next-line:max-line-length
    //  To store the Sales Invoice Number generated on Purchase page in PurchaseInvoice Table, this will be helpful in retrieving transactions...
    updatePurchaseInvoiceNumberInDB(invoiceId: number, invoiceNumber: string) {
        const query = 'UPDATE PurchaseInvoices SET PurchaseInvoiceNumber = ?, PurchaseUpdated = "1" WHERE PurchaseInvoiceID = ?';
        return this.dbProvider.executeSql(query, [invoiceNumber, invoiceId]).then((data) => {
            console.log('Update Sent to DB...'); console.log(data);
            return data;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // tslint:disable-next-line:max-line-length
    // To store the Sales Invoice Number generated on Purchase page in DraftPurchaseInvoice Table, this will be helpful in retrieving transactions...
    updateDraftPurchaseInvoiceNumberInDB(invoiceId: number, invoiceNumber: string) {
        const query = 'UPDATE PurchaseDraftInvoices SET PurchaseInvoiceNumber = ? WHERE PurchaseInvoiceID = ?';
        return this.dbProvider.executeSql(query, [invoiceNumber, invoiceId]).then((data) => {
            console.log('Update Sent to DB...'); console.log(data);
            return data;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // Update the PurchasePrice and currentstock
    async updateProductDataPrice(product: IProductItemsData) {
        const query = 'UPDATE Item SET PurchasePrice = ?, CurrentStock = ?, itemUpdated = "1" WHERE Item_ID = ?';
        const data = [product.purchasePrice, product.currentStock, product.id];
        return await this.dbProvider.executeSql(query, data).then((res: any) => {
            return res;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // Update only Current Stock of the items purchased in the Item table in DB
    async updateOnlyCurrentStockProductData(product: IProductItemsData) {
        const query = 'UPDATE Item SET CurrentStock = ?, itemUpdated = "1" WHERE Item_ID = ?';
        const data = [product.currentStock, product.id];
        return await this.dbProvider.executeSql(query, data).then(dataRow => {
            return dataRow;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }
}
