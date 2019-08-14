import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstantMessages } from '../Constants/constant';
import { IBusinessProfile } from '../Model/BusinessProfile.model';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class AccountsService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) {}

    /** To Activate the Business Account selected by the user */
    activateAccount(BusinessID: number, callback) {
        const query = 'UPDATE Business SET IsActive = "1" WHERE BusinessID = ?';
        this.dbProvider.executeSql(query, [BusinessID]).then((result) => {
            if (result) {
                // tslint:disable-next-line:max-line-length
                this.deactivateAccount(BusinessID, (response) => { // Deactivating the other accounts once the selected account is activated by user
                    // tslint:disable-next-line:max-line-length
                    if (response) { console.log('Rest of the Accounts Deactivated: ', response); } else { console.log('Error Deactivating the Accounts: ', response); }
                    callback(result); // Returning the response to the user once finished
                });
            } else { callback(null); }
        }, (err) => {
            console.log('error ', err); callback(null);
        });
    }

    /** Deactivate the other Business Accounts after an account is selected by the user */
    deactivateAccount(BusinessID: number, callback) {
        const query = 'UPDATE Business SET IsActive = "0" WHERE BusinessID != ?';
        this.dbProvider.executeSql(query, [BusinessID]).then((result) => {
            if (result) { callback(result); } else { callback(null); }
        }, (err) => {
            console.log('error ', err); callback(null);
        });
    }

    getAllAccountsData(callback) {
        const query = 'SELECT BusinessID, Name, IsActive, State, ContactNumber, LogoImagePath FROM Business';
        this.dbProvider.executeSql(query, []).then((data: any) => {
            const profileData: IBusinessProfile[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    profileData.push({
                        BusinessID: dataRow.BusinessID,
                        Name: dataRow.Name,
                        State: dataRow.State,
                        ContactNumber: dataRow.ContactNumber,
                        LogoImagePath: dataRow.LogoImagePath,
                        isActive: dataRow.IsActive
                    });
                }
            }
            callback(profileData);
        }, (err) => {
            console.log('error ', err);
            callback(null);
        });
    }

    /** To add a new account into the DigiBill */
    addNewAccount(user: IBusinessProfile) {

    }

    /** To fill the default data for New Account added to DigiBill */
    fillDefaultDataForNewAccount(dbName: string, BusinessID: number) {
        const sqlScript  = this.GenerateSQLScriptForNewAccount(BusinessID);
        this.dbProvider.importSQLScriptToDB(dbName, sqlScript, (result) => {
            console.log('Sql Script for New Account Response: ', result);
        });
    }

    /** Getting the SQL Data to be inserted when a new account is added to DigiBill */
    GenerateSQLScriptForNewAccount(BusinessID: number) {
        let sqlScript = '';
        for (const data of ConstantMessages.PartyTableData) { // Adding Party Table Data
            // tslint:disable-next-line:max-line-length
            sqlScript += `INSERT INTO Party ('PartyName', 'ContactNumber', 'OutstandingBalance', 'CreatedOn', 'RegistrationType', 'CreditPoints', 'BusinessID') VALUES ('${data.PartyName}', '${data.ContactNumber}', '${data.OutstandingBalance}', DATETIME('now', 'localtime'), '${data.RegistrationType}', '${data.CreditPoints}', '${BusinessID}');` + '\n';
        }
        for (const data of ConstantMessages.InvoiceConfigTable) { // Adding Invoice Config Table Data
            // tslint:disable-next-line:max-line-length
            sqlScript += `INSERT INTO InvoiceConfiguration ('InvoiceConfigFieldName', 'InvoiceConfigFieldValue', 'InvoiceTemplateID', 'BusinessID') VALUES ('${data.InvoiceConfigFieldName}', '${data.InvoiceConfigFieldValue}', '${data.InvoiceTemplateID}', '${BusinessID}');`;
        }
        for (const  data of ConstantMessages.ExpenseCategoryTableData) { // Adding Expense Category Table Data Data
            // tslint:disable-next-line:max-line-length
            sqlScript += `INSERT INTO ExpenseCategory ('ExpenseCategoryName', 'ExpenseCategoryColor', 'BusinessID') VALUES ('${data.ExpenseCategoryName}', '${data.ExpenseCategoryColor}', '${BusinessID}');`;
        }
        for (const data of ConstantMessages.TaxSlabsTableData) { // Adding Tax Slabs Data
            // tslint:disable-next-line:max-line-length
            sqlScript += `INSERT INTO InvoiceConfiguration ('TaxSlabID', 'TaxSlabName', 'TaxSlabValue', 'BusinessID', 'CreatedOn') VALUES ('${data.TaxSlabID}', '${data.TaxSlabName}', '${data.TaxSlabValue}', '${BusinessID}', DATETIME('now', 'localtime'));`;
        }
        return sqlScript;
    }
}
