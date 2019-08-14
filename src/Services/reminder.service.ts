import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ErrorLogService } from './errorLog.service';
import { IReminder } from '../Model/reminder.model';
@Injectable()
export class ReminderSetting {
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Get the reminders based on the reminder type and send response back to the page
    async getAppSettingData() {
        const CurrentDate = new Date(Date.now() - 86400 * 1000).toISOString().split('T')[0]; // previous 24 hours date
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ReminderID,ReminderType,ReminderMessage,ReminderComponentPage,ReminderTimeStamp,ReminderDate,ReminderDate,ReminderCustomData,isActivate  FROM Reminder where (date(ReminderDate) >= date(?) or date(ReminderDate) <= date(?))  and isActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") order by ReminderDate';
        return await this.dbProvider.executeSql(query, [CurrentDate]).then(async (data: any) => {
            const ReminderData: IReminder[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ReminderData.push({
                        ReminderID:  dataRow.ReminderID,
                        ReminderType: dataRow.ReminderType,
                        ReminderMessage: dataRow.ReminderMessage,
                        ReminderComponentPage: dataRow.ReminderComponentPage,
                        ReminderTimeStamp: dataRow.ReminderTimeStamp,
                        ReminderDate: dataRow.ReminderDate,
                        ReminderCustomData: dataRow.ReminderCustomData,
                        isActivate: dataRow.isActivate
                    });
                }
            }
            return await ReminderData; // sending back the reminder data to the request
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Get the reminders based on the reminder type and send response back to the page
    async getReminderData() {
        const TodayDate = new Date();
        const CurrentDate = new Date(Date.now() - 86400 * 1000).toISOString().split('T')[0]; //  24 hours date
        const NextDate = new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0]; // next 24hours date
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT * FROM Reminder where  ((date(ReminderDate) >= date(?) AND date(ReminderDate) <= date(?) and ReminderShown < 5) or (date(ReminderDate) <= date(?) and ReminderShown < 5)) and isActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") order by ReminderDate';
        return await this.dbProvider.executeSql(query, [CurrentDate, NextDate, TodayDate]).then(async (data: any) => {
            const ReminderData: IReminder[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ReminderData.push({
                        ReminderID: dataRow.ReminderID,
                        ReminderType: dataRow.ReminderType,
                        ReminderMessage: dataRow.ReminderMessage,
                        ReminderComponentPage: dataRow.ReminderComponentPage,
                        ReminderTimeStamp: dataRow.ReminderTimeStamp,
                        ReminderDate: dataRow.ReminderDate,
                        ReminderShown: dataRow.ReminderShown,
                        ReminderCustomData: dataRow.ReminderCustomData,
                        isActivate: dataRow.isActivate
                    });
                }
            }
            return await ReminderData; // sending back the reminder data to the request
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To add a new reminder to the database
    async  addReminder(ReminderType, ReminderMessage, ReminderTimeStamp, ReminderDate, Page, ReminderData, ReminderInvoiceId) {
        if (ReminderData === undefined || ReminderData == null || ReminderData === '') {
            ReminderData = '';
        }
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('INSERT INTO Reminder ("ReminderType", "ReminderMessage", "ReminderTimeStamp", "ReminderDate", "ReminderComponentPage", "ReminderCustomData", "ReminderInvoiceId", "isActivate","BusinessID") VALUES (?, ?, ?, ?, ?, ?, ?, \'1\', (SELECT BusinessID FROM Business WHERE IsActive = "1"))', [ReminderType, ReminderMessage, ReminderTimeStamp, ReminderDate, Page, ReminderData, ReminderInvoiceId]).then(data => {
            return data;
        }, err => {
            // tslint:disable-next-line:max-line-length
            console.log('Error  ', err);
            return err;
        });
    }

    // To update the reminder shown count
    async  UpdateReminder(ReminderID, ReminderShown) {
        console.log('payment count updated ' + ReminderID + ReminderShown);
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Reminder SET ReminderShown= ? where ReminderID=?', [ReminderShown, ReminderID]).then(data => {
            return data;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To update the reminder shown count
    async  DeleteReminder(isActivate, ReminderID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Reminder SET isActivate= ? where ReminderID=?', [isActivate, ReminderID]).then(data => {
            console.log('PAYMENT REMINDER DELETED Successfully '); console.log(data);
            return data;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To update the reminder shown count
    async  UpdateReminderData(ReminderMessage, ReminderTimeStamp, ReminderDate, ReminderID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Reminder SET ReminderMessage= ?,ReminderTimeStamp=?,ReminderDate=? where ReminderID=?', [ReminderMessage, ReminderTimeStamp, ReminderDate, ReminderID]).then(data => {
            return data;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

     // Update the InvoicePayment Reminder cooresponding to ReminderId
     async  UpdateReminderMessageData(ReminderCustomData, ReminderID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Reminder SET ReminderCustomData= ? WHERE ReminderID= ?', [ReminderCustomData, ReminderID]).then(data => {
            return data;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // GetAll the Reminder Corresponding to ReminderType having PaymentTerms
    async GetAllReminderData(InvoiceId) {
      const query = 'SELECT * FROM Reminder where ReminderType="paymentTerms" AND isActivate="1" AND ReminderInvoiceId = ? ';
      return await this.dbProvider.executeSql(query, [InvoiceId]).then(async (data: any) => {
            let ReminderData;
            if (data && data.length > 0) {
            for (const dataRow of data) {
                  ReminderData = {
                        ReminderID: dataRow.ReminderID,
                        ReminderType: dataRow.ReminderType,
                        ReminderMessage: dataRow.ReminderMessage,
                        ReminderComponentPage: dataRow.ReminderComponentPage,
                        ReminderTimeStamp: dataRow.ReminderTimeStamp,
                        ReminderDate: dataRow.ReminderDate,
                        ReminderShown: dataRow.ReminderShown,
                        ReminderCustomData: dataRow.ReminderCustomData,
                        ReminderInvoiceId: dataRow.ReminderInvoiceId,
                        isActivate: dataRow.isActivate
                    };
                }
            }
            return await ReminderData; // sending back the reminder data to the request
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
     }
 }
