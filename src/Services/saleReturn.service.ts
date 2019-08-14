import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { AppSettings } from './appSetting.service';
import { IProductItemsFooterData, IProductItemsData } from '../Model/productItemsData.model';
import { ConstantMessages } from '../Constants/constant';

@Injectable()
export class SaleReturnService {
    previousBillData: IProductItemsFooterData = null;
    previousBillItemsData: IProductItemsData[] = [];
    AddCreditPoints = false;
    creditPointsAddedInPreviousBill = false;

    constructor(private dbProvider: DatabaseProvider, private appSetting: AppSettings, public logService: ErrorLogService) { }

    // To deactivate the sale if the user returns the sale
    returnSale(InvoiceId: number, PartyID: number, callback) {
        const query = 'UPDATE SalesInvoices SET IsSaleReturn = "1", SaleUpdated = "1" WHERE SalesInvoiceID = ?';
        this.dbProvider.executeSql(query, [InvoiceId]).then((onSuccess) => {
            this.getSaleData(InvoiceId, (data: { partyId: number, saleReturnAmount: number }) => {
                if (data) { // If sale data received is not null
                    this.adjustInventory(InvoiceId, (response) => { // To adjust the inventory once the sale return is updated in DB
                        if ('finished' === response) { // If sale return data received is not null
                            if (this.AddCreditPoints) { // If credit note is selected as payment mode then adding credit points
                                // tslint:disable-next-line:max-line-length
                                this.setPartyCreditAmount(PartyID, data.saleReturnAmount, (result) => { // To adjust the party credit points once the sale return is updated in DB
                                    if ('finished' === result) { // If sale return data received is not null
                                        callback('finished'); return;
                                    } else { callback(null); return; }
                                });
                            // tslint:disable-next-line:max-line-length
                            } else { callback('finished'); return; } // If credit note is not selected as payment mode then returning the result
                        } else { callback(null); return; }
                    });
                } else { callback(null); return; }
            });
        }, (onError) => {
            console.log('Error', onError);
            callback(null);
            return;
        });
    }

    // To deactivate the sale items for the returned sale
    adjustInventory(SalesInvoiceId: number, callback) {
        this.getSaleItemsInfo(SalesInvoiceId, (items: Array<{ id: number, quantity: number }>) => {
            if (items) { // If items received is not null
                // In case of items removed on Edited Sale Return, adjusting their item stock in DB
                for (const prevItem of this.previousBillItemsData) { // If Sale Return is opened in Edit mode
                    // tslint:disable-next-line:max-line-length
                    if (!this.isItemInList(prevItem.id, items)) { // True, if item was removed from current Sale Return Invoice but was present in previous invoice, false otherwise
                        this.getItemData(prevItem.id, (itemData: Array<{ stock: number }>) => {
                            if (itemData) { // If itemData received is not null
                                let CurrentStock = Number(itemData[0].stock); // Getting the reduced item stock value
                                // tslint:disable-next-line:max-line-length
                                if (prevItem.TotalQuantity) { CurrentStock -= prevItem.TotalQuantity; }    else { CurrentStock -= prevItem.count; } // Adjusting the item stock with effective quantity reduced from items current stock
                              // tslint:disable-next-line:max-line-length
                                this.updateItemStock(prevItem.id, CurrentStock, (result) => { console.log(result); }); // Updating the item stock in DB
                            }
                        });
                    }
                }
                for (const item of items) {
                    this.getItemData(item.id, (itemData: Array<{ stock: number }>) => {
                        if (itemData) { // If itemData received is not null
                            let CurrentStock = itemData[0].stock + item.quantity; // Getting the updated item stock value
                            for (const prevItem of this.previousBillItemsData) { // If Sale Return is opened in Edit mode
                                if (item.id === prevItem.id) { // And the previous item matches the current item
                                    // tslint:disable-next-line:max-line-length
                                    if (prevItem.TotalQuantity) { CurrentStock -= prevItem.TotalQuantity; }  else { CurrentStock -= prevItem.count; } // Adjusting the item stock with effective quantity reduced from items current stock
                                }
                            }
                            this.updateItemStock(item.id, CurrentStock, (result) => {
                                console.log(result);
                                if (items.indexOf(item) === (items.length - 1)) {
                                    callback('finished');
                                }
                            }); // Updating the item stock in DB
                        } else {
                            if (items.indexOf(item) === (items.length - 1)) {
                                callback('finished');
                            }
                        }
                    });
                }
            } else {
                callback('finished');
            }
        });
    }

