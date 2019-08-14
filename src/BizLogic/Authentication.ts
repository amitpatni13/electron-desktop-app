import { Injectable } from '@angular/core';
import { SignInUser } from '../pages/SignIn/signIn';
import { ErrorLogService } from '../Services/errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { BusinessProfileData } from '../Services/business_profile.service';
import { ToasterService } from '../Services/toastMessage.service';
import { BusinessUserServerCheck } from '../Services/businessUserServerCheck.service';
import { DatabaseProvider } from '../providers/database/database';
import { AppSettings } from '../Services/appSetting.service';
import { ConstantMessages } from '../Constants/constant';
import { Observable } from 'rxjs';

@Injectable()
export class Authentication {
    registeredCredentials: User = { mobile: null, pass: null };
    registerDate: any;
    ExpiryDate: any;
    isUserOnBoardedFlag: any;
    LoginDetailsEntered: User = { mobile: null, pass: null };
    RemainingDaysForLocal: number;
    device = { serial: '' };

    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, private appSetting: AppSettings, private toasterService: ToasterService, private BusinessVerify: BusinessUserServerCheck,
                public logService: ErrorLogService, private businessProfile: BusinessProfileData) {
    }
    // get the Register User details stored in the local storage
    async getRegisteredUserCredentials() {
        // check in the local database whether contact number and password is available
        await this.businessProfile.getMainProfileData().then(async (user) => {
            // tslint:disable-next-line:max-line-length
            if (user && user[0] && user[0].ContactNumber !== '' && user[0].ContactNumber !== undefined && user[0].ContactNumber !== null && user[0].Password !== '' && user[0].Password !== undefined && user[0].Password != null) {
                // check for the register day for expiry date
                const  ExpiryDate = new Date(user[0].ExpiryDate);
                this.RemainingDaysForLocal = ExpiryDate.getTime() + 259200000 - Date.now();
                // if remaining days are more than 0 then let him login
                this.registeredCredentials.mobile = user[0].ContactNumber;
                this.registeredCredentials.pass = user[0].Password;
                if (Number(this.RemainingDaysForLocal) > 0) {
                    console.log('Days Remaining are more than 0 Days');
                } else {
                    if (Number(user[0].CampaignID) !== 2) {
                        // this._appSetting.updateAppSetting('1', 'ReadMode');
                        this.appSetting.updateAppSetting('0', 'isSubscriptionActive');
                    }
                }
                const navElementBusinessName = document.getElementById('business_name');
                const navElementBusinessNumber = document.getElementById('business_mobileNo');
                if (navElementBusinessName && navElementBusinessNumber) {
                    navElementBusinessName.textContent = user[0].Name;
                    navElementBusinessNumber.textContent = String(user[0].ContactNumber);
                }
            } else {
                // if details are not available on the local database then search on the server
                  // tslint:disable-next-line:max-line-length
                await this.BusinessVerify.getBusinessDataFromServer(String(this.LoginDetailsEntered.mobile), null,
                 this.device.serial + '_' + this.LoginDetailsEntered.mobile).then(BusinessDetailsRes => {
                   if (Object.keys(BusinessDetailsRes).length) {
                        // tslint:disable-next-line:max-line-length
                        // if response is http error repsonse then show the error message for internet connection and return to the same page
                        if (BusinessDetailsRes.name === 'HttpErrorResponse') {
                           // this.translateService.get('No Internet Connectivity').subscribe(ToastMessage => {
                                this.toasterService.error('No Internet Connectivity');
                           // });
                        } else {
                            // check if the UUID matches with the device of not
                            // tslint:disable-next-line:max-line-length
                            if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null && BusinessDetailsRes[0].ContactNumber !== ConstantMessages.DEMO_MOBILE_NUMBER && BusinessDetailsRes[0].UUID !== this.device.serial + '_' + this.LoginDetailsEntered.mobile) {
                               // this.event.publish('ShowRegisterMessage');
                            } else {
                                // check for the register day for expiry date
                                const  RemainingDays = Number(BusinessDetailsRes[0].ExpiryDate) + 259200000 - Date.now();
                                if (Number(RemainingDays) <= 0 && Number(BusinessDetailsRes[0].CampaignID) !== 2) {
                                    // this._appSetting.updateAppSetting('1', 'ReadMode');
                                    this.appSetting.updateAppSetting('0', 'isSubscriptionActive');
                                }
                                // if password matches with the server details then show the toast message with the remaining days
                                // tslint:disable-next-line:max-line-length
                                if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null && BusinessDetailsRes[0].Password === this.LoginDetailsEntered.pass) {
                                    const navElementBusinessName = document.getElementById('business_name');
                                    const navElementBusinessNumber = document.getElementById('business_mobileNo');
                                    if (navElementBusinessName && navElementBusinessNumber) {
                                        // tslint:disable-next-line:max-line-length
                                        if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null) { navElementBusinessName.textContent = BusinessDetailsRes[0].Name; }
                                        // tslint:disable-next-line:max-line-length
                                        if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null) { navElementBusinessNumber.textContent = String(BusinessDetailsRes[0].ContactNumber); }
                                    }
                                }
                                // add the details to the local database with the date on which the user hase register and the expiry date
                                // tslint:disable-next-line:max-line-length
                                if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null) { this.registeredCredentials.mobile = BusinessDetailsRes[0].ContactNumber; }
                                // tslint:disable-next-line:max-line-length
                                if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] != null) { this.registeredCredentials.pass = BusinessDetailsRes[0].Password; }
                                const BusinessData = BusinessDetailsRes[0];
                                this.businessProfile.updateProfileDataFromServer(BusinessData).then(res => {
                                    // update the token in local db
                                    this.appSetting.updateAppSetting(BusinessDetailsRes[0].TokenID, 'PushNotificationTokenID');
                                    // tslint:disable-next-line:max-line-length
                                    if (Number(RemainingDays) > 0 && BusinessData !== undefined && BusinessData != null && (Number(BusinessData.CampaignID) === 3 || Number(BusinessData.CampaignID) === 1)) {
                                        this.appSetting.updateAppSetting('1', 'isSubscriptionActive');
                                    }
                                });
                                // update the user reinstall date in the server column
                                // tslint:disable-next-line:max-line-length
                               // this.BusinessVerify.InsertReinstallDate(String(this.registeredCredentials.mobile), this.device.serial + '_' + this.registeredCredentials.mobile);
                            }
                        }
                        // tslint:disable-next-line:max-line-length
                       // this.hideWalkThroughFlow(); // To hide the walk-through flow for returning user signing in, after re-installing the app
                    } else {
                       // this.translateService.get(ConstMessages.BusinessDataCapture.INVALID_CREDIT).subscribe(ToastMessage=>{
                            this.toasterService.warning(ConstMessages.BusinessDataCapture.INVALID_CREDIT);
                       // });
                    }
                });
            }
        });
    }
    // validate the session if true send him to the home page else send him to signIn page
    async validateAuthSession(escapeReInvoke = false) {
//         return await this.businessProfile.getSessionData('isDigiBillSessionValid').then(async (result) => {
//             if (result != undefined && result != null) {
//                 console.log('result.session :' + result.session);
//                 if (Boolean(Number(result.session))) {
//                     // if remaining days are less than 30 days show him toast message with remaining days
//                     if (this.RemainingDaysForLocal < 2592000000) {
//                         this.RemainingDaysForLocal = this.RemainingDaysForLocal - 259200000;
// tslint:disable-next-line:max-line-length
//                         //  convert milliseconds to the number of days remain= 24 is for hours,60 for mins,60 for seconds,1000 milliseconds
//                         const DaysRemain = Math.floor(Number(this.RemainingDaysForLocal) / (24 * 60 * 60 * 1000));
//                         if (DaysRemain > 0) {
//                        // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//                        // this.translateService.get(DaysRemain + ConstMessages.BusinessDataCapture.REMAINING_DAYS).subscribe(ToastMessage => {
//                                 this.toasterService.warning(DaysRemain + ConstMessages.BusinessDataCapture.REMAINING_DAYS);
//                             });
//                         }
//                     }
//                     // tslint:disable-next-line:max-line-length
// // console.log('isDigiBillSessionValid is true .. check whether the user is already onboraded ' + Boolean(Number(result.session)));
// return await this.businessProfile.getMainProfileData().then(async response => {
// tslint:disable-next-line:max-line-length
//                         // check if the user has registered before ,if yes then fetch isUserOnBorded flag from server or fetch from local DB
//                         // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//                         if (response[0].ContactNumber !== '' && response[0].ContactNumber !== undefined && response[0].ContactNumber != null && response[0].Password !== '' && response[0].Password !== undefined && response[0].Password != null) {
//                             // get the read mode data from the server
//                             console.log('inside the contact');
//                             if ('none' === this.network.type) {
//                                 console.log('No Internet Connectivity, Kindly connect to Wi-Fi or turn on mobile internet!');
//                             } else {
//                                 // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//                                 await this._BusinessVerify.getBusinessDataFromServer(String(response[0].ContactNumber), null, this.device.serial + '_' + response[0].ContactNumber).then(async BusinessDetailsRes => {
//                                     if (Object.keys(BusinessDetailsRes).length) {
//                                         console.log('inside the read mode verify');
//                                         // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//                                         if (BusinessDetailsRes[0] !== undefined && BusinessDetailsRes[0] !== null && BusinessDetailsRes[0].ContactNumber !== ConstantMessages.DEMO_MOBILE_NUMBER && BusinessDetailsRes[0].UUID !== this.device.serial+"_"+BusinessDetailsRes[0].ContactNumber && Number(BusinessDetailsRes[0].CampaignID) == 2) {
//                                             console.log('Update the read Only Mode');
//                                             await this.appSetting.updateAppSetting('1', 'ReadMode');
//                                         }
//                                     } else {
//                                         console.log('no data available')
//                                     }
//                                 })
//                             }
//                             const OnBoardingData = this.isUserOnBoarded(Number(result.session), false);
//                             return await OnBoardingData;
//                         } else {
//                             const OnBoardingData = this.isUserOnBoarded(Number(result.session), true);
//                             return await OnBoardingData;
//                         }
//                     });
//                  // else if (!escapeReInvoke) {
//                   //  console.log('isDigiBillSessionValid is false loading sign in page');
//                   //  return { pageName: 'signin', pageContext: SignInUser };
//             }
//         });
    }
    // if the User is OnBoarded we need to load home main page or we have to load BusinessProfile page
    async isUserOnBoarded(isDigiBillSessionValid, freshUser) {
        if (freshUser) {
            // tslint:disable-next-line:max-line-length
            return await this.BusinessVerify.getBusinessDataFromServer(String(this.LoginDetailsEntered.mobile), null, this.device.serial + '_' + this.LoginDetailsEntered.mobile).then(BusinessDetailsRes => {
                let OnBoardingData: any;
                if (Object.keys(BusinessDetailsRes).length) {
                    // if response is http error repsonse then show the error message for internet connection and return to the same page
                    if (BusinessDetailsRes.name) {
                       // this.translateService.get('No Internet Connectivity').subscribe(ToastMessage => {
                                this.toasterService.error('No Internet Connectivity');
                          //  });
                     } else {
                   this.isUserOnBoardedFlag = BusinessDetailsRes[0].UserOnboarded;
                   console.log('BusinessDetailsRes[0].UserOnboarded :', BusinessDetailsRes[0].UserOnboarded);
                   if (isDigiBillSessionValid === 1 && Number(this.isUserOnBoardedFlag) !== 1) {
                            OnBoardingData = {
                                pageName: 'businessProfile',
                              //  pageContext: BusinessProfilePage
                            };
                            return OnBoardingData;
                        } else {
                            OnBoardingData = {
                                pageName: 'home',
                                // pageContext: HomeMain
                            };
                            return OnBoardingData;
                        }
                    }
                } else {
                    OnBoardingData = {
                        pageName: 'businessProfile',
                     //   pageContext: BusinessProfilePage
                    };
                }
            });
        } else {
            return await this.businessProfile.getSessionData('isUserOnBoarded').then((result) => {
                console.log('isUserOnBoarded in local DB :', result.session);
                let OnBoardingData: any;
                if (isDigiBillSessionValid === 1 && Number(result.session) !== 1) {
                    OnBoardingData = {
                        pageName: 'businessProfile',
                       // pageContext: BusinessProfilePage
                    };
                    return OnBoardingData;
                } else {
                    OnBoardingData = {
                        pageName: 'home',
                      //  pageContext: HomeMain
                    };
                    return OnBoardingData;
                }
            });
        }

    }

    // get the isDigiBillSessionValid value from the local DB
    async getIsDigiBillSessionValid() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT (InvoiceConfigFieldValue) from InvoiceConfiguration WHERE InvoiceConfigFieldName="isDigiBillSessionValid"', []).then((data: any) => {
            console.log('get isDigiBillSessionValid in DB :' + data[0].InvoiceConfigFieldValue);
            return data[0].InvoiceConfigFieldValue;
        });
    }
    // validate the credentials for the users
    public validateAuthToken(credentials: User) {
        if (!credentials.mobile || !credentials.pass) {
            return Observable.throw('Please insert credentials');
        } else {
            return Observable.create((observer) => {
                credentials.pass = credentials.pass.trim();
                console.log(credentials.mobile);
                console.log(credentials.pass);
                this.LoginDetailsEntered.mobile = credentials.mobile;
                this.LoginDetailsEntered.pass = credentials.pass;
                this.getRegisteredUserCredentials().then(() => {
                    // Checking if the Values of Mobile No and Password is set for auth...
                    // tslint:disable-next-line:max-line-length
                    console.log('Login Credentials: Mobile: ' + this.registeredCredentials.mobile + ' Password: ' + this.registeredCredentials.pass);
                    // tslint:disable-next-line:max-line-length
                    const access = (credentials.pass === this.registeredCredentials.pass && credentials.mobile === this.registeredCredentials.mobile);
                    console.log(credentials.pass === this.registeredCredentials.pass);
                    console.log(credentials.mobile === this.registeredCredentials.mobile);
                    // tslint:disable-next-line:max-line-length
                    console.log(credentials.pass === this.registeredCredentials.pass && credentials.mobile === this.registeredCredentials.mobile);
                    if (access) {
                        // this.storage.set('isDigiBillSessionValid', true);
                        this.businessProfile.UpdateSession(1);
                        console.log('isDigiBillSessionValid set to true');
                    } else {
                        // this.storage.set('isDigiBillSessionValid', false);
                        this.businessProfile.UpdateSession(0);
                        console.log('isDigiBillSessionValid set to false');
                    }
                    observer.next(access);
                    observer.complete(); // At this point make a request to your back end to make a real check!
                });
            });
        }
    }
    // validate the user details passed in the parameters
    public validateLogin(passedCredential) {
        passedCredential.pass = passedCredential.pass.trim();
        console.log(passedCredential.mobile);
        console.log(passedCredential.pass);
        this.validateAuthToken(passedCredential).subscribe(allowed => {
            console.log(passedCredential.mobile);
            if (allowed) {
                // this.storage.set('isDigiBillSessionValid', true);
                this.businessProfile.UpdateSession(1);

            } else {
                //  this.storage.set('isDigiBillSessionValid', false);
                this.businessProfile.UpdateSession(0);
            }
        },
            error => {
                console.log('Login Failed');
            });
    }
    public invalidateSession() {
        // this.storage.set('isDigiBillSessionValid', false);
        this.businessProfile.UpdateSession(0);
        return SignInUser;
    }
    updateAllTablesForAutoIncrement(Sale, Purchase, SaleItem, PurchaseItem, Item, Category, Expense, Party) {
        const SequenceData = [Sale, Purchase, SaleItem, PurchaseItem, Item, Category, Expense, Party];
        // tslint:disable-next-line:max-line-length
        const TableDate = ['SalesInvoices', 'PurchaseInvoices', 'SalesInvoiceItems', 'PurchaseInvoiceItems', 'Item', 'ItemCategory', 'ExpenseList', 'Party'];
        // tslint:disable-next-line:forin
        for (const index in TableDate) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE sqlite_sequence SET seq = ? WHERE name = ?', [SequenceData[index], TableDate[index]]).then(data => {
                console.log('User Data Updated in DB'); console.log(data);
            }, err => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_DB_UPDATE_FAIL, ' ;SRC - Service Class:Authentication  method:updateAllTablesForAutoIncrement', err);
                return err;
            });
        }

    }

    // /** To not show the walk-through flow for existing users that are signing-in after app re-install */
    // hideWalkThroughFlow() {
    //     // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    //     this.appSetting.updateAppSetting(1, 'isSaleWalkThroughCompleted'); // Not showing the Sale Walk-through to existing user that are signing-in after app re-install
    //     // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    //     this.appSetting.updateAppSetting(1, 'isInventoryWalkThroughCompleted'); // Not showing the Inventory Walk-through to existing user that are signing-in after app re-install
    // }
}

export interface User {
    pass: string;
    mobile: number;
}


















