import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ConstMessages } from '../Constants/ErrorMessages';
import { EmailSending } from './emailSending.service';
import { isDevMode } from '@angular/core';
@Injectable()
export class ErrorLogService {

    // File path where the file is stored
    // FileStoragePath = this.file.externalRootDirectory + 'DigiBill';
    fileHeader: string = ConstMessages.ErrorLogging.FILE_HEADER;
    fileName: string = ConstMessages.ErrorLogging.FILE_NAME;
    columnSeparator: string = ConstMessages.ErrorLogging.COLUMN_SEPARATOR;
    // tslint:disable-next-line:no-inferrable-types
    url: string = '';
    // tslint:disable-next-line:max-line-length
    constructor(private emailService: EmailSending, public http: Http) { }

    // error message to be stored in the file
    ErrorMessage(msg: string, src: any, param: any) {
        // let FullErrorMessage;
        // let lastMessageIndex;
        // // getting the logger from the config file stored in /assets/setting.json
        // const log = this.loggingService.getLogger('ErrorLogger');
        // // logging the error message and storing it in local variable
        // log.error('ErrorMessage', param);
        // // getting all the error message stored in the local variable
        // FullErrorMessage = this.loggingService.getLogMessages();
        // lastMessageIndex = FullErrorMessage.length - 1;
        // this.appVersion.getVersionNumber().then( Appversion => {
        //     this.file.readAsText(this.FileStoragePath, this.fileName).then(DataExist => {
        //         if (DataExist.includes(this.fileHeader)) {
        // tslint:disable-next-line:max-line-length
        //             if (FullErrorMessage[lastMessageIndex].message[0] !== undefined && FullErrorMessage[lastMessageIndex].message[0] !== null) {
        // tslint:disable-next-line:max-line-length
        //                 this.file.writeFile(this.FileStoragePath, this.fileName, msg + src + ' AppVersion:' + Appversion + this.columnSeparator + JSON.parse(FullErrorMessage[lastMessageIndex].message[0]).message
        //                     + this.columnSeparator + FullErrorMessage[lastMessageIndex].timeStamp
        //                     + '\n', { append: true, replace: false });
        //             }

        //         } else {
        // tslint:disable-next-line:max-line-length
        //             if (FullErrorMessage[lastMessageIndex].message[0] !== undefined && FullErrorMessage[lastMessageIndex].message[0] !== null) {
        //                 this.file.writeFile(this.FileStoragePath, this.fileName, this.fileHeader + '\n'
        //                     + msg + src + JSON.parse(FullErrorMessage[lastMessageIndex].message[0]).methodName + this.columnSeparator
        //                     + JSON.parse(FullErrorMessage[lastMessageIndex].message[0]).message
        //                     + this.columnSeparator + FullErrorMessage[lastMessageIndex].timeStamp + '\n', { replace: true });
        //             }
        //         }
        //     });
        // });
    }
    // function to log errors into RDS
    async logErrorsIntoRDS(contactNumber: any, data: any) {
        console.log('contact Number :' + contactNumber + ' data : ' + data);
        const reqBody = {
            ' logs': data.toString(),
            ' contactNumber': contactNumber.toString()
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { this.url = ConstMessages.ErrorLogging.GATEWAY_URL_DEV; } else { this.url = ConstMessages.ErrorLogging.GATEWAY_URL; }
        return await this.http.post(this.url, reqBody, options).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server(error log service) : ', response + '\n');
            const respErrMsg = JSON.parse(JSON.parse(JSON.stringify(response))._body).errorMessage;
            console.log('value in errorMessage tag in the response :' + respErrMsg);
            // tslint:disable-next-line:max-line-length
            if (!isDevMode()) { this.SendErrorLogsToEmailID(data.toString(), contactNumber.toString()); } // send the error logs to the email iD
            return respErrMsg.toString();
        }, (err) => {
            console.log('Error occurred while uploading the logs : ', err);
            return '';
        });
    }

    // warning message to be stored in the file
    WarningMessage(msg: string, param: any) {
        // let FullErrorWarningMessage;
        // // getting the logger from the config file stored in /assets/setting.json
        // const log = this.loggingService.getLogger('ErrorLogger');
        // // logging the error message and storing it in local variable
        // log.warn('WarningMessage', param);
        // // getting all the error message stored in the local variable
        // FullErrorWarningMessage = this.loggingService.getLogMessages();
        // const lastMessageIndex = FullErrorWarningMessage.length - 1;
        // // storing the last message in the file on the new line
        // this.file.readAsText(this.FileStoragePath, this.fileName).then(DataExist => {
        //     if (DataExist.includes(this.fileHeader)) {
        // tslint:disable-next-line:max-line-length
        //         this.file.writeFile(this.FileStoragePath, 'FileLoggerData.txt', msg + this.columnSeparator + JSON.parse(FullErrorWarningMessage[lastMessageIndex].message[0]).message
        //             + this.columnSeparator + FullErrorWarningMessage[lastMessageIndex].timeStamp
        //             + '\n', { append: true, replace: false });
        //     } else {
        //         this.file.writeFile(this.FileStoragePath, this.fileName, this.fileHeader + '\n'
        //             + msg + this.columnSeparator
        //             + JSON.parse(FullErrorWarningMessage[lastMessageIndex].message[0]).message
        //             + this.columnSeparator + FullErrorWarningMessage[lastMessageIndex].timeStamp + '\n', { replace: true });
        //     }
        // });
    }

    // Send Error Logs to Email
    SendErrorLogsToEmailID(ErrorLogs, MobileNumber) {
        let customMessage;
        let errorMessage;
        let timeStamp;
        const csvRows = this.getCsvRows(ErrorLogs);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < csvRows.length; i++) {
            customMessage = csvRows[i][0];
            errorMessage = csvRows[i][1];
            timeStamp = csvRows[i][2];
            const Data = {
                personalizations: [
                    {
                        to: [
                            {
                                email: ConstMessages.EmailSending.ERROR_LOG_MAILS // the email sent to
                            }
                        ],
                        subject: `Error Log From ${MobileNumber}` // email subject
                    }
                ],
                from: {
                    email: ConstMessages.EmailSending.ERROR_LOG_MAILS  // who is sending the email
                },
                content: [
                    {
                        type: 'text/plain',
                        // tslint:disable-next-line:max-line-length
                        value: 'MobileNumber: ' + MobileNumber + '\r\n\r' + '  Custom Message: ' + customMessage + '\r\n\r' + '  Error Log: ' + errorMessage + '\r\n\r' + ' Time Stamp: ' + timeStamp
                    }
                ]
            };
            // sending the json data to the email sending service
            this.emailService.EmailSending(Data, 0);
        }

    }
    getCsvRows(allText) {
        // tslint:disable-next-line:prefer-const
        let allRowsArr = allText.split('$@$');
        if (allRowsArr) {
            // tslint:disable-next-line:prefer-const
            let noOfColumn = allRowsArr[0].split('$|$');
            let headerIndx;
            if (allRowsArr[0] === 'CustomMessage$|$ErrorMessage$|$TimeStamp') {
                headerIndx = 1;
            } else {
                headerIndx = 0;
            }
            // tslint:disable-next-line:prefer-const
            let lines = [];

            for (let columnNo = headerIndx; columnNo < allRowsArr.length; columnNo++) {
                const data = allRowsArr[columnNo].split('$|$');
                if (data.length === noOfColumn.length) {

                    const dataArr = [];
                    for (let j = 0; j < noOfColumn.length; j++) {
                        dataArr.push(data[j]);
                    }
                    lines.push(dataArr);
                }
            }
            return lines;
        }
    }
}
