import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConstMessages } from '../Constants/ErrorMessages';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpOtpService {
  otp = this.generateOtp();

  constructor(private http: Http) { }

  getOtp(mobileno) {
    // console.log(mobileno + ' ' + this.otp);

    // return this.http.get(ConstMessages.OtpConfig.SEND_OTP_URL +
    //   ConstMessages.OtpConfig.PARAM_AUTHKEY + '=' + ConstMessages.OtpConfig.AUTHKEY + '&' +
    //   ConstMessages.OtpConfig.PARAM_MOBILE + '=' + mobileno + '&' +
       // tslint:disable-next-line:max-line-length
    //   ConstMessages.OtpConfig.PARAM_MESSAGE + '=' + ConstMessages.OtpConfig.OTP_MESSAGE + this.otp + ConstMessages.OtpConfig.OTP_MESSAGE + '&' +
    //   ConstMessages.OtpConfig.PARAM_SENDERID + '=' + ConstMessages.OtpConfig.SENDERID + '&' +
    //   ConstMessages.OtpConfig.PARAM_OTP + '=' + this.otp
    // ).pipe(map(res => res.json()));
  }

  verifyotp(mobileno, otp) {
    // console.log(mobileno + ' ' + otp);
    // return this.http.get(ConstMessages.OtpConfig.VERIFY_OTP_URL +
    //   ConstMessages.OtpConfig.PARAM_AUTHKEY + '=' + ConstMessages.OtpConfig.AUTHKEY + '&' +
    //   ConstMessages.OtpConfig.PARAM_MOBILE + '=' + mobileno + '&' +
    //   ConstMessages.OtpConfig.PARAM_OTP + '=' + otp)
    //   .pipe(map(res => res.json()));
  }

  generateOtp() {
    return Math.round(Math.random() * 10000);
  }

}
