import { Injectable, isDevMode } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IAnalyticsData } from '../Model/productItemsData.model';

@Injectable()
export class TransactionDataService {
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService, public http: Http) { }
    // Count total number of Sale Invoice Data */
    async  getSalesReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from SalesInvoices where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let salesTransactionData = 0;
            if (data && data.length > 0) {
                salesTransactionData = data[0].TransactionDataForInvoices;
            }
            return salesTransactionData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Count total number of Purchase Invoice Data */
    async  getPurchaseReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from PurchaseInvoices where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let purchaseTransactionData = 0;
            if (data && data.length > 0) {
                purchaseTransactionData = data[0].TransactionDataForInvoices;
            }
            return purchaseTransactionData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Count total number of parties */
    async  getPartyReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from Party where TemporaryParty = "0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let partyTransactionData = 0;
            if (data && data.length > 0) {
                partyTransactionData = data[0].TransactionDataForInvoices;
            }
            return partyTransactionData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Count total number of Items */
    async  getItemReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from Item where IsActivate=\'1\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let ItemData = 0;
            if (data && data.length > 0) {
                ItemData = data[0].TransactionDataForInvoices;
            }
            return ItemData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Count total number of ItemCategory */
    async  getItemCategoryReportData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from ItemCategory where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let ItemCategoryData = 0;
            if (data && data.length > 0) {
                ItemCategoryData = data[0].TransactionDataForInvoices;
            }
            return ItemCategoryData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Count total number of ExpenseData */
    async  getExpenseData() {
        // tslint:disable-next-line:max-line-length
        const query = 'select  COUNT(*) AS TransactionDataForInvoices from ExpenseList where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any ) => {
            let ExpenseListData = 0;
            if (data && data.length > 0) {
                ExpenseListData = data[0].TransactionDataForInvoices;
            }
            return ExpenseListData;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Update the Analytics Data On To the Server */
    async UpdateAnalyticsDataOnServer(AnalyctisData) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            AnalyctisData: AnalyctisData
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV_ANALYTICS; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_ANALYTICS; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        headers.append('x-api-key', APIKey);
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response; // response received from server
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error  ', err);
            return false;
        });
    }


    // Update the Analytics Data On To the Server */
    async UpdateAnalyticsDataForDayOnServer(AnalyctisDataForDay) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        const reqBody = {
        // tslint:disable-next-line:object-literal-shorthand
            AnalyctisDataForDay : AnalyctisDataForDay
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV_ANALYTICS_FOR_DAY; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_ANALYTICS_FOR_DAY; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response; // response received from server
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error  ', err);
            return false;
        });
    }


    // Update the Analytics Data On To the Server */
    async InsertTimeSpentPerSessionOnServer(TimeSpentPerSession) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            TimeSpentPerSession: TimeSpentPerSession
        };
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV_ANALYTICS_TIME_SPENT; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_ANALYTICS_TIME_SPENT; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response; // response received from server
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error  ', err);
            return false;
        });
    }


    // Update the Analytics Data In the database*/
    async UpdateAnalyticsData(Data, ColumnName, ReportData) {
        let query = '';
        // tslint:disable-next-line:max-line-length
        if (ReportData) { query = `UPDATE AnalyticsData SET  ${ColumnName}=${ColumnName}+ ${Data}`; } else { query = `UPDATE AnalyticsData SET  ${ColumnName}= ${Data}`; }
        return await this.dbProvider.executeSql(query, []).then((data) => {
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return false;
        });
    }

    // Update the Analytics Data In the database*/
    async UpdateAnalyticsDataForWalkThrough(Data, ColumnName) {
        let query = '';
        query = `UPDATE AnalyticsData SET  ${ColumnName}= "${Data}"`;
        return await this.dbProvider.executeSql(query, []).then((data) => {
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Update the Analytics Data For the day In the database*/
    async UpdateAnalyticsDataForDay(ColumnName, data) {
        // tslint:disable-next-line:max-line-length
        const query = 'UPDATE AnalyticsDataForDay SET  ${ColumnName}= ${ColumnName}+${data} WHERE ID=(SELECT ID FROM AnalyticsDataForDay ORDER BY ID DESC LIMIT 1)';
        return await this.dbProvider.executeSql(query, []).then((dataRow: any) => {
            return dataRow;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // insert Analytics Data For the day In the database*/
    async InsertAnalyticsDataForDay() {
        const date = new Date();
        const InsertData = [0, date];
        const  query = 'insert into AnalyticsDataForDay("SalesAdded","InsertedDate") VALUES (?,?)';
        return await this.dbProvider.executeSql(query, InsertData).then((data) => {
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Get the analytics data from the database*/
    async getAnalyticsData() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT SaleAppWalkThrough,InventoryAppWalkThrough,AppsubscriptionPage,subscriptionContactInformation,MonthlySubscriptionSuccess,AnuallySubscriptionSucess,FailurePayment, LastExpenseCreatedOn,LastSaleDoneOn,LastPurchaseDoneOn,LastItemAddedOn,LastCategoryCreatedOn,LastAppStartedon,LastAppUsedOn,TimeSpent, DailyAccountsReport, GSTR1Report, GSTR2Report, GSTR3BReport, InventoryStockReport, LowStockSummaryReport, PartyStatementReport, ProductLevelInventoryReport, ProfitAndLostReport, PurchaseDraftReport, PurchaseReport, SaleReport, SalesDraftReport, YearEndingReport FROM AnalyticsData';
        return await this.dbProvider.executeSql(query, []).then(async (data: any) => {
            let AnalyticsSettingData: IAnalyticsData;
            if (data && data.length > 0) {
                AnalyticsSettingData = {
                    SaleTotalTransactions: 0,
                    LastSaleDoneOn: data[0].LastSaleDoneOn,
                    LastPurchaseDoneOn: data[0].LastPurchaseDoneOn,
                    LastItemAddedOn: data[0].LastItemAddedOn,
                    LastCategoryCreatedOn: data[0].LastCategoryCreatedOn,
                    LastExpenseCreatedOn: data[0].LastExpenseCreatedOn,
                    LastAppStartedon: data[0].LastAppStartedon,
                    LastAppUsedOn: data[0].LastAppUsedOn,
                    TimeSpent: data[0].TimeSpent,
                    DailyAccountsReport: data[0].DailyAccountsReport,
                    GSTR1Report: data[0].GSTR1Report,
                    GSTR2Report: data[0].GSTR2Report,
                    GSTR3BReport: data[0].GSTR3BReport,
                    InventoryStockReport: data[0].InventoryStockReport,
                    LowStockSummaryReport: data[0].LowStockSummaryReport,
                    PartyStatementReport: data[0].PartyStatementReport,
                    ProductLevelInventoryReport: data[0].ProductLevelInventoryReport,
                    ProfitAndLostReport: data[0].ProfitAndLostReport,
                    PurchaseDraftReport: data[0].PurchaseDraftReport,
                    PurchaseReport: data[0].PurchaseReport,
                    SaleReport: data[0].SaleReport,
                    SalesDraftReport: data[0].SalesDraftReport,
                    YearEndingReport: data[0].YearEndingReport,
                    AppsubscriptionPage: data[0].AppsubscriptionPage,
                    subscriptionContactInformation: data[0].subscriptionContactInformation,
                    MonthlySubscriptionSuccess: data[0].MonthlySubscriptionSuccess,
                    AnuallySubscriptionSucess: data[0].AnuallySubscriptionSucess,
                    FailurePayment: data[0].FailurePayment,
                    SaleAppWalkThrough: data[0].SaleAppWalkThrough,
                    InventoryAppWalkThrough: data[0].InventoryAppWalkThrough
                };
            }
            return await AnalyticsSettingData;
        }, (err) => {
            console.log('Error  ', err);
            return null;
        });
    }

    // insert Analytics Data For the session In the database*/
    async InsertTimeSpentSession(time, DateInserted) {
        const query = 'insert into TimeSpentPerSession("SessionTime","InsertedDate") VALUES (?,?)';
        return await this.dbProvider.executeSql(query, [time, DateInserted]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // get the analyticsData for day from the database */
    async getAnalyticsDataForDay(MobileNumber, CampaignID, AnalyticsOverAllData: IAnalyticsData) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT InsertedDate,ID,SalesAdded,PurchasesAdded,ExpensesAdded,PartiesAdded,ItemsAdded,CategoriesAdded,TimeSpent, DailyAccountsReport, GSTR1Report, GSTR2Report, GSTR3BReport, InventoryStockReport, LowStockSummaryReport, PartyStatementReport, ProductLevelInventoryReport, ProfitAndLostReport, PurchaseDraftReport, PurchaseReport, SaleReport, SalesDraftReport, YearEndingReport FROM AnalyticsDataForDay where ServerSync="0\"';
        return await this.dbProvider.executeSql(query, []).then(async (data: any) => {
            const AnalyticsSettingData: IAnalyticsData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    AnalyticsSettingData.push({
                        // tslint:disable-next-line:object-literal-shorthand
                        MobileNumber:  MobileNumber,
                        // tslint:disable-next-line:object-literal-shorthand
                        CampaignID: CampaignID,
                        SaleTotalTransactions: 0,
                        ID:  dataRow.ID,
                        SalesAdded: String(AnalyticsOverAllData.SaleTotalTransactions),
                        PurchasesAdded: String(AnalyticsOverAllData.PurchaseTotalTransactions),
                        ExpensesAdded: String(AnalyticsOverAllData.ExpenseData),
                        PartiesAdded: String(AnalyticsOverAllData.PartyData),
                        ItemsAdded: String(AnalyticsOverAllData.ItemData),
                        CategoriesAdded: String(AnalyticsOverAllData.ItemCategoryData),
                        InsertedDate: dataRow.InsertedDate,
                        TimeSpent: dataRow.TimeSpent,
                        DailyAccountsReport: dataRow.DailyAccountsReport,
                        GSTR1Report: dataRow.GSTR1Report,
                        GSTR2Report: dataRow.GSTR2Report,
                        GSTR3BReport: dataRow.GSTR3BReport,
                        InventoryStockReport: dataRow.InventoryStockReport,
                        LowStockSummaryReport: dataRow.LowStockSummaryReport,
                        PartyStatementReport: dataRow.PartyStatementReport,
                        ProductLevelInventoryReport: dataRow.ProductLevelInventoryReport,
                        ProfitAndLostReport: dataRow.ProfitAndLostReport,
                        PurchaseDraftReport: dataRow.PurchaseDraftReport,
                        PurchaseReport: dataRow.PurchaseReport,
                        SaleReport: dataRow.SaleReport,
                        SalesDraftReport: dataRow.SalesDraftReport,
                        YearEndingReport: dataRow.YearEndingReport
                    });
                }
            }
            return await AnalyticsSettingData;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // get the Time Spent Per Session  from the database */
    async getTimeSpentPerSession(MobileNumber) {
        const query = 'SELECT ID,SessionTime,InsertedDate FROM TimeSpentPerSession where ServerSync="0"';
        return await this.dbProvider.executeSql(query, []).then(async (data: any) => {
            const TimeSpentPerSession = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    TimeSpentPerSession.push({
                        BUSINESS_ID: MobileNumber,
                        AttributeID: 'TimeSpentPerSession',
                        Value: dataRow.SessionTime,
                        LastUpdated: dataRow.InsertedDate
                    });
                }
            }
            return await TimeSpentPerSession;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Update the analytics data for day for server sync to 1 */
    async updateServerSyncTransactionDataForDay(ID) {

        const query = 'UPDATE AnalyticsDataForDay SET  ServerSync = "1" WHERE ID=?';
        return await this.dbProvider.executeSql(query, [ID]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Update the analytics data for TimeSpentPerSession for server sync to 1 */
    async updateTimeSpentPerSession(TimeSpentPerSession) {
        for (const TimeSpent of TimeSpentPerSession) {
            const query = 'UPDATE TimeSpentPerSession SET  ServerSync= "1" WHERE ID=?';
            return await this.dbProvider.executeSql(query, [TimeSpent.ID]).then((data) => {
                return data;
            }, (err) => {
                console.log('Error  ', err);
                return err;
            });
        }
    }


    // get the inserted day for day from the database */
    async getAnalyticsDataForDayInsertedDate() {
        const query = 'SELECT InsertedDate FROM AnalyticsDataForDay WHERE ID=(SELECT ID FROM AnalyticsDataForDay ORDER BY ID DESC LIMIT 1)';
        return await this.dbProvider.executeSql(query, []).then(async (data: any) => {
            let AnalyticsSettingData = '';
            if (data && data.length > 0) {
                AnalyticsSettingData = data[0].InsertedDate;

            }
            return await AnalyticsSettingData;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }


    // insert Analytics Data For the day In the database*/
    async InsertAnalyticsData() {
        const InsertData = [];
        // tslint:disable-next-line:max-line-length
        const query = 'insert into AnalyticsData (\'LastSaleDoneOn\',\'LastPurchaseDoneOn\',\'LastItemAddedOn\',\'LastCategoryCreatedOn\',\'LastExpenseCreatedOn\',\'LastAppStartedon\',\'LastAppUsedOn\') values (\'\',\'\',\'\',\'\',\'\',\'\',\'\')';
        return await this.dbProvider.executeSql(query, InsertData).then((data) => {
            return data;
        }, (err) => {
          console.log('Error  ', err);
          return err;
        });
    }

}
