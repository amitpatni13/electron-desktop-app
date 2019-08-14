import { Component } from '@angular/core';
import { HttpOtpService } from '../../Services/httpOtp.service';
// import { TermsandconditionsPage } from "../termsandconditions/termsandconditions";
// import { PrivacypolicyPage } from "../privacypolicy/privacypolicy";
import {  FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationHelper } from '../../Utilities/Validator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: 'register.html',
  providers: [HttpOtpService]
})
// tslint:disable-next-line:component-class-suffix
export class RegisterUser {
  RegistrationForm: FormGroup;

  sendOTP: string;
  createSuccess = false;
  businessname: string;
  mobileno: any;
  msg = '';
  message = '';
  error: any;

  constructor(private router: Router, private httpOtpService: HttpOtpService, public formBuilder: FormBuilder) {
    // this.Validation();
  }

  sendOtp() {
    // if (this.RegistrationForm.valid) {
    //   this.httpOtpService.getOtp(this.mobileno).subscribe(res => {

    //     console.log(res);

    //     if (res.status !== 200) {
    //       this.error = res.statusText;
    //       return this.error;
    //     } else {
    //       return res.json();
    //     }
    //   });
    //   console.log('businessname' + this.businessname);
    //   this.router.navigate(['VerifyUser', { registeredMobile: this.mobileno }]);
    // } else {
    //   // Toast message
    //   let toast = this.toastCtrl.create({
    //     message: 'Oops, Incorrect values!',
    //     duration: 1000,
    //     position: 'top',
    //     cssClass: "toastWarning"
    //   });
    //   toast.onDidDismiss(() => {
    //     console.log('Dismissed toast');
    //   });
    //   toast.present();
    // }
    return null;
  }

  // Validation() {
  //   this.RegistrationForm = this.formBuilder.group({
  //     control_businessName: ['', [Validators.required, ValidationHelper.alphanumericValidator_Space]],
  // tslint:disable-next-line:max-line-length
  //     control_mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), ValidationHelper.numberValidator]],
  //   });
  // }
  NavigateToSignIn() {
    this.router.navigate(['SignInUser']);
  }

  goToTermsPage() {
    // this.navCtrl.push(TermsandconditionsPage);
  }

  goToPrivacyPolicyPage() {
    // this.navCtrl.push(PrivacypolicyPage)
  }
}
