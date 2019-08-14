import { Injectable } from '@angular/core';
import { ToasterService } from './toastMessage.service';
import { ErrorLogService } from './errorLog.service';
import { AppSettings } from './appSetting.service';
import { DbBackup } from './dbBackup.service';

@Injectable()
export class GoogleDriveService {
    googleUserEmail = '';
    lastBackupDate = '';

    constructor(private toast: ToasterService, private logService: ErrorLogService, private appSettings: AppSettings,
                private db: DbBackup /** , private google: GooglePlus, private network: Network */) { }

    // To download a file from the Google Drive
    downloadFile(fileName: string, fileId: string, callback) {
        // tslint:disable-next-line:prefer-const
        // let GoogleDrive = (window as any).plugins.gdrive;
        // if ('none' === this.network.type) {
        //     this.toast.warningBottom('No Internet Connectivity, Kindly connect to Wi-Fi or turn on mobile internet!');
        //     this.logService.WarningMessage(ConstMessages.WARNCode.WARN_REGISTER_BUSINESS, ConstMessages.WARNCode.WARN_INTERNET_ACCESS);
        //     callback(null);
        //     return;
        // } else {
        //     this.loginToGoogleAccount((result) => {
        //         if (result) {
        //             console.log('Google Login Success: ', result);
        // tslint:disable-next-line:max-line-length
        //             if (!this.googleUserEmail.length) { this.SaveGoogleAccount(result.email); } // Saving the google account in DB in case of first time login
        //             let saveToFilePath = this.file.externalRootDirectory + 'DigiBill/GoogleDrive_' + fileName;
        // tslint:disable-next-line:max-line-length
        //             saveToFilePath = saveToFilePath.replace(/^file:\/\//, ''); // Allows the Google Drive method to correctly access the file path as it uses Cordova File path instead of ionic file module
        //             console.log('Downloaded File Path: ', saveToFilePath);
        //             const before = Date.now();
        //             // Triggered when download backup file from Google Drive event is called
        //             GoogleDrive.downloadFile(saveToFilePath, fileId, (response) => { // Calling google drive to get the file
        //                 console.log('File Download Response Time: ', (Date.now() - before), 'ms');
        //                 console.log('File Downloaded Successfully! ', response);
        //                 callback(response); // File download successful
        //                 this.toast.success('Backup file downloaded from Google Drive successfully! Restoring Database...');
        //             }, (error) => {
        //                 console.log('Error in Downloading file!', error);
        //                 console.log('error ', error);
        //                 callback(null);
        //             });
        //         } else { callback(null); }
        //     });
        // }
        callback(null);
    }

    // To upload a file to the Google Drive
    uploadFile(uploadFileName: string, callback) {
        // tslint:disable-next-line:prefer-const
        // let GoogleDrive = (window as any).plugins.gdrive;
        // if ('none' === this.network.type) {
        //     this.toast.warningBottom('No Internet Connectivity, Kindly connect to Wi-Fi or turn on mobile internet!');
        //     this.logService.WarningMessage(ConstMessages.WARNCode.WARN_REGISTER_BUSINESS, ConstMessages.WARNCode.WARN_INTERNET_ACCESS);
        //     callback(null);
        //     return;
        // } else {
        //     this.loginToGoogleAccount((result) => {
        //         if (result) {
        //             console.log('Google Login Success: ', result);
                     // tslint:disable-next-line:max-line-length
        //             if (!this.googleUserEmail.length) { this.SaveGoogleAccount(result.email); } // Saving the google account in DB in case of first time login
        //             const fileName = uploadFileName;
        //             if (!fileName.length) {
        //                 callback(null);
        //                 return; // If no file is selected
        //             }
        //             let filePath = this.file.externalRootDirectory + 'DigiBill/' + fileName;
                    // tslint:disable-next-line:max-line-length
        //             filePath = filePath.replace(/^file:\/\//, ''); // Allows the Google Drive method to correctly access the file path as it uses Cordova File path instead of ionic file module
        //             const before = Date.now();
        //             // Triggered when upload backup file to Google Drive event is called
        //             document.addEventListener('DeviceReady', () => {
        //                 console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');
        //                 GoogleDrive.uploadFile(filePath, false, (response) => { // Calling google drive to send the file
        //                     this.storage.set('loggedInViaGoogle', true);
        //                     console.log('File Uploaded Successfully! ', response);
        //                     console.log('File Upload Response Time: ', (Date.now() - before), 'ms');
        //                     this.toast.success('Backup file uploaded to Google Drive successfully!');
        //                     callback(response);

        //                 }, (error) => {
        //                     console.log('Error in Uploading file!', error);
        //                     this.toast.error('Error in uploading Backup file to Google Drive!');
        //                     console.log('error ', error);
        //                     callback(null);
        //                 });
        //             });
        //         } else { callback(null); }
        //     });
        // }
        callback(null);
    }

