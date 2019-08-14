import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IExpenseList } from '../Model/expenseList.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IExpenseListIns, IExpenseCategories } from '../Model/expense.Model';
// import { ConstantMessages } from '../Constants/constant';
// import { TransactionDataService } from './transactionDataService';
@Injectable()
export class ExpenseListData {
    constructor(private dbProvider: DatabaseProvider) { }
    // Add new Expense
    async addExpense(expenseData: IExpenseListIns, PartyID) {
        // tslint:disable-next-line:max-line-length
        const data = [expenseData.ExpenseAmount, expenseData.ExpenseDate, expenseData.ReceiptDate, expenseData.ExpensePaidTo, expenseData.ExpenseGST, expenseData.ExpenseCESS, expenseData.ExpenseDetails, expenseData.ExpenseAttachment, expenseData.ExpenseCategoryID, PartyID];
        console.log(data);
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('INSERT INTO ExpenseList ("ExpenseAmount", "ExpenseDate", "ReceiptDate", "ExpensePaidTo", "ExpenseGST", "ExpenseCESS","ExpenseDetails","ExpenseAttachment", "ExpenseCategoryID","IsActivate","PartyID","BusinessID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "1", ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))', data).then(dataRow => {
            const TodaysDate = new Date().getTime();
            // this._TransactionData.UpdateAnalyticsData(TodaysDate, ConstantMessages.TransactionDateAnalytics.EXPENSE,false);
            // this._TransactionData.UpdateAnalyticsDataForDay(ConstantMessages.TransactionDateAnalyticsForDay.EXPENSE,1);
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get distinct Expense purchaseIn and category color from the database
    getExpensePurchaseIn() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('select DISTINCT ExpenseCategoryName, ExpenseCategoryColor from ExpenseList WHERE IsActivate= "1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")', []).then((data: any) => {
            const expenseListPurchaseInData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseListPurchaseInData.push({
                        ExpenseCategoryName: dataRow.ExpenseCategoryName,
                        ExpenseColor: dataRow.ExpenseCategoryColor

                    });
                }
            }
            return expenseListPurchaseInData;
        }, err => {
            console.log('Error: ', err);
            return err;

        });

    }
    // Get All Expense from the database
    async getExpenseDataFromDB(ExpenseIDData) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT ExpenseID,PartyID,ExpenseAmount,ExpenseDate,ReceiptDate,ExpensePaidTo,ExpenseGST,ExpenseCESS,ExpenseDetails,ExpenseAttachment,ExpenseCategoryID,IsActivate FROM ExpenseList WHERE ExpenseID = ? LIMIT 1', [ExpenseIDData]).then((data: any) => {
            let ExpenseListInfo: IExpenseListIns;
            if (data && data.length > 0) {
                ExpenseListInfo = {
                    ExpenseID: data[0].ExpenseID,
                    ExpenseAmount: data[0].ExpenseAmount,
                    ExpenseDate: data[0].ExpenseDate,
                    ReceiptDate: data[0].ReceiptDate,
                    ExpensePaidTo: data[0].ExpensePaidTo,
                    ExpenseGST: data[0].ExpenseGST,
                    ExpenseCESS: data[0].ExpenseCESS,
                    ExpenseDetails: data[0].ExpenseDetails,
                    ExpenseAttachment: data[0].ExpenseAttachment,
                    ExpenseCategoryID: data[0].ExpenseCategoryID,
                    PartyID: data[0].PartyID,
                    IsActivate: data[0].IsActivate
                };
            }
            return ExpenseListInfo;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update the Expense Data
    async UpdateExpenseInfo(ExpenseData: IExpenseListIns, PartyID: number) {
        // tslint:disable-next-line:max-line-length
        const data = [ExpenseData.ExpenseAmount, ExpenseData.ExpenseDate, ExpenseData.ReceiptDate, ExpenseData.ExpensePaidTo, ExpenseData.ExpenseGST, ExpenseData.ExpenseCESS, ExpenseData.ExpenseDetails, ExpenseData.ExpenseAttachment, ExpenseData.ExpenseCategoryID, PartyID, ExpenseData.ExpenseID];
        console.log(data);
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE ExpenseList SET ExpenseAmount=?, ExpenseDate=?, ReceiptDate=?, ExpensePaidTo=?, ExpenseGST=?, ExpenseCESS=?, ExpenseDetails=?,  ExpenseAttachment=?, ExpenseCategoryID=?,ExpenseUpdated="1",PartyID=? WHERE ExpenseID = ?', data).then(dataRow => {
            console.log('updated successfully', dataRow);
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Restore Expense Data
    async RestoreExpense(ExpenseID) {
        const data = [ExpenseID];
        console.log(data);
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE ExpenseList SET IsActivate="1",ExpenseUpdated="1" WHERE ExpenseID = ?', data).then(dataRow => {
            console.log('Expense Restore successfully' , dataRow);
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get expense ID,PaidTo,ExpenseData,PurchaseIn,ExpenseAmount from the database
    async getAllExpenses(StartDate, EndDate, key) {
        let ExpenseData = [StartDate, EndDate];
        if (0 !== key) {
            ExpenseData = [StartDate, EndDate, key];
        }
        // tslint:disable-next-line:max-line-length
        let query = 'select ExpenseID,ExpensePaidTo,ExpenseDate,ExpenseCategoryID,ExpenseAmount from ExpenseList where IsActivate="1" and date(ExpenseDate) >= date(?) AND date(ExpenseDate) <= date(?) AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ExpenseID DESC LIMIT 10';
        if (0 !== key) {
          // tslint:disable-next-line:max-line-length
          query = 'select ExpenseID,ExpensePaidTo,ExpenseDate,ExpenseCategoryID,ExpenseAmount from ExpenseList where IsActivate="1" and date(ExpenseDate) >= date(?) AND date(ExpenseDate) <= date(?) and ExpenseID < ? AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ExpenseID DESC LIMIT 10';
        }
        return await this.dbProvider.executeSql(query, ExpenseData).then((data: any) => {
            const expenseListData: IExpenseList[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseListData.push({
                        ExpenseID: dataRow.ExpenseID,
                        ExpensePaidTo: dataRow.ExpensePaidTo,
                        ExpenseDate: dataRow.ExpenseDate,
                        ExpenseCategoryID: dataRow.ExpenseCategoryID,
                        ExpenseAmount: dataRow.ExpenseAmount
                    });
                }
            }
            return expenseListData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // To get all the expense categories and the category colors from DB
    getExpenseCategoryData() {
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
            console.log('Error: ', err);
            return err;
        });
    }
    // To insert the new expense category and the color in DB
    addExpenseCategory(categoryName: string, categoryColor: string) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('INSERT INTO ExpenseCategory (ExpenseCategoryName, ExpenseCategoryColor, ExpenseCategoryDate) VALUES (?, ?, DATETIME("now", "localtime"))', [categoryName, categoryColor]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }
    // To update the existing expense category info in DB
    updateExpenseCategory(expenseCategories: IExpenseCategories) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('UPDATE ExpenseCategory SET ExpenseCategoryName = ?, ExpenseCategoryColor = ? WHERE ExpenseCategoryID = ?', [expenseCategories.name, expenseCategories.color, expenseCategories.id]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // delete product from the list
    async DeleteExpenseData(ExpenseId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update ExpenseList Set IsActivate="0", ExpenseUpdated="1" where ExpenseID=?', [ExpenseId]).then((data) => {
            console.log('Expense Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }
}
