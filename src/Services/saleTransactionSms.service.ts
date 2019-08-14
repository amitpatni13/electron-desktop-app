import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConstMessages } from '../Constants/ErrorMessages';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SaleTransactionSms {

  constructor(private http: Http) { }

  // To generate the http response to send transactional sms
  SendTransactionSMS(PartyName, PartyMobileNumber, TotalAmount, InvoiceNumber) {
    // return this.http.get(ConstMessages.TransactionSms.SEND_TRANSACTION_URL +
    //   ConstMessages.SmsSendingDetails.PARAM_AUTH_KEY + '=' + ConstMessages.SmsSendingDetails.AUTH_KEY + '&' +
    //   ConstMessages.SmsSendingDetails.PARAM_MOBILE + '=' + PartyMobileNumber + '&' +
       // tslint:disable-next-line:max-line-length
    //   ConstMessages.SmsSendingDetails.PARAM_MESSAGE + '=' + ConstMessages.TransactionSms.TRANSACTION_MESSAGE + PartyName + ConstMessages.TransactionSms.TRANSACTION_MESSAGE1 + TotalAmount + ConstMessages.TransactionSms.TRANSACTION_MESSAGE2 + InvoiceNumber + ConstMessages.TransactionSms.TRANSACTION_MESSAGE3 + '&' +
    //   ConstMessages.SmsSendingDetails.PARAM_SENDER_ID + '=' + ConstMessages.SmsSendingDetails.SENDER_ID + '&' +
    //   ConstMessages.TransactionSms.PARAM_ROUTE + '=' + ConstMessages.TransactionSms.PARAM_ROUTE_VALUE
    // ).map(res => res.json());
  }
}
