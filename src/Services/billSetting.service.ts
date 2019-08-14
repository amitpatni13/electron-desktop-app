import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IBillSetting } from 'src/Model/billSetting.model';


@Injectable()
export class BillSetting {
    constructor(private dbProvider: DatabaseProvider) {
    }
    // get bill print out Format
    getBillSettingData() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('select InvoiceConfigFieldValue from InvoiceConfiguration where  InvoiceConfigFieldName="Printout" and  InvoiceTemplateID=(select InvoiceConfigFieldValue from InvoiceConfiguration where InvoiceConfigFieldName="PrintoutSelected")', []).then((data: any) => {
            // tslint:disable-next-line:max-line-length
            let BillSettingInData: IBillSetting = { GSTIN: false, Pan: false, TAN: false, CIN: false , ProductHSN: false, PrintoutSelected: '' };
            if (data && data.length > 0) {
               BillSettingInData = {
                  PrintoutSelected:  data[0].InvoiceConfigFieldValue
               };
            }
            return BillSettingInData;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
      }
 // get invoice config data from the database
    async getInvoiceSettingData(DataFieldName, DataFieldValue) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select InvoiceConfigFieldValue from InvoiceConfiguration where  InvoiceConfigFieldName=?', [DataFieldName]).then(async (data: any) => {
            let InvoiceSettingData: any;
            if (data !== undefined && data.length > 0) {
                InvoiceSettingData = {
                    ShowValue: data[0].InvoiceConfigFieldValue
                };
            }
            return await InvoiceSettingData;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
        }

    // get invoice config data from the database
    async getInvoiceSettingDataForNewA4() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select * from InvoiceConfiguration where  InvoiceConfigFieldValue=\'A4PrintOutSecondFormat\'', []).then(async (data: any) => {
            let InvoiceSettingData: any;
            if (data !== undefined && data.length > 0) {
                InvoiceSettingData = {
                    ShowValue: data.InvoiceConfigFieldValue,
                };
            }
            return await InvoiceSettingData;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }

    // get invoice config data from the database
    async getAllInvoiceSettingData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select InvoiceConfigFieldName,InvoiceConfigFieldValue,InvoiceTemplateID  from InvoiceConfiguration', []).then(async (data: any) => {
            const InvoiceSettingData: any = [];
            if ( data && data.length > 0) {
                for (const dataRow of data) {
                InvoiceSettingData.push( {
                    InvoiceConfigFieldName: dataRow.InvoiceConfigFieldName,
                    InvoiceConfigFieldValue: dataRow.InvoiceConfigFieldValue,
                    InvoiceTemplateID: dataRow.InvoiceTemplateID,
                });
            }
            }
            return await InvoiceSettingData;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
        }
    // Update the Bill printout format
    async UpdateBillSettingInfo(BillSettings: IBillSetting) {
        const data = [BillSettings.PrintoutSelected];
        console.log(data);
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue = (SELECT InvoiceTemplateID FROM InvoiceConfiguration WHERE InvoiceConfigFieldName = \'Printout\' AND InvoiceConfigFieldValue = ?) WHERE InvoiceConfigFieldName = \'PrintoutSelected\';', data).then(dataRow => {
            console.log('updated successfully ' + dataRow);
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
     }
    // Update the Bill Setting Format
    async UpdateBillSetting(BillDataFieldValue, BillDataFieldName) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?  WHERE InvoiceConfigFieldName = ?', [BillDataFieldValue, BillDataFieldName]).then(data => {
            console.log('updated successfully ' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }
    // Update invoice prefix setting
    async UpdateInvoicePrefixSetting(InvoicePrefix, InvoiceName) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?  WHERE InvoiceConfigFieldName = ?', [InvoicePrefix, InvoiceName]).then(data => {
            console.log('updated successfully ' + JSON.stringify(data));
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }

    // Update invoice prefix setting
    async InsertInvoicePrefixSetting(InvoiceName, InvoicePrefix, InvoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('INSERT INTO InvoiceConfiguration (\'InvoiceConfigFieldName\', \'InvoiceConfigFieldValue\', \'InvoiceTemplateID\') VALUES ( ?,?, ?);', [InvoiceName, InvoicePrefix, InvoiceId]).then(data => {
            console.log('updated successfully ' + JSON.stringify(data));
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }
    // Update auto increment value for custom invoice number
    async UpdateAutoIncrementValue(InvoicePrefix: number, InvoiceNumber: number) {
        const invoiceConfigName = 'InvoiceNumbers';
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?,InvoiceTemplateID=?  WHERE InvoiceConfigFieldName = ?', [InvoicePrefix, InvoiceNumber, invoiceConfigName]).then(data => {
            console.log('updated successfully ' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }

    // Update Petty cash to cash sale
    async UpdatePettyCashName() {
        return await this.dbProvider.executeSql('UPDATE Party SET PartyName=\'Cash Sale\'  WHERE ContactNumber = \'-1\'', []).then(data => {
            console.log('updated Petty Name successfully ' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
       }

     // Insert measurement unit
     async InsertintoMesaurementUnit(MeasurementData) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('INSERT INTO MeasurementUnit (\'MeasurementName\',\'MeasurementCode\',\'GroupID\',\'Ratio\',\'RatioID\',\'CreatedOn\') VALUES ( ?,?, ?,?,?,DATETIME(\'now\', \'localtime\'));', [MeasurementData.MeasurementName, MeasurementData.MeasurementCode, MeasurementData.GroupID, MeasurementData.Ratio, MeasurementData.RatioID]).then(data => {
            console.log('updated successfully ' + JSON.stringify(data));
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
             });
    }
}
