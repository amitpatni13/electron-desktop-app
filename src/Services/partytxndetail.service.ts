import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IPartyTxnDetail, IOverviewData } from '../Model/partytxndetail.model';
import { ISaleItemDetail } from '../Model/partytxndetail.model';
import { IPurchaseTxnDetail } from '../Model/purchase.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ConstantMessages } from '../Constants/constant';

@Injectable()
export class PartyTxnDetail {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Getting the sales invoice data for the particular party id
    getSaleInvoiceDetail(partyID: number) {
        // tslint:disable-next-line:max-line-length
        const  query = 'SELECT "Sale" AS Type, SalesInvoiceID, InvoiceNumber, InvoiceDate, TotalPayable, Discount, TotalTax, InvoiceDueDate,(coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - coalesce(CreditsUsed,0)) AS Balance, AmountReceived, IsSaleReturn, CreditsUsed, PaymentModeID, 0 AS isSaleQuotation, "None" AS SaleQuotationStatus FROM SalesInvoices WHERE PartyID = "${partyID}" AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION SELECT "${ConstMessages.ReportStaticData.SALE_DRAFT_NAME}" AS Type, SalesInvoiceID, InvoiceNumber, InvoiceDate, TotalPayable, Discount, TotalTax, InvoiceDueDate, (coalesce(TotalPayable,0) - coalesce(AmountReceived,0)) AS Balance, AmountReceived, "0" AS IsSaleReturn, "0" AS CreditsUsed, PaymentModeID, isSaleQuotation, SaleQuotationStatus FROM DraftSalesInvoices WHERE PartyID = "${partyID}" AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY InvoiceDate DESC';
        return this.dbProvider.executeSql(query, []).then(async (data: any) => {
            const PartyTxnDetails: IPartyTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PartyTxnDetails.push({
                        Type: dataRow.Type,
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TotalPayable: dataRow.TotalPayable,
                        AmountReceived: dataRow.AmountReceived,
                        Balance: dataRow.Balance,
                        Discount: dataRow.Discount,
                        TotalTax: dataRow.TotalTax,
                        isSaleReturn: dataRow.IsSaleReturn,
                        creditAmountUsed: dataRow.CreditsUsed,
                        paidIn: dataRow.PaymentModeID,
                        isSaleQuotation: Boolean(Number(dataRow.isSaleQuotation)),
                        SaleQuotationStatus: dataRow.SaleQuotationStatus
                    });
                }
            }
            console.log(PartyTxnDetails);
            return await PartyTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Getting the sales invoice data for the particular party id
    async getSaleInvoiceDetailForParty(partyID: number, batchSize: number, key: number) {
        let SelectData = [partyID, batchSize];
        if (0 !== key) {
            SelectData = [partyID, key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select "Sale" AS Type,SI.SalesInvoiceID,(coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - coalesce(CreditsUsed,0)) AS Balance,SI.Discount,SI.TotalTax,  SI.InvoiceNumber, SI.InvoiceDate,SI.InvoiceDueDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID, 0 AS isSaleQuotation, "None" AS SaleQuotationStatus from SalesInvoices SI  WHERE PartyID = ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        if (0 !== key) {
             // tslint:disable-next-line:max-line-length
            query = 'select "Sale" AS Type,SI.SalesInvoiceID,(coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - coalesce(CreditsUsed,0)) AS Balance, SI.Discount,SI.TotalTax, SI.InvoiceNumber, SI.InvoiceDate,SI.InvoiceDueDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID, 0 AS isSaleQuotation, "None" AS SaleQuotationStatus from SalesInvoices SI  WHERE PartyID = ? AND  SalesInvoiceID < ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        }
        return await this.dbProvider.executeSql(query, SelectData).then(async (data: any ) => {
        const  PartyTxnDetails: IPartyTxnDetail[] = [];
        if (data && data.length > 0) {
                for (const dataRow of data) {
                    PartyTxnDetails.push({
                        Type: dataRow.Type,
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TotalPayable: dataRow.TotalPayable,
                        AmountReceived: dataRow.AmountReceived,
                        Balance: dataRow.Balance,
                        Discount: dataRow.Discount,
                        TotalTax: dataRow.TotalTax,
                        isSaleReturn: dataRow.IsSaleReturn,
                        creditAmountUsed: dataRow.CreditsUsed,
                        paidIn: dataRow.PaymentModeID,
                        isSaleQuotation: Boolean(Number(dataRow.isSaleQuotation)),
                        SaleQuotationStatus: dataRow.SaleQuotationStatus
                    });
                }
            }
        console.log(PartyTxnDetails);
        return await PartyTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

     // Getting the sales invoice data for the particular party id
     async getSaleDraftDetailForParty(partyID: number, batchSize: number, key: number) {
        let SelectData = [partyID, batchSize];
        if (0 !== key) {
            SelectData = [partyID, key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select "Draft" AS Type,SalesInvoiceID,(coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - 0) AS Balance,Discount,TotalTax,  InvoiceNumber, InvoiceDate,InvoiceDueDate, TotalPayable, AmountReceived, "0" AS IsSaleReturn, "0" AS CreditsUsed, PaymentModeID, isSaleQuotation, SaleQuotationStatus from DraftSalesInvoices WHERE PartyID = ? AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND (SaleQuotationStatus IS NULL OR SaleQuotationStatus != "Closed") ORDER BY SalesInvoiceID DESC LIMIT ?';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = 'select "Draft" AS Type,SalesInvoiceID, (coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - 0) AS Balance,Discount,TotalTax, InvoiceNumber, InvoiceDate,InvoiceDueDate, TotalPayable, AmountReceived,"0" AS IsSaleReturn, "0" AS CreditsUsed, PaymentModeID, isSaleQuotation, SaleQuotationStatus from DraftSalesInvoices WHERE PartyID = ? AND  SalesInvoiceID < ? AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND (SaleQuotationStatus IS NULL OR SaleQuotationStatus != "Closed") ORDER BY SalesInvoiceID DESC LIMIT ?'; }
        return await this.dbProvider.executeSql(query, SelectData).then(async (data: any) => {
            const PartyTxnDetails: IPartyTxnDetail[] = [];
            if (data &&  data.length > 0) {
                for (const dataRow of data) {
                    PartyTxnDetails.push({
                        Type: dataRow.Type,
                        SalesInvoiceID:  dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TotalPayable: dataRow.TotalPayable,
                        AmountReceived: dataRow.AmountReceived,
                        Balance: dataRow.Balance,
                        Discount: dataRow.Discount,
                        TotalTax: dataRow.TotalTax,
                        isSaleReturn: dataRow.IsSaleReturn,
                        creditAmountUsed: dataRow.CreditsUsed,
                        paidIn: dataRow.PaymentModeID,
                        isSaleQuotation: Boolean(Number(dataRow.isSaleQuotation)),
                        SaleQuotationStatus: dataRow.SaleQuotationStatus
                    });
                }
            }
            console.log(PartyTxnDetails);
            return await PartyTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Getting the sales invoice data for the particular party id
    async   getSalesTotalTransaction(partyID: number) {
        const  SelectData = [partyID];
        // tslint:disable-next-line:max-line-length
        const query = 'select "Sale" AS Type,SI.Discount, SI.TotalPayable,  SI.IsSaleReturn, SI.PaymentModeID from SalesInvoices SI  WHERE PartyID = ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID';
        return await this.dbProvider.executeSql(query, SelectData).then(async (data: any) => {
            const  PartyTxnDetails = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PartyTxnDetails.push({
                        Type: dataRow.Type,
                        TotalPayable: dataRow.TotalPayable,
                        isSaleReturn: dataRow.IsSaleReturn,
                        paidIn: dataRow.PaymentModeID
                    });
                }
            }
            console.log(PartyTxnDetails);
            return await PartyTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Getting the Purchase invoice data for the particular party id
    async getPurchaseInvoiceDetail(partyID: number) {
     // tslint:disable-next-line:max-line-length
     const query = 'SELECT "Purchase" AS Type, PurchaseInvoiceID, TotalTax, PurchaseInvoiceNumber, PurchaseInvoiceDate, PurchaseReceiptDate,TotalAmount, TotalDue, AmountPaid, IsPurchaseReturn, PaymentModeID, 0 AS isPurchaseQuotation, "None" AS PurchaseQuotationStatus FROM PurchaseInvoices WHERE PartyID = "${partyID}" AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION SELECT "${ConstMessages.ReportStaticData.PURCHASE_DRAFT_NAME}" AS Type,PurchaseInvoiceID, TotalTax, PurchaseInvoiceNumber, PurchaseInvoiceDate, PurchaseReceiptDate, TotalAmount, TotalDue,AmountPaid, "0" AS IsPurchaseReturn, PaymentModeID, isPurchaseQuotation, PurchaseQuotationStatus FROM PurchaseDraftInvoices WHERE PartyID = "${partyID}" AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseReceiptDate DESC';
     return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const PurchaseTxnDetails: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetails.push({
                        Type: dataRow.Type,
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        TotalTax: dataRow.TotalTax,
                        isPurchaseQuotation: Boolean(Number(dataRow.isPurchaseQuotation)),
                        PurchaseQuotationStatus: dataRow.PurchaseQuotationStatus
                    });
                }
            }
            console.log(PurchaseTxnDetails);
            return PurchaseTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

     // Getting the Purchase invoice data for the particular party id
     async getPurchasePartyInvoiceDetail(partyID: number, batchSize: number, key: number) {
        let SelectData = [partyID, batchSize];
        if (0 !== key) {
            SelectData = [partyID, key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select "Purchase" AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, PI.IsPurchaseReturn,  PI.PaymentModeID, 0 AS isPurchaseQuotation, "None" AS PurchaseQuotationStatus from PurchaseInvoices PI WHERE PartyID = ? and IsActivate="1"  AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = 'select "Purchase" AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid, PI.IsPurchaseReturn, PI.PaymentModeID, 0 AS isPurchaseQuotation, "None" AS PurchaseQuotationStatus from PurchaseInvoices PI WHERE PartyID = ? and PurchaseInvoiceID < ?  AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID DESC LIMIT ?'; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetails: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetails.push({
                        Type: dataRow.Type,
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        TotalTax: dataRow.TotalTax,
                        isPurchaseQuotation: Boolean(Number(dataRow.isPurchaseQuotation)),
                        PurchaseQuotationStatus: dataRow.PurchaseQuotationStatus
                    });
                }
            }
            console.log(PurchaseTxnDetails);
            return PurchaseTxnDetails;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
// Getting the Purchase invoice data for the particular party id
    async getPurchasePartyData(partyID: number) {
        const SelectData = [partyID];
        // tslint:disable-next-line:max-line-length
        const query = 'select "Purchase" AS Type, PI.TotalAmount,PI.IsPurchaseReturn,  PI.PaymentModeID from PurchaseInvoices PI WHERE PartyID = ? and IsActivate="1"  AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PurchaseInvoiceID';
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        Type: dataRow.Type,
                        TotalAmount: dataRow.TotalAmount,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                    });
                }
            }
            console.log(PurchaseTxnDetail);
            return PurchaseTxnDetail;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

     // Getting the Purchase invoice data for the particular party id
     async getPurchasePartyDraftDetail(partyID: number, batchSize: number, key: number) {
        let SelectData = [partyID, batchSize];
        if (0 !== key) {
            SelectData = [partyID, key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = `select '${ConstMessages.ReportStaticData.PURCHASE_DRAFT_NAME}' AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid,  '0' AS IsPurchaseReturn,  PI.PaymentModeID, PI.isPurchaseQuotation, PI.PurchaseQuotationStatus from PurchaseDraftInvoices PI WHERE PartyID = ? and IsActivate="1"  AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND (PI.PurchaseQuotationStatus IS NULL OR PI.PurchaseQuotationStatus != 'Closed') ORDER BY PurchaseInvoiceID DESC LIMIT ?`;
        // tslint:disable-next-line:max-line-length
        if (0 !== key) { query = `select '${ConstMessages.ReportStaticData.PURCHASE_DRAFT_NAME}' AS Type,PI.PurchaseInvoiceID, PI.PartyID, PI.TotalTax, PI.PurchaseInvoiceNumber, PI.PurchaseInvoiceDate, PI.PurchaseReceiptDate, PI.TotalAmount, PI.TotalDue, PI.AmountPaid,  '0' AS IsPurchaseReturn, PI.PaymentModeID, PI.isPurchaseQuotation, PI.PurchaseQuotationStatus from PurchaseDraftInvoices PI WHERE PartyID = ? and PurchaseInvoiceID < ?  AND IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') AND (PI.PurchaseQuotationStatus IS NULL OR PI.PurchaseQuotationStatus != 'Closed') ORDER BY PurchaseInvoiceID DESC LIMIT ?`; }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const PurchaseTxnDetail: IPurchaseTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        Type: dataRow.Type,
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        isPurchaseReturn: dataRow.IsPurchaseReturn,
                        paidIn: dataRow.PaymentModeID,
                        TotalTax: dataRow.TotalTax,
                        isPurchaseQuotation: Boolean(Number(dataRow.isPurchaseQuotation)),
                        PurchaseQuotationStatus: dataRow.PurchaseQuotationStatus
                    });
                }
            }
            console.log(PurchaseTxnDetail);
            return PurchaseTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DASHBOARD_GET_PURCHASESALESDATA, ';SRC - Service Class:PartyTxnDetail method:getPurchaseInvoiceDetail', err);
            return [];
        });
    }

    // Getting the sales item data from database
    getSaleItemDetail(saleInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select ItemName, (coalesce(TaxSlab1Amt,0)+coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0)+coalesce(TaxSlab4Amt,0)) as Tax, NetAmountReceivable, Quantity from SalesInvoiceItems where SalesInvoiceNo = ? AND IsActivate="1"', [saleInvoiceID]).then(async (data: any) => {
            const SaleItemDetail: ISaleItemDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    // Getting only four columns from the database for sales invoice items table
                    SaleItemDetail.push({
                        ItemName: dataRow.ItemName,
                        tax: dataRow.Tax,
                        NetAmountReceivable: dataRow.NetAmountReceivable,
                        Quantity: dataRow.Quantity
                    });
                }
            }
            console.log(SaleItemDetail);
            return await SaleItemDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SALES_INVOICE_DATA_FAILED, ';SRC - Service Class:PartyTxnDetail method:getSaleItemDetail', err);
            return [];
        });
    }

    // Selecting some fields from Draft sales invoice table for the particular sales invoice id
    getDraftSaleItemDetail(saleInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select ItemName, (coalesce(TaxSlab1Amt,0)+coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0)+coalesce(TaxSlab4Amt,0)) as Tax, NetAmountReceivable, Quantity from DraftSalesInvoiceItems where SalesInvoiceNo = ? AND IsActivate="1"', [saleInvoiceID]).then(async (data: any) => {
            const SaleItemDetail: ISaleItemDetail[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    SaleItemDetail.push({
                        ItemName: dataRow.ItemName,
                        tax: dataRow.Tax,
                        NetAmountReceivable: dataRow.NetAmountReceivable,
                        Quantity: dataRow.Quantity
                    });
                }
            }
            console.log(SaleItemDetail);
            return await SaleItemDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DRAFT_SALES_INVOICE_DATA_FAILED, ';SRC - Service Class:PartyTxnDetail method:getDraftSaleItemDetail', err);
            return [];
        });
    }

    // Getting the sales invoice data for the particular party id
    getSaleInvoiceForPayments(partyID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select SalesInvoiceID,Discount,TotalTax,InvoiceNumber, InvoiceDate, InvoiceDueDate, coalesce(TotalPayable,0) as TotalPayable, coalesce(AmountReceived,0) as AmountReceived, (coalesce(TotalPayable,0) - coalesce(AmountReceived,0) - coalesce(CreditsUsed,0) ) as Balance, IsSaleReturn, CreditsUsed from SalesInvoices where PartyID = ? AND IsActivate=\'1\' and IsSaleReturn=\'0\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY SalesInvoiceID ASC', [partyID]).then(async (data: any) => {
            // tslint:disable-next-line:no-shadowed-variable
            const PartyTxnDetail: IPartyTxnDetail[] = [];
            if (data && data.length > 0) {
                for (const  dataRow of data) {
                    PartyTxnDetail.push({
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TotalPayable: dataRow.TotalPayable,
                        AmountReceived: dataRow.AmountReceived,
                        Balance: dataRow.Balance,
                        Discount: dataRow.Discount,
                        TotalTax: dataRow.TotalTax,
                        isSaleReturn: dataRow.IsSaleReturn,
                        creditAmountUsed: dataRow.CreditsUsed
                    });
                }
            // tslint:disable-next-line:align
            } console.log(PartyTxnDetail);
            return await PartyTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SALES_INVOICE_DATA_FAILED, ';SRC - Service Class:PartyTxnDetail method:getSaleInvoiceDetail', err);
            return [];
        });
    }

    // Getting the sales invoice data for the particular party id
    getPurchaseInvoiceForPayments(partID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select PurchaseInvoiceID,PurchaseInvoiceDate,PurchaseReceiptDate, PurchaseInvoiceNumber, TotalAmount, AmountPaid, coalesce(TotalAmount,0) as TotalAmount, coalesce(AmountPaid,0) as AmountPaid, (coalesce(TotalAmount,0) - coalesce(AmountPaid,0)) as Balance, IsPurchaseReturn from PurchaseInvoices where PartyID = ? AND IsActivate=\'1\' and IsPurchaseReturn=\'0\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY PurchaseInvoiceID ASC', [partID]).then(async (data: any) => {
            // tslint:disable-next-line:no-shadowed-variable
            const PartyTxnDetail: IPartyTxnDetail[] = [];
            if ( data && data.length > 0) {
                for (const dataRow of data) {
                    PartyTxnDetail.push({
                        SalesInvoiceID: dataRow.PurchaseInvoiceID,
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        InvoiceDate: dataRow.PurchaseInvoiceDate,
                        InvoiceDueDate: dataRow.PurchaseReceiptDate,
                        TotalPayable: dataRow.TotalAmount,
                        AmountReceived: dataRow.AmountPaid,
                        Balance: dataRow.Balance,
                        IsPurchaseReturn: dataRow.IsPurchaseReturn
                    });
                }
            }
            console.log(PartyTxnDetail);
            return await PartyTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SALES_INVOICE_DATA_FAILED, ';SRC - Service Class:PartyTxnDetail method:getSaleInvoiceDetail', err);
            return [];
        });
    }

    // Getting the sales invoice data for the particular invoice id
    getPurchaseInvoiceDataForPayments(InvoiceID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select PurchaseInvoiceID,PurchaseInvoiceDate,PurchaseReceiptDate, PurchaseInvoiceNumber, TotalAmount, AmountPaid, coalesce(TotalAmount,0) as TotalAmount, coalesce(AmountPaid,0) as AmountPaid, (coalesce(TotalAmount,0) - coalesce(AmountPaid,0)) as Balance, IsPurchaseReturn from PurchaseInvoices where PurchaseInvoiceID = ? AND IsActivate="1"', [InvoiceID]).then(async (data: any) => {
            // tslint:disable-next-line:no-shadowed-variable
            let PartyTxnDetail: any = {};
            if (data && data.length > 0) {
                PartyTxnDetail = {
                    InvoiceId: data[0].PurchaseInvoiceID,
                    InvoiceNumber: data[0].PurchaseInvoiceNumber,
                    InvoiceDate: data[0].PurchaseInvoiceDate,
                    InvoiceDueDate: data[0].PurchaseReceiptDate,
                    TotalPayable: data[0].TotalAmount,
                    amtReceived: data[0].AmountPaid,
                    Balance: data[0].Balance,
                    IsPurchaseReturn: data[0].IsPurchaseReturn
                };
            }
            console.log(PartyTxnDetail);
            return await PartyTxnDetail;
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SALES_INVOICE_DATA_FAILED, ';SRC - Service Class:PartyTxnDetail method:getSaleInvoiceDetail', err);
            return [];
        });
    }

    // Insert the Payment Data in DataBase
    UpdateSalesInvoices(AmountReceived, SalesInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Update SalesInvoices SET AmountReceived=? where SalesInvoiceID=? ', [AmountReceived, SalesInvoiceID]).then(async (data) => {
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SALES_INVOICE_DATA_ADD_FAILED, ';SRC - Service Class:PartyTxnDetails method:UpdateSalesInvoices', err);
            return err;
        });
    }

    // Insert the Payment Data in DataBase
    UpdatePurchaseInvoices(AmountReceived, PurchaseInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Update PurchaseInvoices SET AmountPaid=? where PurchaseInvoiceID=? ', [AmountReceived, PurchaseInvoiceID]).then(async (data) => {
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_ADD_FAILED, ';SRC - Service Class:PartyTxnDetails method:UpdatePurchaseInvoices', err);
            return err;
        });
    }

    /** To get the sale overview data for the dates provided */
    getSaleOverviewData(startDate: string, endDate: string, partyId: number, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT TotalPayable AS TotalAmount, IsSaleReturn AS IsReturnInvoice, PaymentModeID FROM SalesInvoices WHERE date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?) AND IsActivate = "1" AND PartyID = ? AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY InvoiceDate DESC';
        this.dbProvider.executeSql(query, [startDate, endDate, partyId]).then((data: any) => {
            let totalSale = 0;
            let totalPaymentIn = 0;
            let saleOverviewData: IOverviewData = null;
            const overviewData = [];
            if (data && data.length > 0) {
                for (let index = 0; index < data.rows.length; index++) {
                    overviewData.push({
                        TotalAmount: data[index].TotalAmount,
                        IsReturnInvoice: data[index].IsReturnInvoice,
                        PaymentId: data[index].PaymentModeID
                    });
                }
                if (overviewData.length) {
                    for (const value of overviewData) {
                        // tslint:disable-next-line:max-line-length
                        if (Number(value.IsReturnInvoice) && 1 === Number(value.PaymentId)) { totalSale -= Number(value.TotalAmount); } // If Return Invoice is a Cash Return
                        if (!Number(value.IsReturnInvoice)) { totalSale += Number(value.TotalAmount); }
                    }
                }
            }
            this.getTotalPaymentIn(startDate, endDate, partyId, (PaymentIn: { value: number }) => { // Getting Total Payment In
                if (PaymentIn.value) { totalPaymentIn = PaymentIn.value; }
                saleOverviewData = {
                    totalAmount: totalSale,
                    totalPayment: totalPaymentIn,
                    totalOutstanding: totalSale - totalPaymentIn,
                    header: '',
                    showCard: true
                };
                if (overviewData.length || null !== PaymentIn.value) { callback(saleOverviewData); } else { callback(null); }
            });
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ';SRC - Service Class:PartyTxnDetails method:getSaleOverviewData', err);
            callback(null);
        });
    }

    /** To get the purchase overview data for the dates provided */
    getPurchaseOverviewData(startDate: string, endDate: string, partyId: number, callback) {
        const query = `SELECT TotalAmount, IsPurchaseReturn AS IsReturnInvoice, PaymentModeID
                      FROM PurchaseInvoices WHERE date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)
                      AND IsActivate = '1' AND PartyID = ? AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1')
                      ORDER BY PurchaseInvoiceDate DESC`;
        this.dbProvider.executeSql(query, [startDate, endDate, partyId]).then((data: any) => {
            // tslint:disable-next-line:one-variable-per-declaration
            let totalPurchase = 0, totalPaymentOut = 0, purchaseOverviewData: IOverviewData = null;
            const overviewData = [];
            if (data.length) {
                // tslint:disable-next-line:prefer-for-of
                for (let index = 0; index < data.length; index++) {
                    overviewData.push({
                        TotalAmount: data[index].TotalAmount,
                        IsReturnInvoice: data[index].IsReturnInvoice,
                        PaymentId: data[index].PaymentModeID
                    });
                }
                if (overviewData.length) {
                    for (const value of overviewData) {
                        // tslint:disable-next-line:max-line-length
                        if (Number(value.IsReturnInvoice) && 1 === Number(value.PaymentId)) { totalPurchase -= Number(value.TotalAmount); } // If Return Invoice is a Cash Return
                        if (!Number(value.IsReturnInvoice)) { totalPurchase += Number(value.TotalAmount); }
                    }
                }
            }
            this.getTotalPaymentOut(startDate, endDate, partyId, (PaymentOut: { value: number }) => {
                if (PaymentOut.value) { totalPaymentOut = PaymentOut.value; }
                purchaseOverviewData = {
                    totalAmount: totalPurchase,
                    totalPayment: totalPaymentOut,
                    totalOutstanding: totalPurchase - totalPaymentOut,
                    header: '',
                    showCard: true
                };
                if (overviewData.length || null !== PaymentOut.value) { callback(purchaseOverviewData); } else { callback(null); }
            });
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ';SRC - Service Class:PartyTxnDetails method:getPurchaseOverviewData', err);
            callback(null);
        });
    }

    /** To get the total payment in value for the dates provided */
    getTotalPaymentIn(startDate: string, endDate: string, partyId: number, callback) {
        const query = `SELECT AmountPaid AS TotalPaymentIn, BillType FROM Payment WHERE date(PaymentDate) >= date(?) AND
                      date(PaymentDate) <= date(?) AND IsActivate = '1' AND PartyId = ? AND (BillType = '${ConstantMessages.BillType.SALE}'
                      OR BillType = '${ConstantMessages.BillType.SALE_RETURN}')
                      AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1') ORDER BY PaymentDate DESC`;
        this.dbProvider.executeSql(query, [startDate, endDate, partyId]).then((data: any) => {
            let totalPaymentIn = 0;
            const  overviewData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    overviewData.push({
                        TotalPaymentIn: dataRow.TotalPaymentIn,
                        BillType: dataRow.BillType
                    });
                }
                if (overviewData.length) {
                    for (const data1 of overviewData) {
                        if (ConstantMessages.BillType.SALE === data1.BillType) { totalPaymentIn += Number(data1.TotalPaymentIn); }
                        if (ConstantMessages.BillType.SALE_RETURN === data1.BillType) { totalPaymentIn -= Number(data1.TotalPaymentIn); }
                    }
                }
            }
            if (overviewData.length) { callback({ value: totalPaymentIn }); } else { callback({ value: null }); }
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ';SRC - Service Class:PartyTxnDetails method:getTotalPaymentIn', err);
            callback({ value: null });
        });
    }

    /** To get the total payment out value for the dates provided */
    getTotalPaymentOut(startDate: string, endDate: string, partyId: number, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT AmountPaid AS TotalPaymentOut, BillType FROM Payment WHERE date(PaymentDate) >= date(?) AND date(PaymentDate) <= date(?) AND IsActivate = "1" AND PartyId = ? AND (BillType = "${ConstantMessages.BillType.PURCHASE}" OR BillType = "${ConstantMessages.BillType.PURCHASE_RETURN}") AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY PaymentDate DESC';
        this.dbProvider.executeSql(query, [startDate, endDate, partyId]).then((data: any) => {
            let totalPaymentOut = 0;
            const overviewData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    overviewData.push({
                        TotalPaymentOut: data[0].TotalPaymentOut,
                        BillType: data[0].BillType
                    });
                }
                if (overviewData.length) {
                    for (const data1 of overviewData) {
                        if (ConstantMessages.BillType.PURCHASE === data1.BillType) { totalPaymentOut += Number(data1.TotalPaymentOut); }
                        // tslint:disable-next-line:max-line-length
                        if (ConstantMessages.BillType.PURCHASE_RETURN === data1.BillType) { totalPaymentOut -= Number(data1.TotalPaymentOut); }
                    }
                }
            }
            if (overviewData.length) { callback({ value: totalPaymentOut }); } else { callback({ value: null }); }
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DATABASE_QUERY_FAILED, ';SRC - Service Class:PartyTxnDetails method:getTotalPaymentOut', err);
            callback({ value: null });
        });
    }
}