    // To update the Credit Points for the party and return the callback once finished
    setPartyCreditAmount(PartyID: number, saleReturnAmount: number, callback) {
        let previousCreditAmount = 0; // In case of Edit sale return
        // tslint:disable-next-line:max-line-length
        if (this.previousBillData && this.creditPointsAddedInPreviousBill) { // If previous bill data is not null, i.e., Sale Return Edit Reference
            if (PartyID === this.previousBillData.partyId) { // If Party is not changed
                // tslint:disable-next-line:max-line-length
                previousCreditAmount = this.previousBillData.totalPayable; // Calculating previous credit amount to reduce/add effective credit amount for Edited Sale Return Invoice
            } else { // If Party is changed
                this.getPartyCreditAmount(this.previousBillData.partyId, (CreditAmount: { value: number }) => {
                    if (null !== CreditAmount) { // If Credit Amount received is not null
                        // tslint:disable-next-line:max-line-length
                        const updatedCreditAmount = Number(CreditAmount.value) - this.previousBillData.totalPayable; // Reducing the Credit Amount since this party is no longer associated with Sale Return Invoice
                        // tslint:disable-next-line:max-line-length
                        this.updatePartyCreditAmount(this.previousBillData.partyId, updatedCreditAmount, (success) => { // Final response, after Credit Amount is updated for Party
                            console.log('Previous party credit amount updated after party removed from Sales Return');
                        });
                    }
                });
            }
        }
        this.getPartyCreditAmount(PartyID, (CreditAmount: { value: number }) => {
            if (null !== CreditAmount) { // If Credit Amount received is not null
                const updatedCreditAmount = Number(CreditAmount.value) + saleReturnAmount - previousCreditAmount;
                this.updatePartyCreditAmount(PartyID, updatedCreditAmount, (success) => {
                    if (success) { callback('finished'); } else { callback(null); }
                    return;
                });
            } else { callback(null); return; }
        });
    }

    // To get the party id and Sale Return Invoice Amount for the Sale Return Invoice Id provided
    getSaleData(InvoiceId: number, callback) {
        const query = 'SELECT PartyID, TotalPayable FROM SalesInvoices WHERE SalesInvoiceID = ?';
        this.dbProvider.executeSql(query, [InvoiceId]).then((data: any) => {
            let saleData: { partyId: number, saleReturnAmount: number } = null;
            if ( data && data.length) {
                const BillAmount = data[0].TotalPayable;
                saleData = {
                    partyId: data[0].PartyID,
                    saleReturnAmount: Number(BillAmount)
                };
            }
            if (saleData) {
             callback(saleData);
            } else { callback(null); }
        }, err => {
            console.log('Error', err);
            callback(null);
        });
    }


    // To get the sale id and quantity for the Sales Invoice returned
    getSaleItemsInfo(InvoiceId: number, callback) {
        const query = 'SELECT Item_ID, Quantity FROM SalesInvoiceItems WHERE SalesInvoiceNo = ? AND IsActivate="1"';
        this.dbProvider.executeSql(query, [InvoiceId]).then((data: any) => {
            const itemsData: Array<{ id: number, quantity: number }> = [];
            if (data && data.length) {
                for (const dataRow of data) {
                    itemsData.push({
                        id: dataRow.Item_ID,
                        quantity: dataRow.Quantity
                    });
                }
            }
            if (itemsData.length) { callback(itemsData); } else { callback(null); }
        }, err => {
            // tslint:disable-next-line:max-line-length
            console.log('Error', err);
            callback(null);
        });
    }

    // To get the current stock value by item id if item stock is maintained
    getItemData(id: number, callback) {
        const query = 'SELECT CurrentStock FROM Item WHERE Item_ID = ? AND IsMaintainStock = "1" AND IsActivate="1"';
        this.dbProvider.executeSql(query, [id]).then((data: any) => {
            const itemsData: Array<{ stock: number }> = [];
            if (data && data.length) {
                for (const dataRow of data) {
                    itemsData.push({ stock: dataRow.CurrentStock });
                }
            }
            if (itemsData.length) { callback(itemsData); } else { callback(null); }
        }, err => {
            console.log('Error', err);
            callback(null);
        });
    }

