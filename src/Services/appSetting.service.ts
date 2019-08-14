import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ConstMessages } from '../Constants/ErrorMessages';


@Injectable()
export class AppSettings {
    // For scrolling search-bar on all pages across the app
    lastScrollPosition: number;
    lastValue: number;
    HeaderHeight: number = null;

    constructor(private dbProvider: DatabaseProvider) { }

    // Get the App Settings data from DB
    async getAppSettingData(DataFieldName) {
        const query = 'SELECT InvoiceConfigFieldValue FROM InvoiceConfiguration WHERE InvoiceConfigFieldName = ?';
        return await this.dbProvider.executeSql(query, [DataFieldName]).then(async (data: any) => {
            let appSettingData;
            if (data && data.length > 0) {
                appSettingData = {
                    value: data[0].InvoiceConfigFieldValue
                };
                console.log(data[0].InvoiceConfigFieldValue);
            }
            return await appSettingData;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            // this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SETTING_GET_FAILED, " ; SRC Service Class:AppSettings method:getAppSettingData", err);
            console.log('Error: ', err);
            return err;
        });
    }
    // Update the App Settings in the DB
    async updateAppSetting(appSettingValue, appSettingName) {
        const query = 'UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue = ? WHERE InvoiceConfigFieldName = ?';
        return await this.dbProvider.executeSql(query, [appSettingValue, appSettingName]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Add the new App Config Settings in the DB
    async addAppSetting(appSettingName, appSettingValue) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO InvoiceConfiguration("InvoiceConfigFieldName","InvoiceConfigFieldValue", "InvoiceTemplateID") VALUES (?, ?, ?)';
        return await this.dbProvider.executeSql(query, [appSettingName, appSettingValue, '']).then((data) => {
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To check if the max limit for the flow is exceeded or not (80% or more), for the of trial version user of app
    isMaxLimitExceeded(flowName: string, callback) {
        const tableName = this.getTableNameFromFlowName(flowName);
        if (tableName.length) {
            // tslint:disable-next-line:max-line-length
            this.getTotalRowsInTable(tableName, (data) => { // Getting total count for the flow from DB and verifying max limit is exceeded or not for each flow
                // Returning the limit exceeded as true if less than 20% of free quota is left for each flow
                if (flowName === ConstMessages.FLOW_NAME.SALE && ConstMessages.MAX_SALES_LIMIT * 0.8 <= Number(data.value)) {
                    callback(true);
                    // tslint:disable-next-line:max-line-length
                } else if (flowName === ConstMessages.FLOW_NAME.PURCHASE && ConstMessages.MAX_PURCHASE_LIMIT * 0.8 <= Number(data.value)) {
                    callback(true);
                    // tslint:disable-next-line:max-line-length
                } else if (flowName === ConstMessages.FLOW_NAME.EXPENSE && ConstMessages.MAX_EXPENSE_LIMIT * 0.8 <= Number(data.value)) {
                    callback(true);
                } else if (flowName === ConstMessages.FLOW_NAME.PARTY && ConstMessages.MAX_PARTY_LIMIT * 0.8 <= Number(data.value)) {
                    callback(true);
                } else if (flowName === ConstMessages.FLOW_NAME.ITEM && ConstMessages.MAX_ITEMS_LIMIT * 0.8 <= Number(data.value)) {
                    callback(true);
                } else {
                    callback(false);
                } // Max limit not exceeded for any flow (less than 80% of the Max limit is exhausted)
            });
        } else { callback(null); } // Table name received is empty
    }
    // To get the total number of rows from the table associated with the flow
    getTotalRowsInTable(tableName: string, callback) {
        // // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        // const  query = 'SELECT COUNT(*) AS TotalRows FROM' + tableName +  'T WHERE T.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1')';
        // if (tableName === ConstMessages.TABLE_NAME.PARTY) { query += ' AND T.TemporaryParty = "0"; }'
        //  // Not including temporary party or deleted party
        // else query += " AND T.IsActivate = '1'"; // If not party table then checking if row is not deleted
        // tslint:disable-next-line:max-line-length
        // if (tableName === ConstMessages.TABLE_NAME.SALE) query += " AND T.isSaleReturn = '0'"; // Not including Sale Return from Sales Invoices Table
        // tslint:disable-next-line:max-line-length
        // if (tableName === ConstMessages.TABLE_NAME.PURCHASE) query += " AND T.isPurchaseReturn = '0'"; // Not including Purchase Return from Purchase Invoices Table
        // this.dbProvider.executeSql(query, []).then((data) => {
        //     let rowsTotal = { value: 0 };
        //     if (data.rows.length > 0) rowsTotal = { value: data.rows.item.TotalRows }
        //     callback(rowsTotal);
        // }, (err) => {
        //     console.log('Error: ', err);
        //     return err;
        //      });
    }

    // To get the table name for the flow provided
    getTableNameFromFlowName(flowName: string) {
        // tslint:disable-next-line:no-shadowed-variable
        let tableName = '';
        switch (flowName) {
            case ConstMessages.FLOW_NAME.SALE: {
                tableName = ConstMessages.TABLE_NAME.SALE;
                break;
            }
            case ConstMessages.FLOW_NAME.PURCHASE: {
                tableName = ConstMessages.TABLE_NAME.PURCHASE;
                break;
            }
            case ConstMessages.FLOW_NAME.EXPENSE: {
                tableName = ConstMessages.TABLE_NAME.EXPENSE;
                break;
            }
            case ConstMessages.FLOW_NAME.PARTY: {
                tableName = ConstMessages.TABLE_NAME.PARTY;
                break;
            }
            case ConstMessages.FLOW_NAME.ITEM: {
                tableName = ConstMessages.TABLE_NAME.ITEM;
                break;
            }
            default: { break; }
        }
        return tableName;
    }

    // To show the subscribe now modal to user in case the limit is exceeded
    showSubscribeNowAlert(flowName: string, callback) {
        // tslint:disable-next-line:one-variable-per-declaration
        // const maxFlowTotal = 0;
        // FlowTotalRemaining = 0, totalItemsInFlow = 0, tableName = '';
        // tableName = this.getTableNameFromFlowName(flowName);
        // this.getTotalRowsInTable(tableName, (data) => { // Getting total count for the flow from DB
        //     totalItemsInFlow = Number(data.value);
        //     switch (flowName) {
        //         case ConstMessages.FLOW_NAME.SALE: {
        //             maxFlowTotal = ConstMessages.MAX_SALES_LIMIT;
        //             FlowTotalRemaining = maxFlowTotal - totalItemsInFlow;
        //             break;
        //         }
        //         case ConstMessages.FLOW_NAME.PURCHASE: {
        //             maxFlowTotal = ConstMessages.MAX_PURCHASE_LIMIT;
        //             FlowTotalRemaining = maxFlowTotal - totalItemsInFlow;
        //             break;
        //         }
        //         case ConstMessages.FLOW_NAME.EXPENSE: {
        //             maxFlowTotal = ConstMessages.MAX_EXPENSE_LIMIT;
        //             FlowTotalRemaining = maxFlowTotal - totalItemsInFlow;
        //             break;
        //         }
        //         case ConstMessages.FLOW_NAME.PARTY: {
        //             maxFlowTotal = ConstMessages.MAX_PARTY_LIMIT;
        //             FlowTotalRemaining = maxFlowTotal - totalItemsInFlow;
        //             break;
        //         }
        //         case ConstMessages.FLOW_NAME.ITEM: {
        //             maxFlowTotal = ConstMessages.MAX_ITEMS_LIMIT;
        //             FlowTotalRemaining = maxFlowTotal - totalItemsInFlow;
        //             break;
        //         }
        //         default: { break; }
        //     }
        //     // tslint:disable-next-line:object-literal-shorthand
        //     callback({ maxFlowTotal: maxFlowTotal, FlowTotalRemaining: FlowTotalRemaining, flowText: flowName });
        // });
        return null;
    }

    // Add the new App Config Settings in the DB
    async addDBIncremental(appSettingName, appSettingValue, TemplateID) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO InvoiceConfiguration("InvoiceConfigFieldName", "InvoiceConfigFieldValue", "InvoiceTemplateID)" VALUES (?, ?, ?)';
        return await this.dbProvider.executeSql(query, [appSettingName, appSettingValue, TemplateID]).then((data) => {
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }
}
