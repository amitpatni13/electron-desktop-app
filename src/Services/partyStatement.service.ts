import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class PartyStatementService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) {}

    // To get the Party Statement Info for the Party Id provided between the given dates from the Sales Invoices Table in DB
    async  getPartyStatement(partyID, startDate, endDate) {
     // tslint:disable-next-line:max-line-length
        const query = 'SELECT SI.SalesInvoiceID, SI.InvoiceNumber, SI.InvoiceDate, SI.InvoiceDueDate, "Sale" AS TransactionType, SI.TotalPayable, P.PartyName, (coalesce(SI.TotalPayable,0) - coalesce(SI.AmountReceived,0)) AS Balance, SI.IsSaleReturn AS IsReturnInvoice FROM SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE SI.PartyID = ? AND (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")UNION Select PI.PurchaseInvoiceID AS SalesInvoiceID, PI.PurchaseInvoiceNumber AS InvoiceNumber, PI.PurchaseInvoiceDate AS InvoiceDate, PI.PurchaseReceiptDate AS InvoiceDueDate, "Purchase" AS TransactionType, PI.TotalAmount AS TotalPayable, PR.PartyName,(coalesce(PI.TotalAmount,0) - coalesce(PI.AmountPaid,0)) AS Balance, PI.IsPurchaseReturn AS IsReturnInvoice FROM PurchaseInvoices PI LEFT JOIN Party PR ON (PI.PartyID = PR.PartyID) WHERE PI.PartyID = ? and IsActivate="1" AND  (date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)) AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [partyID, startDate, endDate, partyID, startDate, endDate]).then((data: any) => {
            const statementData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    statementData.push({
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TransactionType: dataRow.TransactionType,
                        TotalPayable: dataRow.TotalPayable,
                        Balance: dataRow.Balance,
                        PartyName: dataRow.PartyName,
                        isReturnInvoice: dataRow.IsReturnInvoice
                    });
                }
            }
            return statementData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To get all the Party Statement Info between the given dates from the Sales Invoices Table in DB
    async  getAllPartyStatement(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT SI.SalesInvoiceID, SI.InvoiceNumber, SI.InvoiceDate, SI.InvoiceDueDate, "Sale" AS TransactionType, SI.TotalPayable, P.PartyName, (coalesce(SI.TotalPayable,0) - coalesce(SI.AmountReceived,0)) AS Balance, SI.IsSaleReturn AS IsReturnInvoice FROM SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) and P.PartyName IS NOT NULL and P.PartyName!="" and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION Select PI.PurchaseInvoiceID AS SalesInvoiceID, PI.PurchaseInvoiceNumber AS InvoiceNumber, PI.PurchaseInvoiceDate AS InvoiceDate, PI.PurchaseReceiptDate AS InvoiceDueDate, "Purchase" AS TransactionType, PI.TotalAmount AS TotalPayable, PR.PartyName,(coalesce(PI.TotalAmount,0) - coalesce(PI.AmountPaid,0)) AS Balance, PI.IsPurchaseReturn AS IsReturnInvoice FROM PurchaseInvoices PI LEFT JOIN Party PR ON (PI.PartyID = PR.PartyID) WHERE (date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)) and PR.PartyName IS NOT NULL and PR.PartyName!="" and IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")' ;
        return await this.dbProvider.executeSql(query, [startDate, endDate, startDate, endDate]).then((data: any) => {
            const statementData = [];
            if (data && data.length > 0) {
                for ( const dataRow of data) {
                    statementData.push({
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        InvoiceDate: dataRow.InvoiceDate,
                        InvoiceDueDate: dataRow.InvoiceDueDate,
                        TransactionType: dataRow.TransactionType,
                        TotalPayable: dataRow.TotalPayable,
                        Balance: dataRow.Balance,
                        PartyName: dataRow.PartyName,
                        isReturnInvoice: dataRow.IsReturnInvoice
                    });
                }
            }
            console.log(statementData);
            return statementData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To get the Party Name from Party Table in DB
    async getPartyName() {
        const query = 'Select PartyID, PartyName from Party WHERE BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            const partyData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    partyData.push({
                        PartyId: dataRow.PartyID,
                        PartyName: dataRow.PartyName
                    });
                }
            }
            return partyData;
        }, err => {
            console.log('Error  ', err);
            return err;

        });
    }
   // Get All the Party Data Sorted By Particular Column and sortingDirection
   async getPartyDataSortByColumn(startDate, endDate, sortColumn, sortDirection) {
     // tslint:disable-next-line:max-line-length
        const query = 'SELECT  SI.InvoiceDate, "Sale" AS TransactionType, SI.TotalPayable, P.PartyName AS PartyName,(coalesce(SI.TotalPayable,0) - coalesce(SI.AmountReceived,0)) AS Balance FROM SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?))  and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION ALL Select PI.PurchaseInvoiceDate AS InvoiceDate, "Purchase" AS TransactionType, PI.TotalAmount AS TotalPayable, PR.PartyName AS PartyName,(coalesce(PI.TotalAmount,0) - coalesce(PI.AmountPaid,0)) AS Balance FROM PurchaseInvoices PI LEFT JOIN Party PR ON (PI.PartyID = PR.PartyID) WHERE IsActivate="1" and (date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) <= date(?)) AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection} ';
        return await this.dbProvider.executeSql(query, [startDate, endDate, startDate, endDate]).then((data: any) => {
            const statementData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    statementData.push({
                        InvoiceDate: dataRow.InvoiceDate,
                        PartyName: dataRow.PartyName,
                        TransactionType: dataRow.TransactionType,
                        TotalPayable: dataRow.TotalPayable,
                        Balance: dataRow.Balance
                    });
                }
            }
            return statementData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    async getPartyDataSortByColumnwithSearch(PartyID, startDate, endDate, sortColumn, sortDirection) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT SI.InvoiceDate, "Sale" AS TransactionType, SI.TotalPayable, P.PartyName AS PartyName, (coalesce(SI.TotalPayable,0) - coalesce(SI.AmountReceived,0)) AS Balance FROM SalesInvoices SI LEFT JOIN Party P ON (SI.PartyID = P.PartyID) WHERE SI.PartyID = ? AND (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) and IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION ALL Select PI.PurchaseInvoiceDate AS InvoiceDate, "Purchase" AS TransactionType, PI.TotalAmount AS TotalPayable, PR.PartyName AS PartyName,(coalesce(PI.TotalAmount,0) - coalesce(PI.AmountPaid,0)) AS Balance FROM PurchaseInvoices PI LEFT JOIN Party PR ON (PI.PartyID = PR.PartyID) WHERE PI.PartyID = ? and IsActivate="1" AND  (date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)) AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection}';
        return await this.dbProvider.executeSql(query, [PartyID, startDate, endDate, PartyID, startDate, endDate]).then((data: any) => {
            const  statementData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    statementData.push({
                        InvoiceDate: dataRow.InvoiceDate,
                        PartyName: dataRow.PartyName,
                        TransactionType: dataRow.TransactionType,
                        TotalPayable: dataRow.TotalPayable,
                        Balance: dataRow.Balance,
                    });
                }
            }
            return statementData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
}
