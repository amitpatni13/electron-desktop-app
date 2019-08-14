import { Component } from '@angular/core';
import { RegisterUser } from '../Register/register';
import { Authentication, User } from '../../BizLogic/Authentication';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
// tslint:disable-next-line:component-class-suffix
export class SignInUser {
  signinMsg = '';
  signInUserCredentials: User = {mobile: null, pass: null};


  constructor(private auth: Authentication, private router: Router) {
    this.signinMsg = '';
    this.auth.validateAuthSession(true).then(returnPage => {

      // if (returnPage && returnPage.pageName === 'home') {
      //   this.router.navigate([returnPage.pageName]);
      // }
    });
  }

  NavigateToRegister() {
    this.router.navigate(['RegisterUser']);
  }

  public createAccount() {
    this.router.navigate(['RegisterUser']);
  }

  public login() {
    // this.showLoading()
    this.signinMsg = '';

    this.auth.validateAuthToken(this.signInUserCredentials).subscribe(allowed => {

      this.auth.validateAuthSession().then(returnPage => {

        // if (returnPage.pageName === "home") {
        //   this.router.navigate([returnPage.pageName]);
        // } else {
        //   this.signinMsg = 'Invalid Credentials Entered!'
        // }
      });
    },
      error => {
        console.log('Error occurred while login');
      });

  }

  showLoading() {
  }

  showError(text) {
  }

}
