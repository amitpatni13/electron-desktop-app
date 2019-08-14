import { Injectable } from '@angular/core';
import { IBusinessProfile } from '../Model/BusinessProfile.model';
import { DatabaseProvider } from '../providers/database/database';

// import { Storage } from '@ionic/storage';
// import { ConstMessages } from "../Constants/ErrorMessages";
// import { ErrorLogService } from "./errorLog.service";
@Injectable()
export class BusinessProfileData {

    constructor(private dbProvider: DatabaseProvider) { }

    // Update the Business Profile data
    async updateProfileData(profile: IBusinessProfile) {
        // tslint:disable-next-line:max-line-length
        const data = [profile.GSTRegistrationType, profile.TypeOfBiz, profile.ProductType, profile.Name, profile.Address, profile.City, profile.State, profile.PinCode, profile.GSTIN, profile.PAN, profile.CIN, profile.ContactNumber, profile.Email, profile.Password, profile.LogoImagePath];
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Business SET "GSTRegistrationType"=?, "TypeOfBiz" = ?, "ProductType" = ?,"Name" = ?, "Address" = ?, "City" = ?, "State" = ?, "PinCode" = ?, "GSTIN" = ?, "PAN" = ? , "CIN" = ?, "ContactNumber" = ?, "Email" = ?, "Password" = ?, "LogoImagePath" = ? WHERE IsActive = "1"', data).then(dataRow => {
            // this.storage.set('BusinessName', profile.Name)
            // this.storage.set('MobileNumber', profile.ContactNumber)
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update Business data on signUp only Name contact number and password
    updateBusinessUserDataOnSignUp(UserName, Mobile, Password) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('UPDATE Business SET Name = ?, ContactNumber = ?, Password = ? WHERE BusinessID = "1"', [UserName, Mobile, Password]).then(data => {
            console.log('User Data Updated in DB'); console.log(data);
            // this.storage.set('BusinessName', UserName);
            // this.storage.set('MobileNumber', Mobile);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update Business data on signUp only Name contact number and password
    updateBusinessUserDataOnSignIn(UserName, Mobile, Password, RegisterDate, ExpiryDate) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('UPDATE Business SET Name = ?, ContactNumber = ?, Password = ?,RegisterDate = ?,ExpiryDate = ? WHERE BusinessID = "1"', [UserName, Mobile, Password, RegisterDate, ExpiryDate]).then(data => {
            console.log('User Data Updated in DB'); console.log(data);
            // this.storage.set('BusinessName', UserName);
            // this.storage.set('MobileNumber', Mobile);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update Profile Data Coming From Server
    updateProfileDataFromServer(profile: IBusinessProfile) {
        profile.RegisterDate = new Date(Number(profile.RegisterDate)).toISOString().split('T')[0];
        profile.ExpiryDate = new Date(Number(profile.ExpiryDate)).toISOString().split('T')[0];
        // tslint:disable-next-line:max-line-length
        const data = [profile.TypeOfBiz, profile.ProductType, profile.Name, profile.Address, profile.City, profile.State, profile.PinCode, profile.GSTIN, profile.PAN, profile.CIN, profile.ContactNumber, profile.Email, profile.Password, profile.RegisterDate, profile.ExpiryDate, profile.GSTRegistrationType, profile.CampaignID];
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('UPDATE Business SET "TypeOfBiz" = ?, "ProductType" = ?,"Name" = ?, "Address" = ?, "City" = ?, "State" = ?, "PinCode" = ?, "GSTIN" = ?, "PAN" = ? , "CIN" = ?, "ContactNumber" = ?, "Email" = ?, "Password" = ?,"RegisterDate"=?,"ExpiryDate" =?,"GSTRegistrationType"=?,"CampaignID"=? WHERE BusinessID = "1"', data).then(dataRow => {
            // this.storage.set('BusinessName', profile.Name);
            // this.storage.set('MobileNumber', profile.ContactNumber);
            return dataRow;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Update Business data on signUp only Name contact number and password
    updateBusinessRegisterDetails(RegisterDate, ExpiryDate) {
        RegisterDate = new Date(Number(RegisterDate)).toISOString().split('T')[0];
        ExpiryDate = new Date(Number(ExpiryDate)).toISOString().split('T')[0];
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('UPDATE Business SET RegisterDate = ?,ExpiryDate = ? WHERE BusinessID = "1"', [RegisterDate, ExpiryDate]).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update the Business Password
    updateBusinessUserPassword(Password) {
        return this.dbProvider.executeSql('UPDATE Business SET Password = ? WHERE IsActive = "1"', [Password]).then(data => {
            console.log('User Data Updated in DB'); console.log(data);
            // this.storage.set('DigiBill_Pass', Password);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get the Details for App License
    async getAppLicenseProfileData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT  CampaignID,Name , Email ,ContactNumber, RegisterDate , ExpiryDate  FROM Business WHERE IsActive = "1"', []).then((data: any) => {
            const AppLicenseProfileData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    AppLicenseProfileData.push({
                        Name: dataRow.Name,
                        Email: dataRow.Email,
                        RegisterDate: dataRow.RegisterDate,
                        ExpiryDate: dataRow.ExpiryDate,
                        ContactNumber: dataRow.ContactNumber,
                        CampaignID: dataRow.CampaignID
                    });
                }
            }
            return AppLicenseProfileData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Get Sector details from Sector table
    async getSectorData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT SectorID,Sector_Name,Sector_tickId,Sector_img,Sector_title FROM Sector', []).then((data: any) => {
            const onBoardingData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    onBoardingData.push({
                        SectorID: dataRow.SectorID,
                        Sector_Name: dataRow.Sector_Name,
                        Sector_tickId: dataRow.Sector_tickId,
                        Sector_img: dataRow.Sector_img,
                        Sector_title: dataRow.Sector_title,
                    });
                }
            }
            return onBoardingData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get Category details from Category table
    async getCategoryData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT CategoryID,SectorID,Category_Name,Category_tickId,Category_img,Category_title  FROM Category', []).then((data: any) => {
            const onBoardingData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    onBoardingData.push({
                        CategoryID: dataRow.CategoryID,
                        SectorID: dataRow.SectorID,
                        Category_Name: dataRow.Category_Name,
                        Category_tickId: dataRow.Category_tickId,
                        Category_img: dataRow.Category_img,
                        Category_title: dataRow.Category_title,
                    });
                }
            }
            return onBoardingData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get Business details for the active account
    async getProfileData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT CampaignID,BusinessID,Name,Address,City,State,PinCode,GSTIN,PAN,CIN,ContactNumber,Email,Password,LogoImagePath,RegisterDate,ExpiryDate,ProductType,TypeOfBiz,GSTRegistrationType FROM Business WHERE IsActive = "1"', []).then((data: any) => {
            const profileData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    profileData.push({
                        BusinessID: dataRow.BusinessID,
                        Name: dataRow.Name,
                        Address: dataRow.Address,
                        City: dataRow.City,
                        State: dataRow.State,
                        PinCode: dataRow.PinCode,
                        GSTIN: dataRow.GSTIN,
                        PAN: dataRow.PAN,
                        CIN: dataRow.CIN,
                        ContactNumber: dataRow.ContactNumber,
                        Email: dataRow.Email,
                        Password: dataRow.Password,
                        LogoImagePath: dataRow.LogoImagePath,
                        RegisterDate: dataRow.RegisterDate,
                        ExpiryDate: dataRow.ExpiryDate,
                        ProductType: dataRow.ProductType,
                        TypeOfBiz: dataRow.TypeOfBiz,
                        GSTRegistrationType: dataRow.GSTRegistrationType,
                        CampaignID: dataRow.CampaignID
                    });
                }
            }
            return profileData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Get Business name from the database
    async getProfileName(ContactNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT Name FROM Business where ContactNumber = ? AND BusinessID = "1"', [ContactNumber]).then(async (data: any) => {
            const profileName = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    profileName.push({
                        Name: dataRow.Name
                    });
                }
            }
            return await profileName;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Update the Session Data
    async UpdateSession(DataFieldValue) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?  WHERE InvoiceConfigFieldName = ?', [DataFieldValue, 'isDigiBillSessionValid']).then(data => {
            console.log('updated successfully' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Update OnBoarding Activity
    async UpdateOnboardingActivity(DataFieldValue) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?  WHERE InvoiceConfigFieldName = ?', [DataFieldValue, 'isUserOnBoarded']).then(data => {
            console.log('updated successfully' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // get the Session Data from the database
    async getSessionData(DataFieldName) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select InvoiceConfigFieldValue from InvoiceConfiguration where  InvoiceConfigFieldName=?', [DataFieldName]).then(async (data: any) => {
            let SessionData: any;
            if (data && data.length > 0) {
                SessionData = {
                    session: data[0].InvoiceConfigFieldValue
                };
            }
            return await SessionData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Update the isUserOnBoarded Data
    async UpdateIsUserOnBoarded(DataFieldValue) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE InvoiceConfiguration SET InvoiceConfigFieldValue=?  WHERE InvoiceConfigFieldName = ?', [DataFieldValue, 'isUserOnBoarded']).then(data => {
            console.log('updated is user on boarded flag on local db to: ' + data);
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    /** Get Business details for the main account (used for validating auth session, so demo account if active should not be passed here) */
    async getMainProfileData() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT CampaignID,BusinessID,Name,Address,City,State,PinCode,GSTIN,PAN,CIN,ContactNumber,Email,Password,LogoImagePath,RegisterDate,ExpiryDate,ProductType,TypeOfBiz,GSTRegistrationType FROM Business WHERE BusinessID = "1"', []).then((data: any) => {
            const profileData = [];
            if (data.rows.length > 0) {
                for (const dataRow of data) {
                    profileData.push({
                        BusinessID: dataRow.BusinessID,
                        Name: dataRow.Name,
                        Address: dataRow.Address,
                        City: dataRow.City,
                        State: dataRow.State,
                        PinCode: dataRow.PinCode,
                        GSTIN: dataRow.GSTIN,
                        PAN: dataRow.PAN,
                        CIN: dataRow.CIN,
                        ContactNumber: dataRow.ContactNumber,
                        Email: dataRow.Email,
                        Password: dataRow.Password,
                        LogoImagePath: dataRow.LogoImagePath,
                        RegisterDate: dataRow.RegisterDate,
                        ExpiryDate: dataRow.ExpiryDate,
                        ProductType: dataRow.ProductType,
                        TypeOfBiz: dataRow.TypeOfBiz,
                        GSTRegistrationType: dataRow.GSTRegistrationType,
                        CampaignID: dataRow.CampaignID
                    });
                }
            }
            return profileData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Update the Business Password
    updateBusinessCampaingID() {
        return this.dbProvider.executeSql('UPDATE Business SET CampaignID = \'3\' WHERE BusinessID = "1"', []).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
