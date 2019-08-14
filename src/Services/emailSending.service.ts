import { Injectable } from '@angular/core';
import { Http, Headers,  RequestOptions } from '@angular/http';
import { ConstMessages } from '../Constants/ErrorMessages';
// import { ToasterService } from './toastMessages.service';
@Injectable()
export class EmailSending {
    apiUrl: any = ConstMessages.EmailSending.API_URL;
    constructor(public http: Http) { }
    // Sending the Email Through Send Grid API
    EmailSending(EMAILData: any, data: number) {
        return new Promise((resolve, reject) => {
           const reqBody = {
                // tslint:disable-next-line:object-literal-shorthand
                EMAILData: EMAILData
            };
           let APIKey = '';
           APIKey = ConstMessages.API_KEY.Prod_API_Key;
           const header = new Headers();
           header.append('x-api-key', APIKey);
           const options = new RequestOptions({ headers: header });
           this.http.post(this.apiUrl, reqBody, options)
                .subscribe(res => {
                    if (data === 1) {
                      //  this._toasterService.success(ConstMessages.EmailSending.EMAIL_SENT)
                    }
                    resolve(res.json());
                }, (err) => {
                    reject(err);
                    if (data === 1) {
                      //  this._toasterService.error(ConstMessages.EmailSending.EMAIL_FAILED_SEND)
                    }
                });
        });
    }
}