    /** To sync the available files from the google drive */
    requestFilesSync(callback) {
        const GoogleDrive = (window as any).plugins.gdrive;
        // if ('none' === this.network.type) {
        //     this.toast.warningBottom('No Internet Connectivity, Kindly connect to Wi-Fi or turn on mobile internet!');
        //     this.logService.WarningMessage(ConstMessages.WARNCode.WARN_REGISTER_BUSINESS, ConstMessages.WARNCode.WARN_INTERNET_ACCESS);
        //     callback(null);
        //     return;
        // } else {
        //     this.loginToGoogleAccount((result) => {
        //         if (result) {
        //             console.log('Google Login Success: ', result);
                     // tslint:disable-next-line:max-line-length
        //             if (!this.googleUserEmail.length) { this.SaveGoogleAccount(result.email); } // Saving the google account in DB in case of first time login
        //             document.addEventListener('DeviceReady', () => {
        //                 GoogleDrive.fileList(false, (response) => { // Calling google drive to send the file list
        //                     console.log('File List on Google Drive: ', response);
        //                     if (response && response.flist && response.flist.length) {
        //                         const backupData: IBackupModel[] = [];
        //                         for (const data of response.flist) {
        //                             backupData.push({
        //                                 fileName: data.name,
        //                                 fileId: data.id,
        //                                 uploadDate: data.modifiedTime
        //                             });
        //                         }
        //                         callback(backupData);
        //                     } else { callback(null); }
        //                 }, (error) => {
        //                     console.log('Error in getting file list from Google Drive: ', error);
        //                     console.log('error ', error);
        //                     callback(null);
        //                 });
        //             });
        //         } else { callback(null); }
        //     });
        // }
        callback(null);
    }

