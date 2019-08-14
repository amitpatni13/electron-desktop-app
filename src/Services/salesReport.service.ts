import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class SalesReportService {

    constructor(private dbProvider: DatabaseProvider) { }
    // Selecting the sales invoice table data between the dates
    getSalesReportData(fromDate, toDate, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'select SI.SalesInvoiceID,SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn  from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) where (date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) <= date(?)) and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        // const query = 'select *  from SalesInvoices where (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?))';
        console.log(query);
        this.dbProvider.executeSql(query, [fromDate, toDate]).then(async (data: any) => {
            const salesReportData = [];
            if (data && data.length > 0) {
                for (const value of data) {
                    salesReportData.push({
                        SalesInvoiceID: value.SalesInvoiceID,
                        InvoiceNumber: value.InvoiceNumber,
                        PartyName: value.PartyName,
                        InvoiceDate: value.InvoiceDate,
                        TotalPayable: value.TotalPayable,
                        AmountReceived: value.AmountReceived,
                        isSaleReturn: value.IsSaleReturn
                    });
                }
            }
            callback(salesReportData);

        }, err => {
            console.log('Error: ', err);
            callback([]);
        });
    }

    // Selecting the draft sales invoice table data between the dates
    async  getSalesDraftReportData(batchSize: number, key: number, fromDate: string, toDate: string) {
        // tslint:disable-next-line:max-line-length
        let query = `select DSI.SalesInvoiceID,DSI.InvoiceNumber,DSI.PartyID, P.PartyName, DSI.InvoiceDate, DSI.TotalPayable, DSI.AmountReceived from DraftSalesInvoices DSI LEFT JOIN Party P ON (DSI.PartyID = P.PartyID) WHERE date(InvoiceDate) >= date("${fromDate}") AND date(InvoiceDate) <= date("${toDate}") and IsActivate="1" AND DSI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND DSI.isSaleQuotation = "0" ORDER BY SalesInvoiceID DESC LIMIT ${batchSize}`;
        if (0 !== key) {
            // tslint:disable-next-line:max-line-length
            query = `select DSI.SalesInvoiceID,DSI.InvoiceNumber,DSI.PartyID, P.PartyName, DSI.InvoiceDate, DSI.TotalPayable, DSI.AmountReceived from DraftSalesInvoices DSI LEFT JOIN Party P ON (DSI.PartyID = P.PartyID) WHERE date(InvoiceDate) >= date("${fromDate}") AND date(InvoiceDate) <= date("${toDate}") and SalesInvoiceID < ${key} AND IsActivate="1" AND DSI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND DSI.isSaleQuotation = "0" ORDER BY SalesInvoiceID DESC LIMIT ${batchSize}`;
        }
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const salesDraftReportData = [];
            if (data && data.length > 0) {
                for (const value of data) {
                    salesDraftReportData.push({
                        SalesInvoiceID: value.SalesInvoiceID,
                        InvoiceNumber: value.InvoiceNumber,
                        PartyName: value.PartyName,
                        PartyID: value.PartyID,
                        InvoiceDate: value.InvoiceDate,
                        TotalPayable: value.TotalPayable,
                        AmountReceived: value.AmountReceived
                    });
                }
            }
            return salesDraftReportData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Get All SalesReportData
    async  getAllSalesReportData(batchSize: number, key: number, fromDate: string, toDate: string) {
        let SelectData = [fromDate, toDate, batchSize];
        if (0 !== key) {
            SelectData = [fromDate, toDate, key, batchSize];
        }
        console.log('selected data' + SelectData);
        // tslint:disable-next-line:max-line-length
        let query = 'select SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?) and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        if (0 !== key) {
            // tslint:disable-next-line:max-line-length
            query = 'select SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?) and SalesInvoiceID < ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const allsalesReportData = [];
            if (data && data.length > 0) {
                for (const value of data) {
                    allsalesReportData.push({
                        SalesInvoiceID: value.SalesInvoiceID,
                        InvoiceNumber: value.InvoiceNumber,
                        PartyName: value.PartyName,
                        PartyID: value.PartyID,
                        InvoiceDate: value.InvoiceDate,
                        TotalPayable: value.TotalPayable,
                        AmountReceived: value.AmountReceived,
                        isSaleReturn: value.IsSaleReturn,
                        creditAmountUsed: value.CreditsUsed,
                        paidIn: value.PaymentModeID,
                        saleReturnType: ''
                    });

                }
            }
            return allsalesReportData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get all the reports data
    async  getAllSalesReportHomeData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [batchSize];
        if (0 !== key) {
            SelectData = [key, batchSize];
        }
        console.log('selected data' + SelectData);
        // tslint:disable-next-line:max-line-length
        let  query = 'select "Sale" AS Type,SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE  IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        // tslint:disable-next-line:max-line-length
        if (0 !== key) {
            // tslint:disable-next-line:max-line-length
             query = 'select "Sale" AS Type,SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE  SalesInvoiceID < ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID DESC LIMIT ?';
        }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const salesReportHomeData = [];
            if (data && data.length > 0) {
                for (const salesHomeData of data) {
                    salesReportHomeData.push({
                        SalesInvoiceID: salesHomeData.SalesInvoiceID,
                        InvoiceNumber: salesHomeData.InvoiceNumber,
                        PartyName: salesHomeData.PartyName,
                        PartyID: salesHomeData.PartyID,
                        InvoiceDate: salesHomeData.InvoiceDate,
                        TotalPayable: salesHomeData.TotalPayable,
                        AmountReceived: salesHomeData.AmountReceived,
                        isSaleReturn: salesHomeData.IsSaleReturn,
                        creditAmountUsed: salesHomeData.CreditsUsed,
                        Type: salesHomeData.Type,
                        paidIn: salesHomeData.PaymentModeID,
                        saleReturnType: ''
                    });
                }
            }
            return salesReportHomeData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Get all the reports data
    async  getAllSalesDraftReportData(batchSize: number, key: number, fromDate, toDate) {
        let SelectData = [batchSize];
        if (0 !== key) {
            SelectData = [key, batchSize];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select "Draft" AS Type,SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, "0" AS IsSaleReturn, "0" AS CreditsUsed, SI.PaymentModeID from DraftSalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE  IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND SI.isSaleQuotation = "0" ORDER BY SalesInvoiceID DESC LIMIT ?';
        if (0 !== key) {
            // tslint:disable-next-line:max-line-length
            query = 'select "Draft" AS Type,SI.SalesInvoiceID, SI.PartyID, SI.InvoiceNumber, P.PartyName, SI.InvoiceDate, SI.TotalPayable, SI.AmountReceived, "0" AS IsSaleReturn, "0" AS CreditsUsed, SI.PaymentModeID from DraftSalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE  SalesInvoiceID < ? AND IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") AND SI.isSaleQuotation = "0" ORDER BY SalesInvoiceID DESC LIMIT ?';
        }
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const salesDraftReportData = [];
            if (data && data.length > 0) {
                for (const salesDraftData of data) {
                    {
                        salesDraftReportData.push({
                            SalesInvoiceID: salesDraftData.SalesInvoiceID,
                            InvoiceNumber: salesDraftData.InvoiceNumber,
                            PartyName: salesDraftData.PartyName,
                            PartyID: salesDraftData.PartyID,
                            InvoiceDate: salesDraftData.InvoiceDate,
                            TotalPayable: salesDraftData.TotalPayable,
                            AmountReceived: salesDraftData.AmountReceived,
                            isSaleReturn: salesDraftData.IsSaleReturn,
                            creditAmountUsed: salesDraftData.CreditsUsed,
                            Type: salesDraftData.Type,
                            paidIn: salesDraftData.PaymentModeID,
                            saleReturnType: ''
                        });
                    }
                }
                return salesDraftReportData;
            // tslint:disable-next-line:align
            }
        });
    }

    // Get all the reports data
    async  getAllSalesReportTotalData(fromDate, toDate) {
        const SelectData = [fromDate, toDate];
        console.log('selected data' + SelectData);
        // tslint:disable-next-line:max-line-length
        const query = 'select TotalPayable, IsSaleReturn from SalesInvoices WHERE date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?) and IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SalesInvoiceID';
        return await this.dbProvider.executeSql(query, SelectData).then((data: any) => {
            const salesReportTotalData = [];
            if (data && data.length > 0) {
                for (const salesTotalData of data) {
                    salesReportTotalData.push({
                        TotalPayable: salesTotalData.TotalPayable,
                        isSaleReturn: salesTotalData.IsSaleReturn
                    });
                }
            }
            return salesReportTotalData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

      // Getting both sales and sales draft data from Db
      async getBothSalesAndDraftReportData() {
        // tslint:disable-next-line:max-line-length
        const  query = 'SELECT "Sale" AS Type, SI.SalesInvoiceID, SI.InvoiceNumber, SI.PartyID, P.PartyName, SI.InvoiceDate, SI.TotalPayable,SI.AmountReceived, SI.IsSaleReturn, SI.CreditsUsed, SI.PaymentModeID from SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION SELECT "Draft" AS Type, DSI.SalesInvoiceID, DSI.InvoiceNumber, DSI.PartyID, PR.PartyName, DSI.InvoiceDate, DSI.TotalPayable,DSI.AmountReceived, "0" AS IsSaleReturn, "0" AS CreditsUsed, DSI.PaymentModeID from DraftSalesInvoices DSI LEFT JOIN Party PR ON (DSI.PartyID = PR.PartyID) WHERE IsActivate="1" AND DSI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY InvoiceDate DESC';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const  salesAndDraftReportData = [];
            if (data && data.length > 0) {
                for (const salesDraftData of data) {
                    salesAndDraftReportData.push({
                        SalesInvoiceID: salesDraftData.SalesInvoiceID,
                        InvoiceNumber: salesDraftData.InvoiceNumber,
                        PartyName: salesDraftData.PartyName,
                        InvoiceDate: salesDraftData.InvoiceDate,
                        TotalPayable: salesDraftData.TotalPayable,
                        AmountReceived: salesDraftData.AmountReceived,
                        PartyID: salesDraftData.PartyID,
                        Type: salesDraftData.Type,
                        isSaleReturn: salesDraftData.IsSaleReturn,
                        creditAmountUsed: salesDraftData.CreditsUsed,
                        paidIn: salesDraftData.PaymentModeID,
                        saleReturnType: ''
                    });
                }
            }
            return salesAndDraftReportData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
