import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IPurchaseTxnDetail, IPurchaseItemData } from '../Model/purchase.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class PurchaseReportService {
    oldPartyId: number;

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Selecting the Purchase invoice table data between the dates
    async getPurchaseReportData(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'Select PI.PurchaseInvoiceID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) where (date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)) AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate]).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if ( data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        isPurchaseReturn: dataRow.IsPurchaseReturn
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getPurchaseReportData', err);
            return [];
        });
    }

    // Selecting the Draft Purchase invoice table data between the dates
    async getDraftPurchaseReportData(batchSize: number, key: number, fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        let query = `Select PDI.PurchaseInvoiceID, PDI.TotalTax, PDI.PurchaseInvoiceNumber, PDI.PartyID, PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, P.PartyName from PurchaseDraftInvoices PDI LEFT JOIN Party P ON (PDI.PartyID = P.PartyID) where (date(PurchaseInvoiceDate) >= date("${fromDate}") AND date(PurchaseInvoiceDate) <= date("${toDate}")) AND IsActivate='1' AND PDI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND PDI.isPurchaseQuotation = '0' ORDER BY PurchaseInvoiceID DESC LIMIT ${batchSize}`;
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = `Select PDI.PurchaseInvoiceID, PDI.TotalTax, PDI.PurchaseInvoiceNumber, PDI.PartyID, PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, P.PartyName from PurchaseDraftInvoices PDI LEFT JOIN Party P ON (PDI.PartyID = P.PartyID) WHERE (date(PurchaseInvoiceDate) >= date("${fromDate}") AND date(PurchaseInvoiceDate) <= date("${toDate}")) AND PurchaseInvoiceID < ${key} AND PDI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND PDI.isPurchaseQuotation = '0' ORDER BY PurchaseInvoiceID DESC LIMIT ${batchSize}`; }
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyId: dataRow.PartyID
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getDraftPurchaseReportData', err); console.log('Error:', err);
            return [];
        });
    }

    // Selecting the Purchase invoice data, it returns the  Purchase invoice row data based on the invoice number
    async getPurchaseDataFromDB(InvoiceNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select PI.PurchaseInvoiceID, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate,  PI.PurchaseReceiptDate, PI.InvoiceAmount, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.PartyID, PI.PaymentModeID, PI.IsActivate, PI.PaymentRefImagePath, PI.PaymentRef, PI.otherCosts, PI.IsPurchaseReturn,PI.reverseCharge from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) where PurchaseInvoiceID=?', [InvoiceNumber]).then((data: any) => {
            let PurchaseTxnDetail: IPurchaseTxnDetail;
            if (data && data.length > 0) {
                PurchaseTxnDetail = {
                    PurchaseInvoiceID: data[0].PurchaseInvoiceID,
                    PurchaseInvoiceNumber: data[0].PurchaseInvoiceNumber,
                    PurchaseInvoiceDate: data[0].PurchaseInvoiceDate,
                    PurchaseReceiptDate: data[0].PurchaseReceiptDate,
                    InvoiceAmount: data[0].InvoiceAmount,
                    TotalAmount: data[0].TotalAmount,
                    TotalDue: data[0].TotalDue,
                    AmountPaid: data[0].AmountPaid,
                    PartyName: data[0].PartyName,
                    PartyId: data[0].PartyID,
                    paidIn: data[0].PaymentModeID,
                    isActive: data[0].IsActivate,
                    PaymentRefImagePath: data[0].PaymentRefImagePath,
                    paymentRef: data[0].PaymentRef,
                    otherCosts: data[0].otherCosts,
                    isPurchaseReturn: data[0].IsPurchaseReturn,
                    ReverseCharge: data[0].reverseCharge
                };
            }
            return PurchaseTxnDetail;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getPurchaseDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // Selecting the Purchase invoice Item data, it returns multiple rows from sales invoice item table
    async getPurchaseItemsDataFromDB(SalesInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select * from PurchaseInvoiceItems where PurchaseInvoiceNo=?', [SalesInvoiceID]).then((data: any) => {
            const ItemData: IPurchaseItemData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ItemData.push({
                        id: dataRow.Item_ID,
                        name: dataRow.ItemName,
                        purchasePrice: dataRow.PurchasePrice,
                        TotalQuantity: dataRow.Quantity,
                        TaxSlabID1: dataRow.TaxSlab1,
                        TaxSlabID2: dataRow.TaxSlab2,
                        TaxSlabID3: dataRow.TaxSlab3,
                        TaxSlabID4: dataRow.TaxSlab4,
                        TaxSlabValue1: dataRow.TaxSlab1Amt,
                        TaxSlabValue2: dataRow.TaxSlab2Amt,
                        TaxSlabValue3: dataRow.TaxSlab3Amt,
                        TaxSlabValue4: dataRow.TaxSlab4Amt,
                        hsnCode: dataRow.HSNCode,
                        weightUnit: dataRow.Measurement
                    });
                }
            }
            return ItemData;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_ITEM_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getPurchaseItemsDataFromDB', err); console.log('Error:', err);
            return [];
        });
    }

    // tslint:disable-next-line:max-line-length
    // Selecting the draft invoice data for completing the transaction through purchase page, it return the draft sale invoice row data based on the invoice number
    async getDraftPurchaseDataFromDB(InvoiceID: number) {
        // tslint:disable-next-line:max-line-length
        const query = 'select PI.PurchaseInvoiceID, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.InvoiceAmount, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.PartyID, PI.PaymentModeID, PI.IsActivate, PI.PaymentRefImagePath, PI.PaymentRef, PI.otherCosts, PI.reverseCharge, PI.TotalTax, PI.isPurchaseQuotation, PI.PurchaseQuotationStatus from PurchaseDraftInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) where PurchaseInvoiceID=? AND IsActivate=\'1\' AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')';
        return await this.dbProvider.executeSql(query, [InvoiceID]).then((data: any) => {
            let PurchaseTxnDetail: IPurchaseTxnDetail;
            if (data && data.length > 0) {
                PurchaseTxnDetail = {
                    PurchaseInvoiceID: data[0].PurchaseInvoiceID,
                    PurchaseInvoiceNumber: data[0].PurchaseInvoiceNumber,
                    PurchaseInvoiceDate: data[0].PurchaseInvoiceDate,
                    PurchaseReceiptDate: data[0].PurchaseReceiptDate,
                    InvoiceAmount: data[0].InvoiceAmount,
                    TotalAmount: data[0].TotalAmount,
                    TotalDue: data[0].TotalDue,
                    AmountPaid: data[0].AmountPaid,
                    PartyName: data[0].PartyName,
                    PartyId: data[0].PartyID,
                    paidIn: data[0].PaymentModeID,
                    paymentRef: data[0].PaymentRef,
                    PaymentRefImagePath: data[0].PaymentRefImagePath,
                    otherCosts: data[0].otherCosts,
                    ReverseCharge: data[0].reverseCharge,
                    TotalTax: data[0].TotalTax,
                    isPurchaseQuotation: Boolean(Number(data[0].isPurchaseQuotation)),
                    PurchaseQuotationStatus: data[0].PurchaseQuotationStatus
                };
            }
            return PurchaseTxnDetail;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getDraftPurchaseDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // tslint:disable-next-line:max-line-length
    // Selecting the draft invoice item table data for completing the transaction through purchase page, it returns multiple rows from sales invoice item table
    async getDraftPurchaseItemsDataFromDB(SalesInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select * from PurchaseDraftInvoiceItems where PurchaseInvoiceNo=? AND IsActivate=\'1\'', [SalesInvoiceID]).then((data: any) => {
            const ItemData: IPurchaseItemData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ItemData.push({
                        id: dataRow.Item_ID,
                        name: dataRow.ItemName,
                        purchasePrice: dataRow.PurchasePrice,
                        TotalQuantity: dataRow.Quantity,
                        TaxSlabID1: dataRow.TaxSlab1,
                        TaxSlabID2: dataRow.TaxSlab2,
                        TaxSlabID3: dataRow.TaxSlab3,
                        TaxSlabID4: dataRow.TaxSlab4,
                        TaxSlabValue1: dataRow.TaxSlab1Amt,
                        TaxSlabValue2: dataRow.TaxSlab2Amt,
                        TaxSlabValue3: dataRow.TaxSlab3Amt,
                        TaxSlabValue4: dataRow.TaxSlab4Amt,
                        hsnCode: dataRow.HSNCode,
                        weightUnit: dataRow.Measurement
                    });
                }
            }
            return ItemData;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getDraftPurchaseItemsDataFromDB', err); console.log('Error:', err);
            return [];
        });
    }

    // To delete the DraftPurchaseData from database by passing the invoice id for that transaction.
    async deleteDraftPurchaseDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseDraftInvoices SET IsActivate=\'0\' where PurchaseInvoiceID=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_DELETE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:deleteDraftPurchaseDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // To delete the DraftPurchaseItemData from database by passing the invoice id for that transaction.
    async deleteDraftPurchaseItemDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseDraftInvoiceItems SET IsActivate=\'0\' where PurchaseInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_DELETE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:deleteDraftPurchaseItemDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }
    // To delete the DraftPurchaseItemData from database by passing the invoice id for that transaction.
    async deletePurchaseItemDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseInvoiceItems SET IsActivate=\'0\' where PurchaseInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_DELETE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:deletePurchaseItemDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // To delete the PurchaseData from database by passing the invoice id for that transaction.
    async deletePurchaseDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseInvoices SET IsActivate=\'0\', PurchaseUpdated = \'1\' where PurchaseInvoiceID=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_DELETE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:deletePurchaseDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // To delete the PurchaseItemData from database by passing the invoice id for that transaction.
    async deletePurchaseItemData(invoiceId) {
        return await this.dbProvider.executeSql('delete from PurchaseInvoiceItems where PurchaseInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_DELETE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:deletePurchaseItemDataFromDB', err); console.log('Error:', err);
            return err;
        });
    }

    // Update the Draft Purchase data if user again click on save button, returns the updated row value
    async UpdateDraftPurchaseDataToDB(PurchaseFinalData: IPurchaseTxnDetail) {
        // tslint:disable-next-line:max-line-length
        const query = 'update PurchaseDraftInvoices SET PurchaseInvoiceNumber=?, PurchaseInvoiceDate=?, PartyID=?, PartyName=?, InvoiceAmount=?, AmountPaid=?, TotalAmount=?, TotalDue=?,PaymentRef=?,PaymentRefImagePath=?,OtherCosts=?,reverseCharge=?,isPurchaseQuotation=?,PurchaseQuotationStatus=?, TotalTax=? where PurchaseInvoiceID=?';
        // tslint:disable-next-line:max-line-length
        const data = [PurchaseFinalData.PurchaseInvoiceNumber, PurchaseFinalData.PurchaseReceiptDate, PurchaseFinalData.PartyId, PurchaseFinalData.PartyName, PurchaseFinalData.InvoiceAmount, PurchaseFinalData.AmountPaid, PurchaseFinalData.TotalAmount, PurchaseFinalData.TotalDue, PurchaseFinalData.paymentRef, PurchaseFinalData.PaymentRefImagePath, PurchaseFinalData.otherCosts, PurchaseFinalData.ReverseCharge, Number(PurchaseFinalData.isPurchaseQuotation), PurchaseFinalData.PurchaseQuotationStatus, PurchaseFinalData.TotalTax, PurchaseFinalData.PurchaseInvoiceID];
        return await this.dbProvider.executeSql(query, data).then((DraftSalesInvoiceResponse) => {
            console.log(DraftSalesInvoiceResponse);
            return DraftSalesInvoiceResponse;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_UPDATE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:UpdateDraftPurchaseDataToDB', err); console.log('Error:', err);
            return err;
        });
    }

    // Update the Draft Purchase data if user again click on save button, returns the updated row value
    async UpdatePurchaseDataToDB(PurchaseFinalData: IPurchaseTxnDetail) {
        // tslint:disable-next-line:max-line-length
        const query = 'update PurchaseInvoices SET PurchaseInvoiceNumber=?, PurchaseInvoiceDate=?, PartyID=?, PartyName=?, InvoiceAmount=?, AmountPaid=?, TotalAmount=?, TotalDue=?,PaymentRef=?,PaymentRefImagePath=?,PurchaseUpdated="1",otherCosts=?,reverseCharge=? where PurchaseInvoiceID=?';
        // tslint:disable-next-line:max-line-length
        const data = [PurchaseFinalData.PurchaseInvoiceNumber, PurchaseFinalData.PurchaseReceiptDate, PurchaseFinalData.PartyId, PurchaseFinalData.PartyName, PurchaseFinalData.InvoiceAmount, PurchaseFinalData.AmountPaid, PurchaseFinalData.TotalAmount, PurchaseFinalData.TotalAmount - PurchaseFinalData.AmountPaid, PurchaseFinalData.paymentRef, PurchaseFinalData.PaymentRefImagePath, PurchaseFinalData.otherCosts, PurchaseFinalData.ReverseCharge, PurchaseFinalData.PurchaseInvoiceID];
        return await this.dbProvider.executeSql(query, data).then((DraftSalesInvoiceResponse) => {
            console.log(DraftSalesInvoiceResponse);
            return DraftSalesInvoiceResponse;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_UPDATE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:UpdatePurchaseDataToDB', err); console.log('Error:', err);
            return err;
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getAllPurchaseReportData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [fromDate, toDate, batchSize];
        if (0 !== key) {
            SelectData = [key, fromDate, toDate, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE IsActivate="1" and date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?) AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = 'select PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE PurchaseInvoiceID < ? and date(PurchaseInvoiceDate) >= ?  and date(PurchaseInvoiceDate) <= date(?) AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?'; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getAllPurchaseReportData', err);
            return [];
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getAllPurchaseReportHomeData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [batchSize];
        if (0 !== key) {
            SelectData = [key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = `select 'Purchase' AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn,  PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE IsActivate="1"  AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') ORDER BY PurchaseInvoiceID DESC LIMIT ?`;
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = `select 'Purchase' AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE PurchaseInvoiceID < ?  AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') ORDER BY PurchaseInvoiceID DESC LIMIT ?`; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        Type: dataRow.Type,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getAllPurchaseReportData', err);
            return [];
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getAllPurchaseDraftsReportData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [batchSize];
        if (0 !== key) {
            SelectData = [key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select "Draft" AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, "0" AS IsPurchaseReturn, PI.PaymentModeID from PurchaseDraftInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND PI.isPurchaseQuotation = "0" ORDER BY PurchaseInvoiceID DESC LIMIT ?';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = `select 'Draft' AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, '0' AS IsPurchaseReturn, PI.PaymentModeID from PurchaseDraftInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE PurchaseInvoiceID < ?  AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND PI.isPurchaseQuotation = '0' ORDER BY PurchaseInvoiceID DESC LIMIT ?`; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        Type: dataRow.Type,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getAllPurchaseReportData', err);
            return [];
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getAllPurchaseDraftReportData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [fromDate, toDate, batchSize];
        if (0 !== key) {
            SelectData = [key, fromDate, toDate, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, "0" AS IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE IsActivate="1" and date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?) AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?"';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = 'select PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, "0" AS IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE PurchaseInvoiceID < ? and date(PurchaseInvoiceDate) >= ?  and date(PurchaseInvoiceDate) <= date(?) AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?'; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getAllPurchaseReportData', err);
            return [];
        });
    }


    // Selecting the Purchase invoice table data from DB in batches
    async getAllPurchaseReportTotalValueData(fromDate, toDate) {
        const SelectData = [fromDate, toDate];
        // tslint:disable-next-line:max-line-length
        const query = 'select TotalAmount, IsPurchaseReturn from PurchaseInvoices WHERE IsActivate="1" and date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?) AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID';
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        TotalAmount: dataRow.TotalAmount,
                        isPurchaseReturn: dataRow.IsPurchaseReturn
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getAllPurchaseReportTotalValueData', err);
            return [];
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getNumberOfPurchaseTransaction() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS PurchaseInvoiceTotal FROM PurchaseInvoices WHERE IsPurchaseReturn="0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let PurchaseTotal = 0;
            if (data && data.length) { PurchaseTotal = data[0].PurchaseInvoiceTotal ; }
            return { value: Number(PurchaseTotal) };
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getNumberOfPurchaseTransaction', err);
            return null;
        });
    }

    // Selecting the Purchase invoice table data from DB in batches
    async getNumberOfPurchaseDraftTransaction() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS PurchaseInvoiceTotal FROM PurchaseDraftInvoices WHERE IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let PurchaseTotal = 0;
            if (data && data.length) {PurchaseTotal = data[0].PurchaseInvoiceTotal; }
            return { value: Number(PurchaseTotal) };
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getNumberOfPurchaseTransaction', err);
            return null;
        });
    }

    // To restore the deleted the PurchaseData from database by passing the invoice id for that transaction.
    async restoreDeletedPurchase(invoiceId: number) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseInvoices SET IsActivate="1", PurchaseUpdated = "1" where PurchaseInvoiceID=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_RESTORE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:restoreDeletedPurchase', err); console.log('Error:', err);
            return err;
        });
    }

    // To restore the deleted the PurchaseItemData from database by passing the invoice id for that transaction.
    async restoreDeletedPurchaseItems(invoiceId: number) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update PurchaseInvoiceItems SET IsActivate="1", purchaseItemUpdated = "1" where PurchaseInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_RESTORE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:restoreDeletedPurchaseItems', err); console.log('Error:', err);
            return err;
        });
    }

    // // Getting both sales and sales draft data from DB in batches
    async getBothPurchaseAndDraftReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT "Purchase" AS Type, PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate,   PI.TotalAmount, PI.TotalDue, PI.AmountPaid, P.PartyName, PI.IsPurchaseReturn, PI.PaymentModeID  from PurchaseInvoices PI LEFT JOIN Party P ON (PI.PartyID = P.PartyID) WHERE PI.IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION SELECT "Draft" AS Type, PDI.PurchaseInvoiceID, PDI.PartyID, PDI.TotalTax, PDI.PurchaseInvoiceNumber, PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, PR.PartyName, "0" AS IsPurchaseReturn, PDI.PaymentModeID from PurchaseDraftInvoices PDI LEFT JOIN Party PR ON (PDI.PartyID = PR.PartyID) WHERE PDI.IsActivate="1" AND PDI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        Type: dataRow.Type,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getBothPurchaseAndDraftReportData', err);
            return [];
        });
    }

    // To get the active value (0 or 1) for the invoice id from Purchase Invoice table in DB
    isPurchaseInvoiceActive(id: number) {
        return this.dbProvider.executeSql('SELECT IsActivate FROM PurchaseInvoices WHERE PurchaseInvoiceID = ?', [id]).then((data: any) => {
            if (data) {
                const isActive = data[0].IsActivate;
                return Boolean(Number(isActive));
            }
        }, (err) => {
            console.log('Error fetching Sales Invoice Table data: ' + err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_PURCHASE_SALES_DATA_RESTORE_FAILED, ' ;SRC - Service Class:PurchaseReportService method:isPurchaseInvoiceActive', err);
            return err;
        }
        );
    }

    async getPurchaseReportDataSortByColumn(startDate, endDate, sortColumn, sortDirection) {
        // tslint:disable-next-line:max-line-length
        const query = 'select PI.PurchaseInvoiceID, PI.PurchaseInvoiceNumber,PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, PR.PartyName, PI.PartyID, PI.IsPurchaseReturn, PI.PaymentModeID from PurchaseInvoices PI INNER JOIN Party PR ON (PI.PartyID = PR.PartyID) where (date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) <= date(?)) AND PI.IsActivate="1"  ORDER BY PI.${sortColumn} ${sortDirection}';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const PurchaseReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseReportData.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: ''
                    });
                }
            }
            return PurchaseReportData;
        }, err => {
            return [];
        });

    }

    async getPurchaseDraftReportDataSortByColumn(startDate, endDate, sortColumn, sortDirection) {
        // tslint:disable-next-line:max-line-length
        const query = `select DPI.PurchaseInvoiceNumber,DPI.PurchaseInvoiceDate, DPI.TotalAmount,DPI.PartyName from PurchaseDraftInvoices DPI INNER JOIN Party PR ON (DPI.PartyID = PR.PartyID) where (date(DPI.PurchaseInvoiceDate) >= date(?) AND date(DPI.PurchaseInvoiceDate) <= date(?)) AND DPI.IsActivate='1' AND DPI.isPurchaseQuotation = '0' ORDER BY DPI.${sortColumn} ${sortDirection}`;
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any ) => {
            const PurchaseReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseReportData.push({
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        TotalAmount: dataRow.TotalAmount,
                        PartyName: dataRow.PartyName

                    });
                }
            }
            return PurchaseReportData;
        }, err => {
            return [];
        });

    }



    /** Selecting the Purchase Order invoices from the Purchase Draft table between the dates */
    async getPurchaseQuotationReportData(batchSize: number, key: number, fromDate: string, toDate: string) {
        // tslint:disable-next-line:max-line-length
        let query = `select PDI.PurchaseInvoiceID, PDI.PurchaseInvoiceNumber, PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, P.PartyName, PDI.PartyID, PDI.PaymentModeID, PDI.isPurchaseQuotation, PDI.PurchaseQuotationStatus, PDI.TotalTax from PurchaseDraftInvoices PDI LEFT JOIN Party P ON (PDI.PartyID = P.PartyID) where (date(PDI.PurchaseInvoiceDate) >= date("${fromDate}") AND date(PDI.PurchaseInvoiceDate) <= date("${toDate}")) and PDI.IsActivate='1' AND PDI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND PDI.isPurchaseQuotation = '1' AND PDI.PurchaseQuotationStatus != 'Closed' ORDER BY PurchaseInvoiceID DESC LIMIT ${batchSize}`;
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = `select PDI.PurchaseInvoiceID, PDI.PurchaseInvoiceNumber, PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, P.PartyName, PDI.PartyID, PDI.PaymentModeID, PDI.isPurchaseQuotation, PDI.PurchaseQuotationStatus, PDI.TotalTax from PurchaseDraftInvoices PDI LEFT JOIN Party P ON (PDI.PartyID = P.PartyID) where (date(PDI.PurchaseInvoiceDate) >= date("${fromDate}") AND date(PDI.PurchaseInvoiceDate) <= date("${toDate}")) AND PDI.PurchaseInvoiceID < ${key} AND PDI.IsActivate='1' AND PDI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND PDI.isPurchaseQuotation = '1' AND PDI.PurchaseQuotationStatus != 'Closed' ORDER BY PurchaseInvoiceID DESC LIMIT ${batchSize}`; }
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const reportData: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    reportData.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: '',
                        PurchaseQuotationStatus: dataRow.PurchaseQuotationStatus,
                        isPurchaseQuotation: dataRow.isPurchaseQuotation,
                        TotalTax: dataRow.TotalTax
                    });
                }
            }
            return reportData;
        }).catch((err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_QUOTATION_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getPurchaseQuotationReportData', err);
            return [];
        });
    }

    /** Selecting the Purchase Order invoices from the Purchase Draft table between the dates with sorting */
    async getPurchaseQuotationReportDataSortByColumn(startDate: string, endDate: string, sortColumn: string, sortDirection: string) {
        // tslint:disable-next-line:max-line-length
        const query = `select PDI.PurchaseInvoiceID,PDI.PurchaseInvoiceNumber,PDI.PurchaseInvoiceDate, PDI.PurchaseReceiptDate, PDI.TotalAmount, PDI.TotalDue, PDI.AmountPaid, P.PartyName, PDI.PartyID, PDI.PaymentModeID, PDI.isPurchaseQuotation, PDI.PurchaseQuotationStatus from PurchaseDraftInvoices PDI LEFT JOIN Party P ON (PDI.PartyID = P.PartyID) where (date(PDI.PurchaseInvoiceDate) >= date(?) AND date(PDI.PurchaseInvoiceDate) <= date(?)) and PDI.IsActivate='1' AND PDI.isPurchaseQuotation = '1' AND PDI.PurchaseQuotationStatus != 'Closed' ORDER BY ${sortColumn} ${sortDirection}`;
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const reportData: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    reportData.push({
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        purchaseReturnType: '',
                        PurchaseQuotationStatus: dataRow.PurchaseQuotationStatus,
                        isPurchaseQuotation: dataRow.isPurchaseQuotation
                    });
                }
            }
            return reportData;
        }).catch((err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_QUOTATION_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getPurchaseQuotationReportDataSortByColumn', err);
            return [];
        });
    }

}