    // To increment the items stock for the returned items for the returned sale
    updateItemStock(id: number, CurrentStock: number, callback) {
        const query = 'UPDATE Item SET CurrentStock = ?, itemUpdated = "1" WHERE Item_ID = ?';
        this.dbProvider.executeSql(query, [CurrentStock, id]).then((data) => {
            if (data) { callback(data); } else { callback(null); }
        }, err => {
            console.log('Error', err);
            callback(null);
        });
    }

    // To update the party balance associated with the returned sale as per sale bill amount
    updatePartyCreditAmount(PartyId: number, CreditAmount: number, callback) {
        const query = 'UPDATE Party SET CreditPoints = ?, partyUpdated = "1" WHERE PartyID = ?';
        this.dbProvider.executeSql(query, [CreditAmount, PartyId]).then((data) => {
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        }, err => {
            console.log('Error', err);
            callback(null);
        });
    }

    // To update the party credit amount associated with the returned sale as per sale bill amount
    getPartyCreditAmount(PartyId: number, callback) {
        const query = 'SELECT CreditPoints FROM Party WHERE PartyID = ?';
        this.dbProvider.executeSql(query, [PartyId]).then((data: any) => {
            let partyData: { value: number };
            if ( data && data.length) { partyData = { value: data[0].CreditPoints }; }
            if (partyData) { callback(partyData); } else { callback(null); }
        }, err => {
            console.log('Error', err);
            callback(null);
        });
    }

    // To return the party id and balance for the name provided
    getPettyCashPartyData(callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT PartyID, CreditPoints FROM Party WHERE ContactNumber = ? AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") LIMIT 1';
        this.dbProvider.executeSql(query, ['-1']).then((data: any) => {
            let partyId: number = null;
            let   creditAmount = 0;
            if (data && data.length) {
                partyId = data[0].PartyID;
                creditAmount = data[0].CreditPoints;
            }
            callback(partyId, creditAmount);
        }, err => {
            console.log('Error', err);
            callback(null, null);
        });
    }

    // Getting all the Invoice Numbers for Sale Invoices from DB
    async getAllInvoices(PartyID: number) {
        // tslint:disable-next-line:max-line-length
        let query = 'SELECT SalesInvoiceID, InvoiceNumber, InvoiceDate, TotalPayable, PartyName FROM SalesInvoices WHERE IsActivate="1" AND IsSaleReturn="0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        const row = [];
        if (null !== PartyID && undefined !== PartyID) { // If Party Id exists
            query += ' AND PartyID = ?';
            row.push(PartyID);
        }
        return await this.dbProvider.executeSql(query, row).then((data: any) => {
            // tslint:disable-next-line:max-line-length
            const salesInvoiceResponse: Array<{ InvoiceId: number, InvoiceNumber: string, InvoiceDate: string, InvoiceAmount: number, PartyName: string }> = [];
            if (data.rows.length > 0) {
                for (let index = 0; index < data.rows.length; index++) {
                    salesInvoiceResponse.push({
                        InvoiceId: data[index].SalesInvoiceID,
                        InvoiceNumber: data[index].InvoiceNumber,
                        InvoiceDate: data[index].InvoiceDate,
                        InvoiceAmount:  data[index].TotalPayable,
                        PartyName: data[index].PartyName
                    });
                }
            }
            return salesInvoiceResponse;
        },
            (err) => {
                console.log('Error', err);
                return [];
            }
        );
    }

