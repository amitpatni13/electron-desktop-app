import { Component } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { RegisterUser } from '../Register/register';
import { SignInUser } from '../SignIn/signin';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantMessages } from 'src/Constants/constant';
@Component({
  selector: 'app-intro',
  templateUrl: 'intro.html',
})
// tslint:disable-next-line:component-class-suffix
export class IntroPage {
  slideSkipText = 'Skip';
  slideNextText = 'Next';
  constructor(private dbProvider: DatabaseProvider, private router: Router) {
  }

  // Navigate to specific slide
  slideNext() {
  }

  slideChanged() {
  }

  ionViewDidLoad() {
    this.dbProvider.fillDatabase(ConstantMessages.DEFAULT_DATABASE.NAME);
  }

  RegisterUser() {
    this.router.navigate(['RegisterUser']);
  }

  UserSignIn() {
    this.router.navigate(['SignInUser']);
  }

}
