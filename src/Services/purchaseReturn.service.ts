import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { SaleReturnService } from './saleReturn.service';
import { ConstantMessages } from '../Constants/constant';
import { IPurchaseTxnDetail, IPurchaseItemData } from '../Model/purchase.model';

@Injectable()
export class PurchaseReturnService {
    previousBillData: IPurchaseTxnDetail = null;
    previousBillItemsData: IPurchaseItemData[] = [];

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService, private saleReturnService: SaleReturnService) { }

    // To begin the purchase return process once the purchase return is recorded in DB
    returnPurchase(InvoiceId: number, PartyID: number, callback) {
        const query = 'UPDATE PurchaseInvoices SET IsPurchaseReturn = \'1\', PurchaseUpdated = \'1\' WHERE PurchaseInvoiceID = ?';
        this.dbProvider.executeSql(query, [InvoiceId]).then((onSuccess) => {
            this.getPurchaseData(InvoiceId, (data: { partyId: number, purchaseReturnAmount: number }) => {
                if (data) { // If sale data received is not null
                    this.adjustInventory(InvoiceId, (response) => { // To adjust the inventory once the sale return is updated in DB
                        if ('finished' === response) { // If sale return data received is not null
                                    callback('finished'); return;
                        } else { callback(null); return; }
                    });
                } else { callback(null); return; }
            });
        }, (onError) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ' ;SRC - Service Class:PurchaseReturnService method:returnPurchase', onError);
            callback(null);
            return;
        });
    }

    // To deactivate the sale items for the returned sale
    adjustInventory(PurchaseInvoiceId: number, callback) {
        this.getPurchaseItemsInfo(PurchaseInvoiceId, (items: Array<{ id: number, quantity: number }>) => {
            if (items) { // If items received is not null
                // In case of items removed on Edited Purchase Return, adjusting their item stock in DB
                for (const prevItem of this.previousBillItemsData) { // If Sale Return is opened in Edit mode
                    // tslint:disable-next-line:max-line-length
                    if (!this.saleReturnService.isItemInList(prevItem.id, items)) { // True, if item was removed from current Sale Return Invoice but was present in previous invoice, false otherwise
                        this.saleReturnService.getItemData(prevItem.id, (itemData: Array<{ stock: number }>) => {
                            if (itemData) { // If itemData received is not null
                                const CurrentStock = itemData[0].stock + prevItem.TotalQuantity; // Getting the reduced item stock value
                                // tslint:disable-next-line:max-line-length
                                this.saleReturnService.updateItemStock(prevItem.id, CurrentStock, (result) => { console.log('Item Stock Updated: ', result); }); // Updating the item stock in DB
                            }
                        });
                    }
                }
                for (const item of items) {
                    this.saleReturnService.getItemData(item.id, (itemData: Array<{ stock: number }>) => {
                        if (itemData) { // If itemData received is not null
                            let CurrentStock = itemData[0].stock - item.quantity; // Getting the updated item stock value
                            for (const prevItem of this.previousBillItemsData) { // If Sale Return is opened in Edit mode
                                if (item.id === prevItem.id) { // And the previous item matches the current item
                                    // tslint:disable-next-line:max-line-length
                                    CurrentStock += prevItem.TotalQuantity; // Adjusting the item stock with effective quantity added to items current stock
                                    break;
                                }
                            }
                            this.saleReturnService.updateItemStock(item.id, CurrentStock, (result) => {  // Updating the item stock in DB
                                console.log(result);
                                if (items.indexOf(item) === (items.length - 1)) { callback('finished'); }
                            });
                        } else {
                            if (items.indexOf(item) === (items.length - 1)) {
                                callback('finished');
                            }
                        }
                    });
                }
            } else { callback('finished'); }
        });
    }

    // To get the sale id and party id for the Invoice Number provided
    getPurchaseData(InvoiceId: number, callback) {
        const query = 'SELECT PartyID, TotalAmount FROM PurchaseInvoices WHERE PurchaseInvoiceID = ? AND IsActivate=\'1\'';
        this.dbProvider.executeSql(query, [InvoiceId]).then((data: any) => {
            let saleData: { partyId: number, purchaseReturnAmount: number } = null;
            if (data.length) {
                const BillAmount = data[0].TotalAmount;
                saleData = {
                    partyId: data[0].PartyID,
                    purchaseReturnAmount: Number(Number(BillAmount).toFixed(2))
                };
            }
            if (saleData) { callback(saleData); } else { callback(null); }
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ' ;SRC - Service Class:PurchaseReturnService method:getPurchaseData', err);
            callback(null);
        });
    }


    // To get the item id and quantity for the Purchase Return Invoice
    getPurchaseItemsInfo(InvoiceId: number, callback) {
        const query = 'SELECT Item_ID, Quantity FROM PurchaseInvoiceItems WHERE PurchaseInvoiceNo = ? AND IsActivate=\'1\'';
        this.dbProvider.executeSql(query, [InvoiceId]).then((data: any) => {
            const itemsData: Array<{ id: number, quantity: number }> = [];
            if (data.length) {
                for (const value of data) {
                    itemsData.push({
                        id: value.Item_ID,
                        quantity: value.Quantity
                    });
                }
            }
            if (itemsData.length) { callback(itemsData); } else { callback(null); }
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ' ;SRC - Service Class:PurchaseReturnService method:getPurchaseItemsInfo', err);
            callback(null);
        });
    }

    // To return the party id and credit amount for the petty cash party
    getPettyCashPartyData(callback) {
        this.saleReturnService.getPettyCashPartyData((partyId, CreditAmount) => {
            callback(partyId, CreditAmount);
        });
    }

    // Getting all the Purchase Invoice Numbers by passing the previous purchase invoice id
    async getAllInvoices(PartyID: number) {
        // tslint:disable-next-line:max-line-length
        let query = 'SELECT PurchaseInvoiceID, PurchaseInvoiceNumber, PurchaseInvoiceDate, InvoiceAmount, PartyName FROM PurchaseInvoices WHERE IsActivate=\'1\' AND IsPurchaseReturn=\'0\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')';
        const row = [];
        if (null !== PartyID && undefined !== PartyID) { // If Party Id exists
            query += ' AND PartyID = ?';
            row.push(PartyID);
        }
        return await this.dbProvider.executeSql(query, row).then((data: any) => {
            // tslint:disable-next-line:max-line-length
            const salesInvoiceResponse: Array<{ InvoiceId: number, InvoiceNumber: string, InvoiceDate: string, InvoiceAmount: number, PartyName: string }> = [];
            if (data.length > 0) {
                for (const dataRow of data) {
                    salesInvoiceResponse.push({
                        InvoiceId: dataRow.PurchaseInvoiceID,
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        InvoiceDate: dataRow.PurchaseInvoiceDate,
                        InvoiceAmount:  dataRow.InvoiceAmount,
                        PartyName: dataRow.PartyName
                    });
                }
            }
            return salesInvoiceResponse;
        },
            (err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_INVOICE_CONFIG_DATA_FAILED, ';SRC - Service Class:PurchaseReturnService method:getAllInvoices', err);
                return err;
            }
        );
    }

    // Getting all the Purchase Return Invoice Numbers by passing the previous purchase invoice id
    async getAllPurchaseReturnNumbers() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT PurchaseInvoiceID, PurchaseInvoiceNumber, PurchaseInvoiceDate FROM PurchaseInvoices WHERE IsPurchaseReturn=\'1\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const purchaseInvoiceResponse: Array<{ InvoiceId: number, InvoiceNumber: string, InvoiceDate: string }> = [];
            if (data.length > 0) {
                for (const dataRow of data) {
                purchaseInvoiceResponse.push({
                    InvoiceId: dataRow.PurchaseInvoiceID,
                    InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                    InvoiceDate: dataRow.PurchaseInvoiceDate
                });
                }
            }
            return purchaseInvoiceResponse;
        },
            (err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_INVOICE_CONFIG_DATA_FAILED, ';SRC - Service Class:PurchaseReturnService method:getAllPurchaseReturnNumbers', err);
                return [];
            }
        );
    }

    // To get the item categories show/hide value from DB
    showItemCategories(callback) {
        this.saleReturnService.showItemCategories((result) => {
            if (result) { callback(result); } else { callback({ value: 0 }); }
        });
    }

    // To get the Purchase Return Number for Return Purchase as per the previous Purchase Return Data
    getPurchaseReturnNumber(callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS PurchaseReturnTotal FROM PurchaseInvoices WHERE IsPurchaseReturn = \'1\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')';
        this.dbProvider.executeSql(query, []).then((data: any) => {
            let purchaseReturnTotal: number;
            if (data.length > 0) {
                purchaseReturnTotal = data[0].PurchaseReturnTotal;
            }
            purchaseReturnTotal += 1;
            // tslint:disable-next-line:max-line-length
            const purchaseReturnNumber = this.saleReturnService.generateSalesReturnNumber(purchaseReturnTotal, ConstantMessages.PurchaseReturnConfig.InvoicePrefix, ConstantMessages.PurchaseReturnConfig.InvoiceNumberLength);
            callback(purchaseReturnNumber);
        },
            (err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_INVOICE_CONFIG_DATA_FAILED, ';SRC - Service Class:PurchaseReturnService method:getPurchaseReturnNumber', err);
                callback(null);
            }
        );
    }

    // To deactivate the Purchase items for the returned Purchase
    returnPurchaseItems(PurchaseInvoiceId: number, callback) {
        const query = 'UPDATE PurchaseInvoicesItems SET IsActivate=\'0\', PurchaseUpdated = \'1\' WHERE PurchaseInvoiceNo = ?';
        this.dbProvider.executeSql(query, [PurchaseInvoiceId]).then((response) => {
            this.getPurchaseItemsInfo(PurchaseInvoiceId, (items: Array<{ id: number, quantity: number }>) => {
                if (items) { // If items received is not null
                    for (const item of items) {
                        this.saleReturnService.getItemData(item.id, (itemData: Array<{ stock: number }>) => {
                            if (itemData) { // If itemData received is not null
                                const CurrentStock = itemData[0].stock - item.quantity; // Getting the updated item stock value
                                // tslint:disable-next-line:max-line-length
                                this.saleReturnService.updateItemStock(item.id, CurrentStock, (result) => { console.log(result); }); // Updating the item stock in DB
                            }
                        });
                        if (items.indexOf(item) === items.length - 1) { callback('finished'); }
                    }
                } else { callback('finished'); }
            });
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ' ;SRC - Service Class:PurchaseReturnService method:returnPurchaseItems', err);
            callback(null);
        });
    }
}