    // Getting all the Return Numbers for Sale Return Invoices from DB
    async getAllSaleReturnNumbers() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT InvoiceNumber FROM SalesInvoices WHERE IsSaleReturn="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const salesInvoiceResponse: string[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    salesInvoiceResponse.push(dataRow.InvoiceNumber);
                }
                return salesInvoiceResponse;
            }
        });
    }

    // To get the app setting value for show/hide the item categories in inventory flow
    showItemCategories(callback) {
        this.appSetting.getAppSettingData('ShowItemCategories').then((result) => {
            if (result) { callback(result); } else { callback({ value: 0 }); }
        });
    }

    // To get the Sales Return Number for Return Sale as per the previous Sales Return Data
    getSalesReturnNumber(callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS SalesReturnTotal FROM SalesInvoices WHERE IsSaleReturn = "1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        this.dbProvider.executeSql(query, []).then((data: any) => {
            let salesReturnTotal: number;
            if (data && data.length > 0) {
                salesReturnTotal = data[0].SalesReturnTotal;
            }
            salesReturnTotal += 1;
            // tslint:disable-next-line:max-line-length
            const salesReturnNumber = this.generateSalesReturnNumber(salesReturnTotal, ConstantMessages.SaleReturnConfig.InvoicePrefix, ConstantMessages.SaleReturnConfig.InvoiceNumberLength);
            callback(salesReturnNumber);
        },
            (err) => {
                console.log('Error', err);
                callback(null);
            }
        );
    }

    // tslint:disable-next-line:max-line-length
    // Method to generate the sales return invoice no., accepts id as Sales Invoice Id, name as the LHS of Invoice No and, length as length of the RHS ID in terms of no. of Digits required...
    generateSalesReturnNumber(id: number, name: string, length: number) {
        let invoiceNo = '';
        const invoiceId = '' + id;
        let padding = '';
        name = name + '-';
        for (let i = 0; i < length; i++) { padding += '0'; }
        invoiceNo += padding.substring(0, padding.length - invoiceId.length) + invoiceId;
        return (name + invoiceNo);
    }

    // To return true if the item id is in array and false if not
    isItemInList(id: number, items: Array<{ id: number, quantity: number }>) {
        for (const item of items) { // Looping over list
            if (id === item.id) { // If Item id matches in list
                return true;
            }
        } // Item found in lists
        return false; // Item not in list
    }

    // To adjust the credit amount for Deleting the Sale Return Invoice
    updateCreditAmountOnInvoiceDeleted(InvoiceId: number, callback) {
        // tslint:disable-next-line:max-line-length
        this.getSaleData(InvoiceId, (InvoiceData: { partyId: number, saleReturnAmount: number }) => { // Getting the Party Id and Invoice Amount for Deleted Invoice
            if (InvoiceData) {
                // tslint:disable-next-line:max-line-length
                this.getPartyCreditAmount(InvoiceData.partyId, (PartyCreditAmount: { value: number }) => { // Getting the current Party Credits Available
                    if (PartyCreditAmount) {
                        const EffectiveCreditAmount = Number(PartyCreditAmount.value) - Number(InvoiceData.saleReturnAmount);
                        // tslint:disable-next-line:max-line-length
                        // if (0 < Number(PartyCreditAmount)) EffectiveCreditAmount = Number(PartyCreditAmount) - Number(InvoiceData.saleReturnAmount); // (+a) - (+b) or a - b
                        // tslint:disable-next-line:max-line-length
                        // else EffectiveCreditAmount = Number(PartyCreditAmount) - Number(InvoiceData.saleReturnAmount); // (-a) - (+b) OR -(a + b)
                        // tslint:disable-next-line:max-line-length
                        this.updatePartyCreditAmount(InvoiceData.partyId, EffectiveCreditAmount, (result) => { // Updating the Party Credits Available after calculating Effective Credit Amount
                            if (result) { callback('success'); } else { callback(null); }
                        });
                    } else { callback(null); }
                });
            } else { callback(null); }
        });
    }

    // To adjust the credit amount for Restoring the Deleted Sale Return Invoice
    updateCreditAmountOnInvoiceRestored(InvoiceId: number, callback) {
        // tslint:disable-next-line:max-line-length
        this.getSaleData(InvoiceId, (InvoiceData: { partyId: number, saleReturnAmount: number }) => { // Getting the Party Id and Invoice Amount for Restored Invoice
            if (InvoiceData) {
                // tslint:disable-next-line:max-line-length
                this.getPartyCreditAmount(InvoiceData.partyId, (PartyCreditAmount: { value: number }) => { // Getting the current Party Credits Available
                    if (PartyCreditAmount) {
                        const EffectiveCreditAmount = Number(PartyCreditAmount.value) + Number(InvoiceData.saleReturnAmount);
                        // tslint:disable-next-line:max-line-length
                        this.updatePartyCreditAmount(InvoiceData.partyId, EffectiveCreditAmount, (result) => { // Updating the Party Credits Available after calculating Effective Credit Amount
                            if (result) { callback('success'); } else { callback(null); }
                        });
                    } else { callback(null); }
                });
            } else { callback(null); }
        });
    }
}