    // Returns the current date
    getDate() {
        const date = new Date();
        const dateFormatted = new Date(date);
        let month = '' + (dateFormatted.getMonth() + 1);
        let day = '' + dateFormatted.getDate();
        const year = '' + dateFormatted.getFullYear();
        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }
        return [day, month, year].join('-'); // Today's date in DD-MM-YYYY format
    }

    /** To get the current user email saved in DB */
    getGoogleUserEmail(callback) {
        this.appSettings.getAppSettingData('GoogleUserEmail').then((data) => {
            if (data) { this.googleUserEmail = String(data.value); }
            callback(data.value);
        }).catch((error) => {
            console.log('Failed to get Google User Info From Invoice Config Table: ', error);
            callback(null);
        });
    }

    /** To save the updated google account email in DB for first time user */
    SaveGoogleAccount(GoogleUserEmail: string) {
        this.appSettings.updateAppSetting(GoogleUserEmail, 'GoogleUserEmail').then(success => {
            this.googleUserEmail = GoogleUserEmail; // Setting the email once the value is updated to DB
        }).catch((error) => { // In case an error occurred while updating the value in DB
            console.log('Error updating Google Account in DB: ', error);
        });
    }

    /** To generate the backup for the current DB */
    backupDB(callback) {
        this.db.downloadSQLDbFile((res) => {
            if ('success' === res) {
                console.log('DB downloaded to SQL File Successfully!');
                this.toast.success('Backup Successful!');
                let fileName = this.db.backupFileName;
                if (undefined === fileName || null === fileName) { fileName = ''; }
                this.uploadFile(fileName, (response) => {
                    console.log('Google Drive File Upload Response: ', response);
                    if (response) {
                        this.saveLastBackupDate(this.db.backupFileName, () => { // Saving the last backup date in DB
                            this.appSettings.updateAppSetting(this.db.backupFileSize, 'PreviousBackupFileSize');
                            callback(response);
                        });
                    } else { callback(null); }
                });
            } else {
                console.log('Failed to generate SQL file!');
                this.toast.error('Unable to generate Backup');
                callback(null);
            }
        });
    }

    /** To remove the previously auto-backup file from the google drive */
    removeFile(fileId: string, callback) {
        // const GoogleDrive = (window as any).plugins.gdrive;
        // if ('none' === this.network.type) {
        //     this.toast.warningBottom('No Internet Connectivity, Kindly connect to Wi-Fi or turn on mobile internet!');
        //     this.logService.WarningMessage(ConstMessages.WARNCode.WARN_REGISTER_BUSINESS, ConstMessages.WARNCode.WARN_INTERNET_ACCESS);
        //     callback(null);
        //     return;
        // } else {
        //     this.loginToGoogleAccount((result) => {
        //         if (result) {
        //             console.log('Google Login Success: ', result);
                     // tslint:disable-next-line:max-line-length
        //             if (!this.googleUserEmail.length) { this.SaveGoogleAccount(result.email); } // Saving the google account in DB in case of first time login
        //             document.addEventListener('DeviceReady', () => {
        //                 GoogleDrive.deleteFile(fileId, (response) => { // Calling google drive to trash the file on Google Drive
        //                     console.log('File Removed from Google Drive: ', response);
        //                     if (response) { callback('success'); } else { callback(null); }
        //                     return;
        //                 }, (error) => {
        //                     console.log('Error in deleting file from Google Drive: ', error);
        //                     console.log('error ', error);
        //                     callback(null);
        //                     return;
        //                 });
        //             });
        //         } else { callback(null); }
        //     });
        // }
    }

    /** To save the previous backup date in DB */
    saveLastBackupDate(fileName: string, callback) {
        const fileData = fileName.split('_'); // File name is DigiBill_date_time_version.dbBackup
        const date = fileData[1].split('-').reverse().join('-'); // Backup Date from file data
        const time = fileData[2].split('.').join(':'); // Backup Time from file data
        this.lastBackupDate = new Date(date).toISOString().split('T')[0] + ' ' + time;
        this.appSettings.updateAppSetting(this.lastBackupDate, 'PreviousBackupDate'); // Saving the previous backup date in DB
        callback('done');
    }

    /** To set the next backup date if the backup schedule is updated */
    setNextBackupDate(durationSelected: string, callback) {
        const nextBackupDate = new Date();
        // tslint:disable-next-line:max-line-length
        const TodaysTime = new Date((nextBackupDate).getTime() - (nextBackupDate).getTimezoneOffset() * 60000).toISOString().split('T')[1].split('.')[0];
        switch (durationSelected) {
            case 'daily': {
                nextBackupDate.setDate(nextBackupDate.getDate() + 1); // Scheduling backup for next day
                const NextBackupDate = (new Date(nextBackupDate)).toISOString().split('T')[0] + ' ' + TodaysTime;
                this.appSettings.updateAppSetting(NextBackupDate, 'NextBackupDate'); // Saving the next backup date in DB
                this.toast.success('Next backup scheduled for tomorrow');
                callback(NextBackupDate);
                break;
            }
            case 'weekly': {
                nextBackupDate.setDate(nextBackupDate.getDate() + 7); // Scheduling backup for next week
                const NextBackupDate = (new Date(nextBackupDate)).toISOString().split('T')[0] + ' ' + TodaysTime;
                this.appSettings.updateAppSetting(NextBackupDate, 'NextBackupDate'); // Saving the next backup date in DB
                this.toast.success('Next backup scheduled for next week');
                callback(NextBackupDate);
                break;
            }
            case 'monthly': {
                const today = new Date(nextBackupDate.getFullYear(), nextBackupDate.getMonth(), nextBackupDate.getDay());
                today.setMonth(today.getMonth() + 1); // Scheduling backup for next month
                const NextBackupDate = (new Date(today)).toISOString().split('T')[0] + ' ' + TodaysTime;
                this.appSettings.updateAppSetting(NextBackupDate, 'NextBackupDate'); // Saving the next backup date in DB
                this.toast.success('Next backup scheduled for next month');
                callback(NextBackupDate);
                break;
            }
            case 'never': {
                const NextBackupDate = ''; // Removing the date for next backup schedule
                this.appSettings.updateAppSetting('', 'NextBackupDate'); // Removing the next backup date in DB
                this.toast.success('Auto backup schedule is cancelled');
                callback(NextBackupDate);
                break;
            }
            case 'default': {
                this.toast.error('Failed to get next backup duration! Please try again');
                return;
            }
        }
    }

    /** To login to the Google Account if the user is logged out or first time login */
    loginToGoogleAccount(callback) {
        // this.google.login({}).then((result) => { // On success
        //     console.log('Logged in to Google Account Successfully: ', result);
        //     callback(result);
        // }).catch((error) => { // In case an error occurred while logging in to google account
        //     console.log('Error logging in to another Google Account: ', error);
        //     this.toast.error('Failed to login to Google Account!');
        //     console.log('error ', error);
        //     callback(null);
        // });
        callback(null);
    }
}
