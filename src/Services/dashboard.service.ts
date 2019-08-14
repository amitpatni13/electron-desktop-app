

import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ISalesData, IExpenseData } from '../Model/Dashboard.model';
import { IExpenseCategories } from '../Model/expense.Model';

@Injectable()
export class DashboardService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    async getProfit_SalesData() {

        //         let query = "";
        //         return await this.dbProvider.executeSql(query, []).then(
        //             (data: any) => {
        //                 let GraphData = [];

        //                 if (data.length > 0) {
        //                     for (var i = 0; i < data.length; i++) {
        //                         GraphData.push({

        //                         });
        //                     }
        //                 }
        //                 return GraphData;
        //             }, err => {
        //                 console.log('Error:', err);
        //                 return [];

        //             });
        return await [];
    }

    async getBargraphData() {

        //         let query = "";
        //         return await this.dbProvider.executeSql(query, []).then(
        //             (data: any) => {
        //                 let customerData = [];

        //                 if (data.length > 0) {
        //                     for (var i = 0; i < data.length; i++) {
        //                         customerData.push({

        //                         });
        //                     }
        //                 }
        //                 return customerData;
        //             }, err => {
        //                 console.log('Error:', err);
        //                 return [];

        //             });
        return await [];
    }

    async getPurchase_SalesData(fromDate, toDate) {

        // tslint:disable-next-line:max-line-length
        //                 let query = "select TotalAmount, InvoiceDate from SalesInvoices group by InvoiceDate having InvoiceDate between date(?) and date(?)";
        //                 return await this.dbProvider.executeSql(query, [fromDate, toDate]).then(
        //                     (data: any) => {
        //                         let GraphData = [];

        //                         if (data.length > 0) {
        //                             for (var i = 0; i < data.length; i++) {
        //                                 GraphData.push({
        //                                     "TotalAmount":data[i].TotalAmount,
        //                                     "InvoiceDate":data[i].InvoiceDate

        //                                 });
        //                             }
        //                         }
        //                         return GraphData;
        //                     }, err => {
        //                         console.log('Error:', err);
        //                         return [];

        //                     });
        //             }
        return await [];

    }

    // To provide deducible profit and sales data for Income vs Expense, Sales vs Profit and Cash Flow Graphs on Dashboard
    async getAllSalesData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT SII.SalesInvoiceNo, SII.Item_ID, SII.ItemName, SII.Quantity, SII.SellingPrice, I.PurchasePrice, SI.TotalPayable, SI.InvoiceDate FROM SalesInvoiceItems SII INNER JOIN Item I ON SII.Item_ID = I.Item_ID LEFT OUTER JOIN SalesInvoices SI ON SII.SalesInvoiceNo = SI.SalesInvoiceID  WHERE date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) <= date(?) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const salesInfo: ISalesData[] = [];
            if (data && data.length) {
                for (const dataRow of data) {
                    salesInfo.push({
                        saleInvoiceNumber: dataRow.SalesInvoiceNo,
                        saleDate: dataRow.InvoiceDate,
                        totalSaleAmount: dataRow.TotalPayable,
                        itemID: dataRow.Item_ID,
                        itemName: dataRow.ItemName,
                        itemQuantity: dataRow.Quantity,
                        itemPurchasePrice: dataRow.PurchasePrice,
                        itemSellingPrice: dataRow.SellingPrice
                    });
                }
                await salesInfo;
                return salesInfo;
            }
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To provide deducible expense data for Income vs Expense and Expense Categories Graphs on Dashboard
    async getAllExpenseData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ExpenseAmount, ExpenseDate, ExpenseCategoryID FROM ExpenseList WHERE date(ExpenseDate) >= date(?) AND date(ExpenseDate) <= date(?) AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const expenseData: IExpenseData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseData.push({
                        totalExpenseAmount: dataRow.ExpenseAmount,
                        expenseDate: dataRow.ExpenseDate,
                        expenseCategoryID: dataRow.ExpenseCategoryID
                    });
                }
                return expenseData;
            }
        }, (err) => {
            console.log('Error  ', err);
            return [];
        });
    }

    // To get all the expense categories and the category colors from DB
    getAllExpenseCategories() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('SELECT ExpenseCategoryID,ExpenseCategoryName,ExpenseCategoryColor FROM ExpenseCategory', []).then((data: any) => {
            const expenseCategories: IExpenseCategories[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseCategories.push({
                        id: dataRow.ExpenseCategoryID,
                        name: dataRow.ExpenseCategoryName,
                        color: dataRow.ExpenseCategoryColor
                    });
                }
            }
            return expenseCategories;
        }, err => {
            console.log('Error  ', err);
            return [];

        });
    }

    // To provide deducible expense data for Income vs Expense and Expense Categories Graphs on Dashboard
    async getTotalPurchaseAmount(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT SUM(TotalAmount) AS TotalInvoiceAmount FROM PurchaseInvoices WHERE (date(PurchaseInvoiceDate) >= date(?) AND date(PurchaseInvoiceDate) <= date(?)) AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            let purchaseAmount = 0;
            if (data && data.length) { purchaseAmount = data[0].TotalInvoiceAmount; }
            return Number(purchaseAmount);
        }, (err) => {
            console.log('Error  ', err);
            return [];
        });
    }
}
