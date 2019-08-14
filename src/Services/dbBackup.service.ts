import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import * as CryptoJS from 'crypto-js';
import { AllItems } from '../BizLogic/itemData';
import { ToasterService } from './toastMessage.service';
import { ConstantMessages } from '../Constants/constant';
import { BillSetting } from './billSetting.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class DbBackup {
    backupFileName = '';
    backupFileSize = '';
    currentDBQueries = '';

    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, private billSetting: BillSetting, public logService: ErrorLogService, private sale: AllItems,
                private toastMessage: ToasterService, private translateService: TranslateService) { }

    // To create a backup of the current Database to SQL File
    downloadSQLDbFile(callback) {
        // this.dbProvider.convertDBToSQL().then((sqlScript) => {
        //     if (sqlScript) {
        //         const filePath = this.file.externalRootDirectory + 'DigiBill';
        //         this.getFileName(async (name: string) => {
        //             const fileName = name;
        //             this.backupFileName = fileName;
        //             // Preparing the SQL Data for encryption
        //             const SQLResponse = String(sqlScript);
        //             const beginTime = Date.now(); // Recording the start time before encryption
        //             // Encrypting the SQL Data
        //             const encryptedSQLData = await this.encryptSQLData(SQLResponse);
        //             console.log('Encrypted SQL response received after ', (Date.now() - beginTime), ' ms');
        //             // Writing the encrypted SQL data to file
        //             this.file.writeFile(filePath, fileName, encryptedSQLData, { replace: true }).then(res => {
        //                 console.log('Encrypted database backup written to file successfully! ', res);
        //                 this.getFileSize(res, () => { callback('success'); }); // Getting the size of the backup file generated
        //                 this.toastMessage.infoBottom('Backup saved to file ' + fileName);
        //             }).catch(err => {
        //                 console.log('Error in writing encrypted database backup to file ', err);
        //                 callback('success');
        //             });
        //         });
        //     } else { callback('error'); }
        // }, (err) => {
        //     console.log('Error: ', err);
        //     return err;
        // });
        callback('error');
    }

    // To restore the Database from an existing SQL backup file
    async uploadSQLDbFile(encryptedSQLScript, backupVersion, callback) {
        if (null === encryptedSQLScript) {
            console.log('Backup File data not received!');
            callback('error');
        }
        this.getCurrentDBQueries((sqlData: string) => { // Getting the queries for the current DB
            if (sqlData.length) { this.currentDBQueries = sqlData; }
            const beginTime = Date.now(); // Recording the start time before decryption
            const encryptedSQLData = String(encryptedSQLScript); // Preparing the SQL Data for decryption
            // Decrypting the SQL Data received from file
            this.AddColumn().then(async (data) => {
                let decryptedSQLData = await this.decryptSQLData(encryptedSQLData, data);
                this.updateItemAndSaleDraftTable(decryptedSQLData, backupVersion, (decryptSQLQueries) => {
                    decryptedSQLData = decryptSQLQueries;
                    console.log('Decrypted SQL response received after ', (Date.now() - beginTime), ' ms');
                    // this.dbProvider.convertSQLToDB(decryptedSQLData, (result) => {
                    //     if (result) {
                    //         console.log('Database filled successfully');
                    //         this.cleanupSaleProcess(); // Cleaning up the sale process session data
                    //         this.billSetting.UpdatePettyCashName(); // update petty cash name
                    //         callback('success');
                    //     } else {
                    //         // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line:max-line-length
                    //         this.restoreCurrentDB(backupVersion, (sqlresult) => { callback(sqlresult); }); // Restoring thr current DB state in case the restore is partially completed or failed
                    //     }
                    // }).catch((err: Error) => {
                    //     // tslint:disable-next-line:max-line-length
                    //     console.log('Error: ', err);
                    //     return err;
                    // tslint:disable-next-line:max-line-length
                    //     this.restoreCurrentDB(backupVersion, (result) => { callback(result) });  // Restoring thr current DB state in case the restore is partially completed or failed
                    // });
                    callback(null);
                });
            });
        });
    }

    // To get the file name with today's date
    getFileName(callback) {
        const date = new Date();
        const dateFormatted = new Date(date);
        let  month = '' + (dateFormatted.getMonth() + 1);
        let day = '' + dateFormatted.getDate();
        const year = '' + dateFormatted.getFullYear();
        let hour = '' + dateFormatted.getHours();
        let   minute = '' + dateFormatted.getMinutes();
        let   second = '' + dateFormatted.getSeconds();
        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }
        if (hour.length < 2) { hour = '0' + hour; }
        if (minute.length < 2) { minute = '0' + minute; }
        if (second.length < 2) { second = '0' + second; }
        const today = [day, month, year].join('-') + '_' + [hour, minute, second].join('.'); // Today's date in DD-MM-YYYY_hh.mm.ss format
        // this.appVersion.getVersionNumber().then((response) => {
        const appVersion = '';
        const fileName = 'DigiBill_' + today + '_' + appVersion + '.dbBackup'; // Generating the file name with today's date
        callback(fileName);
        // });
    }

    // To encrypt the SQL data before saving it in the file for DB export
    encryptSQLData(sqlScript: string) {
        // Encrypt the SQL Data with Base64 key and iv
        const key = ConstantMessages.encryptionKey.BACKUP_RESTORE_KEY;
        const fileDataArray = sqlScript.split('\n');
        // Implementing the Key and IV and encrypting the SQL file
        let encryptedSQLData = '';
        for (const data of fileDataArray) {
            // tslint:disable-next-line:max-line-length
            if (data.match('sqlite_sequence')) { continue; } else if (data.match('DROP TABLE IF EXISTS')) { continue; } else if (data.match('CREATE TABLE')) { continue; } else if (data.match('INSERT OR REPLACE INTO Business')) { continue; } else if (data.match('INSERT OR REPLACE INTO InvoiceConfiguration')) { continue; } else if (data.match('INSERT OR REPLACE INTO `HSN_SAC`')) { continue; } else {
                try {
                    if (data.length) { encryptedSQLData += CryptoJS.AES.encrypt(data, key).toString() + '\n'; }
                } catch (err) {
                    console.log('Failed to encrypt query row: ', data);
                    continue;
                }
            }
        }
        // Returning the result after the encryption is completed
        return encryptedSQLData;
    }

    // To decrypt the SQL data taken from the SQL file for DB import
    decryptSQLData(encryptedSQLScript: string, InsertedData) {
        // Decrypting the SQL Data with same Base64 key and iv used in encryption
        // tslint:disable-next-line:prefer-const
        let key = ConstantMessages.encryptionKey.BACKUP_RESTORE_KEY;
        const fileDataArray = encryptedSQLScript.split('\n');
        // Implementing the Key and IV and decrypting the Encrypted file text
        let decryptedSQLData = '';
        decryptedSQLData += InsertedData;
        for (const data of fileDataArray) {
            try {
                if (data.length) { decryptedSQLData += CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8) + '\n'; }
            } catch (err) {
                console.log('Unable to restore backup data');
                console.log('Failed to decrypt query row: ', data);
                continue;
            }
        }
        console.log(decryptedSQLData.split('\n'));
        return decryptedSQLData; // Returning the Decrypted SQL Data after it is generated
    }

    // To clean the sale process data if it is active
    cleanupSaleProcess() {
        this.sale.cartItems = [];
        this.sale.cleanServiceData();
    }

    // To show the alert message to confirm DB restore once a correct file has been selected
    restoreAlert(fileName: string, callback) {
        const fileDate = fileName.substring(9, 19); // Returns the date in DD-MM-YYYY format
        // tslint:disable-next-line:max-line-length
        this.translateService.get(['AreyousureyouwanttoRestoreBackup', 'willbelost', 'ConfirmRestore', 'Cancel', 'Confirm']).subscribe(ConvertedData => {
            const alertMessage = ConvertedData.AreyousureyouwanttoRestoreBackup + fileDate + ConvertedData.willbelost;
            // const alert = this.alertCtrl.create({
            //     title: ConvertedData.ConfirmRestore,
            //     message: alertMessage,
            //     buttons: [{
            //         text: ConvertedData.Cancel,
            //         role: 'cancel',
            //         handler: () => {
            //             console.log('Cancel clicked');
            //             const navTransition = alert.dismiss();
            //             navTransition.then(() => {
            //                 callback(false);
            //             });
            //             return false;
            //         }
            //     }, {
            //         text: ConvertedData.Confirm,
            //         handler: () => {
            //             console.log('Ok clicked');
            //             const navTransition = alert.dismiss();
            //             navTransition.then(() => {
            //                 callback(fileName);
            //             });
            //             return false;
            //         }
            //     }],
            //     cssClass: 'alertClosePage'
            // });
            // alert.present();
            callback(false);
        });
    }

    /** Getting the file size for the backup file generated */
    getFileSize(file, callback) {
        console.log('file url : ' + file.nativeURL);
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        (<any> window).resolveLocalFileSystemURL(file.nativeURL, (fileEntry) => {
            fileEntry.getMetadata((metadata) => { // File Metadata from most recent Backup File
                const size = Number(metadata.size) / (1024 * 1024);
                // tslint:disable-next-line:max-line-length
                if (size >= 1) { this.backupFileSize = String(size.toFixed(2)) + ' MB'; } else { this.backupFileSize = String(Math.round(size * 1024)) + ' KB'; } // File size in Kilo Bytes (KB)
                callback('done');
            });
        }, (error) => {
            console.error('Unable to read file: ', error);
            this.backupFileSize = '';
            callback('done');
        });
    }

    /** Added column ItemCategory_ImagePath, ItemImagePath in item table  */
    async AddColumn() {
        return await this.dbProvider.getDataBaseTableSchema('Item').then(res => {
            const MatchedContent = this.matchContent('ItemCategory_ImagePath', res);
            const MatchedContent2 = this.matchContent('ItemImagePath', res);
            let insertSql = '';
            if (MatchedContent) {
                insertSql += `ALTER TABLE Item ADD ItemCategory_ImagePath TEXT;` + '\n';
            }
            if (MatchedContent2) {
                insertSql += `ALTER TABLE Item ADD ItemImagePath TEXT;` + '\n';
            }
            return insertSql;
        });
    }

    /** To update the item and Sale Draft table by removing the incorrectly inserted fields during 0.0.16 version release */
    updateItemAndSaleDraftTable(sqlScript: string, backupVersion, callback) {
        let updatedSqlScript = sqlScript + '\n';
        // tslint:disable-next-line:max-line-length
        updatedSqlScript += `ALTER TABLE Item RENAME TO temp_item_table;ALTER TABLE DraftSalesInvoices RENAME TO temp_draft_table;CREATE TABLE Item('Item_ID' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'ItemCategory_ID' INTEGER NOT NULL,'ItemName' TEXT NOT NULL,'HSN_SAC' TEXT,'barcode' TEXT,'Item_Desc' TEXT,'Item_Weight' NUMERIC,'Item_ImagePath' TEXT,'ItemImageString' TEXT,'ItemImageCss' TEXT,'PurchasePrice' NUMERIC,'SellingPrice' NUMERIC,'isSellingPriceTaxInclusive' INTEGER,'isPurchasePriceTaxInclusive' INTEGER,'IsMaintainStock' INTEGER,'ItemMeasurementMasterID' INTEGER,'ItemMeasurementFieldCode' TEXT,'CurrentStock' INTEGER,'MinStockNotification' INTEGER,'AllowNegativeStock' INTEGER,'Brand' TEXT,'TaxSlabID1' INTEGER,'TaxSlabID2' INTEGER,'TaxSlabID3' INTEGER,'TaxSlabID4' INTEGER,'TaxSlab1Amt' NUMERIC,'TaxSlab2Amt' NUMERIC,'TaxSlab3Amt' NUMERIC,'TaxSlab4Amt' NUMERIC,'CreatedDate' TEXT,'IsActivate' NUMERIC DEFAULT 1,'DiscountedPrice' INTEGER,'ItemSold' NUMERIC DEFAULT 0,'ServerSync' NUMERIC DEFAULT 0,'itemUpdated' NUMERIC DEFAULT 0,'customQuantityFlag' INTEGER DEFAULT 0,'BusinessID' NUMERIC DEFAULT 1);CREATE TABLE DraftSalesInvoices ('SalesInvoiceID' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'InvoiceDate' TEXT NOT NULL,'InvoiceNumber' TEXT,'InvoiceDueDate' TEXT,'PartyID' INTEGER,'PartyName' TEXT,'Status' TEXT,'TotalAmount' NUMERIC,'Discount' NUMERIC,'DiscountIn' NUMERIC,'OtherCosts' NUMERIC,'TotalTax' NUMERIC,'TotalPayable' NUMERIC,'AmountReceived' NUMERIC,'PaymentModeID' INTEGER,'PaymentRef' TEXT,'PaymentRefImagePath' TEXT,'InvoiceShared' TEXT,'InvoiceNote' TEXT,'SaleDraftPage' TEXT,'categoryPageRedirect' TEXT,'categoryPageRedirectName' TEXT,'IsActivate' NUMERIC DEFAULT 1,'InvoiceType' NUMERIC DEFAULT 0,'BusinessID' NUMERIC DEFAULT 1, 'isSaleQuotation' NUMERIC DEFAULT 0, 'SaleQuotationStatus' TEXT)`;
            // tslint:disable-next-line:max-line-length
        if (Number(String(backupVersion).substring(String(backupVersion).lastIndexOf('.') + 1)) >= ConstantMessages.DEMO_ACCOUNT_APP_VERSION) { // If Backup was made for App Version >= 27 where Demo Account was added, then checking for BusinessID column as well
                // tslint:disable-next-line:max-line-length
                updatedSqlScript += `INSERT INTO Item ('Item_ID', 'ItemCategory_ID','ItemName','HSN_SAC','barcode','Item_Desc','Item_Weight','Item_ImagePath','ItemImageString','ItemImageCss','PurchasePrice','SellingPrice','isSellingPriceTaxInclusive','isPurchasePriceTaxInclusive','IsMaintainStock','ItemMeasurementMasterID','ItemMeasurementFieldCode','CurrentStock','MinStockNotification','AllowNegativeStock','Brand','TaxSlabID1','TaxSlabID2','TaxSlabID3','TaxSlabID4','TaxSlab1Amt','TaxSlab2Amt','TaxSlab3Amt','TaxSlab4Amt','CreatedDate','IsActivate','DiscountedPrice','ItemSold', 'ServerSync', 'itemUpdated', 'customQuantityFlag', 'BusinessID') SELECT Item_ID, ItemCategory_ID, ItemName, HSN_SAC, barcode, Item_Desc, Item_Weight, Item_ImagePath, ItemImageString, ItemImageCss, PurchasePrice, SellingPrice, isSellingPriceTaxInclusive, isPurchasePriceTaxInclusive, IsMaintainStock, ItemMeasurementMasterID, ItemMeasurementFieldCode, CurrentStock, MinStockNotification, AllowNegativeStock, Brand, TaxSlabID1, TaxSlabID2, TaxSlabID3, TaxSlabID4, TaxSlab1Amt, TaxSlab2Amt, TaxSlab3Amt, TaxSlab4Amt, CreatedDate, IsActivate, DiscountedPrice, ItemSold, ServerSync, itemUpdated, customQuantityFlag, BusinessID FROM temp_item_table; INSERT INTO DraftSalesInvoices ('SalesInvoiceID', 'InvoiceDate', 'InvoiceNumber', 'InvoiceDueDate', 'PartyID', 'PartyName', 'Status', 'TotalAmount', 'Discount', 'DiscountIn', 'OtherCosts', 'TotalTax', 'TotalPayable', 'AmountReceived', 'PaymentModeID', 'PaymentRef', 'PaymentRefImagePath', 'InvoiceShared', 'InvoiceNote', 'SaleDraftPage', 'categoryPageRedirect', 'categoryPageRedirectName', 'IsActivate', 'InvoiceType', 'BusinessID') SELECT SalesInvoiceID, InvoiceDate, InvoiceNumber, InvoiceDueDate, PartyID, PartyName, Status, TotalAmount, Discount, DiscountIn, OtherCosts, TotalTax, TotalPayable, AmountReceived, PaymentModeID, PaymentRef, PaymentRefImagePath, InvoiceShared, InvoiceNote, SaleDraftPage, categoryPageRedirect, categoryPageRedirectName, IsActivate, InvoiceType, BusinessID FROM temp_draft_table;
                `;
            } else { // If Backup was made for App Version <= 26 where Demo Account was not added
                // tslint:disable-next-line:max-line-length
                updatedSqlScript += `INSERT INTO Item ('Item_ID', 'ItemCategory_ID','ItemName','HSN_SAC','barcode','Item_Desc','Item_Weight','Item_ImagePath','ItemImageString','ItemImageCss','PurchasePrice','SellingPrice','isSellingPriceTaxInclusive','isPurchasePriceTaxInclusive','IsMaintainStock','ItemMeasurementMasterID','ItemMeasurementFieldCode','CurrentStock','MinStockNotification','AllowNegativeStock','Brand','TaxSlabID1','TaxSlabID2','TaxSlabID3','TaxSlabID4','TaxSlab1Amt','TaxSlab2Amt','TaxSlab3Amt','TaxSlab4Amt','CreatedDate','IsActivate','DiscountedPrice','ItemSold', 'ServerSync', 'itemUpdated', 'customQuantityFlag') SELECT Item_ID, ItemCategory_ID, ItemName, HSN_SAC, barcode, Item_Desc, Item_Weight, Item_ImagePath, ItemImageString, ItemImageCss, PurchasePrice, SellingPrice, isSellingPriceTaxInclusive, isPurchasePriceTaxInclusive, IsMaintainStock, ItemMeasurementMasterID, ItemMeasurementFieldCode, CurrentStock, MinStockNotification, AllowNegativeStock, Brand, TaxSlabID1, TaxSlabID2, TaxSlabID3, TaxSlabID4, TaxSlab1Amt, TaxSlab2Amt, TaxSlab3Amt, TaxSlab4Amt, CreatedDate, IsActivate, DiscountedPrice, ItemSold, ServerSync, itemUpdated, customQuantityFlag FROM temp_item_table; INSERT INTO DraftSalesInvoices ('SalesInvoiceID', 'InvoiceDate', 'InvoiceNumber', 'InvoiceDueDate', 'PartyID', 'PartyName', 'Status', 'TotalAmount', 'Discount', 'DiscountIn', 'OtherCosts', 'TotalTax', 'TotalPayable', 'AmountReceived', 'PaymentModeID', 'PaymentRef', 'PaymentRefImagePath', 'InvoiceShared', 'InvoiceNote', 'SaleDraftPage', 'categoryPageRedirect', 'categoryPageRedirectName', 'IsActivate', 'InvoiceType') SELECT SalesInvoiceID, InvoiceDate, InvoiceNumber, InvoiceDueDate, PartyID, PartyName, Status, TotalAmount, Discount, DiscountIn, OtherCosts, TotalTax, TotalPayable, AmountReceived, PaymentModeID, PaymentRef, PaymentRefImagePath, InvoiceShared, InvoiceNote, SaleDraftPage, categoryPageRedirect, categoryPageRedirectName, IsActivate, InvoiceType FROM temp_draft_table;`;
            }
        updatedSqlScript += `DROP TABLE temp_item_table;
                DROP TABLE temp_draft_table;`;
        callback(updatedSqlScript);
    }

    // if column does not match then return true
    matchContent(columns, ResponseCol) {
        for (const data in ResponseCol) {
            if (columns === ResponseCol[data]) {
                return false;
            }
        }
        return true;
    }

    /** To save the current DB data in variable in case the restore fails from backup */
    getCurrentDBQueries(callback) {
        this.dbProvider.convertDBToSQL().then((sqlScript) => {
            if (sqlScript) {
                const currentDBQueries = this.generateInsertQueries(String(sqlScript)); // Saving the current DB Queries in string variable
                callback(currentDBQueries);
            } else { callback(''); }
        }, (err) => {
            console.log('Error: ', err); callback('');
        });
    }

    /** To restore the current DB instance in case the restore from backup file fails */
    restoreCurrentDB(dbName: string, backupVersion, callback) {
        this.AddColumn().then(async (data) => { // Adding the columns from previous schema for Item and Sale Draft Tables
            // tslint:disable-next-line:max-line-length
            this.updateItemAndSaleDraftTable(this.currentDBQueries + data, backupVersion, (SQLQueries) => { // Replacing the the Item and Sale Draft Tables with current schema and previous data, and getting all the restore queries
                const AllSQLQueries = SQLQueries;
                this.dbProvider.convertSQLToDB(dbName, AllSQLQueries, (result) => {
                    if (result) {
                        console.log('Database filled successfully');
                        this.cleanupSaleProcess(); // Cleaning up the sale process session data
                        this.billSetting.UpdatePettyCashName(); // update petty cash name
                        callback('restored');
                    } else { callback('error'); }
                    this.currentDBQueries = ''; // Emptying the queries after restore process is finished
                }).catch((err: Error) => {
                    console.log('Error: ', err); callback('error');
                    this.currentDBQueries = ''; // Emptying the queries after restore process is finished
                });
            });
        });
    }

    /** To get the insert SQL data and removing the not required tables and create and drop queries */
    generateInsertQueries(sqlScript: string) {
        let queries = '';
        const fileDataArray = sqlScript.split('\n');
        for (const data of fileDataArray) {
            // tslint:disable-next-line:max-line-length
            if (data.match('sqlite_sequence')) { continue; } else if (data.match('DROP TABLE IF EXISTS')) { continue; } else if (data.match('CREATE TABLE')) { continue; } else if (data.match('INSERT OR REPLACE INTO Business')) { continue; } else if (data.match('INSERT OR REPLACE INTO InvoiceConfiguration')) { continue; } else if (data.match('INSERT OR REPLACE INTO `HSN_SAC`')) { continue; } else {
                if (data.length) { queries += data.toString() + '\n'; }
            }
        }
        return queries; // Returning the result after the not required queries are removed
    }
}
