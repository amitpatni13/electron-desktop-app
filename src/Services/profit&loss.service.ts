import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';

@Injectable()
export class ProfitLossService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Calculate the total expense data between the Expense Date
    async getAllExpenseData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ExpenseAmount FROM ExpenseList WHERE date(ExpenseDate) >= date(?) AND date(ExpenseDate) < date(?) AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const expenseData: any[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseData.push({
                        totalExpenseAmount: dataRow.ExpenseAmount
                    });
                }
            }
            await expenseData;
            return expenseData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Calculate the total Purchase for each transaction
    async getTotalProductCount(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT TotalAmount from PurchaseInvoices WHERE date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) < date(?) AND IsActivate="1" AND IsPurchaseReturn="0" AND reverseCharge="0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const ItemData: any[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ItemData.push({
                        totalAmount: dataRow.TotalAmount
                    });
                }
            }
            await ItemData;
            return ItemData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Calculate the total Purchase for each transaction
    async getPurchaseReturn(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT TotalAmount,IsPurchaseReturn,reverseCharge from PurchaseInvoices WHERE date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?) AND IsActivate="1"  AND  BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const ItemData: any[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    if (dataRow.IsPurchaseReturn === 1 && dataRow.reverseCharge !== 1) {
                        ItemData.push({
                            totalAmount: dataRow.TotalAmount
                        });
                    }
                }
            }
            return ItemData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }

    // Calculate the ReverseCharge for  transaction
    async getReverseCharge(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'Select TotalAmount From PurchaseInvoices where date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) < date(?) AND IsActivate="1" AND reverseCharge="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const ItemData: any[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ItemData.push({
                        totalAmount: dataRow.TotalAmount
                    });
                }
            }
            return ItemData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }

    // Calculate the sale Return for each transaction
    async  getSaleReturn(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT TotalPayable from SalesInvoices WHERE date(InvoiceDate) >= date(?) AND date(InvoiceDate) < date(?) AND IsActivate="1" AND IsSaleReturn="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate]).then((data: any) => {
            const salesReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    salesReportData.push({
                        TotalPayable: dataRow.TotalPayable,
                    });
                }
            }
            return salesReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }

    async  getReceivableOutStandingBalance(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT P.OutstandingBalance from Party P JOIN SalesInvoices SI  ON P.PartyID = SI.PartyID WHERE date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) < date(?) AND SI.IsActivate="1" AND P.OutstandingBalance > 0  AND P.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")  UNION SELECT P.OutstandingBalance from Party P JOIN PurchaseInvoices PI  ON P.PartyID = PI.PartyID WHERE date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) < date(?) AND PI.IsActivate="1" AND P.OutstandingBalance > 0  AND P.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate, fromDate, toDate]).then((data: any) => {
            const OutstandingBalanceReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    OutstandingBalanceReportData.push({
                        OutstandingBalance: dataRow.OutstandingBalance,
                    });
                }
            }
            return OutstandingBalanceReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }

    async  getPayableOutStandingBalance(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT P.OutstandingBalance from Party P JOIN SalesInvoices SI  ON P.PartyID = SI.PartyID WHERE date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) < date(?) AND SI.IsActivate="1" AND P.OutstandingBalance < 0  AND P.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")  UNION SELECT OutstandingBalance from Party P JOIN PurchaseInvoices PI  ON P.PartyID = PI.PartyID WHERE date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) < date(?) AND PI.IsActivate="1" AND P.OutstandingBalance < 0  AND P.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate, fromDate, toDate]).then((data: any) => {
            const OutstandingBalanceReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    OutstandingBalanceReportData.push({
                        OutstandingBalance: dataRow.OutstandingBalance,
                    });
                }
            }
            return OutstandingBalanceReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }

    async  getOpeningStock(previousYearStartDate, previousstartDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select CurrentStock, PurchasePrice from Item I where date(CreatedDate) >= date(?) AND date(CreatedDate) <=  date(?) AND IsActivate = "1" and BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [previousYearStartDate, previousstartDate]).then((data: any) => {
            const OpeningStockReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    OpeningStockReportData.push({
                        CurrentStock: dataRow.CurrentStock,
                        PurchasePrice: dataRow.PurchasePrice
                    });
                }
            }
            return OpeningStockReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }
    // get the Closing  stock
    async  getClosingStock(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select PI.QtyChanged, I.PurchasePrice from ProductInventory PI Left Join Item I on PI.ItemID = I.ITEM_ID WHERE date(PI.Date) >= date(?) AND date(PI.Date) <= date(?) and I.IsActivate = "1" and I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate]).then((data: any) => {
            const ClosingStockReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ClosingStockReportData.push({
                        QtyChanged: dataRow.QtyChanged,
                        PurchasePrice: dataRow.PurchasePrice
                    });
                }
            }
            return ClosingStockReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }
    // Get Total Tax value
    async getTotalTax(fromDate, toDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select (coalesce(SII.TaxSlab1Amt,0) + coalesce(SII.TaxSlab2Amt,0)+coalesce(SII.TaxSlab3Amt,0) + coalesce(SII.TaxSlab4Amt,0)) as TotalSaleTax, 0 AS TotalPurchaseTax  from SalesInvoiceItems SII LEFT JOIN SalesInvoices SI ON SII.SalesInvoiceNo = SI.SalesInvoiceID WHERE date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) < date(?) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") UNION ALL select (coalesce(PII.TaxSlab1Amt,0) + coalesce(PII.TaxSlab2Amt,0)+coalesce(PII.TaxSlab3Amt,0) + coalesce(PII.TaxSlab4Amt,0)) AS TotalPurchaseTax, 0 AS TotalSaleTax from PurchaseInvoiceItems PII LEFT JOIN PurchaseInvoices PI ON PII.PurchaseInvoiceNo = PI.PurchaseInvoiceID WHERE  date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) < date(?) AND PI.IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [fromDate, toDate, fromDate, toDate]).then((data: any) => {
            const TotalTaxReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    TotalTaxReportData.push({
                        TotalSaleTax: dataRow.TotalSaleTax,
                        TotalPurchaseTax: dataRow.TotalPurchaseTax
                    });
                }
            }
            return TotalTaxReportData;
        }, err => {
            console.log('Error  ', err);
            return [];
        });
    }
}
