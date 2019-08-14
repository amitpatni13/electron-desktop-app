import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConstMessages } from '../Constants/ErrorMessages';
import { isDevMode } from '@angular/core';
@Injectable()
export class BusinessUserServerCheck {
    constructor(private http: HttpClient) {
    }
    // To get the Business Response from the server
    async getBusinessDataFromServer(BusinessNumber: string, BusinessName: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', BusinessName);
        httpParams = httpParams.append('BusinessPassword', null);
        httpParams = httpParams.append('BusinessParameter', '1');
        httpParams = httpParams.append('Access-Control-Allow-Origin', '*');
        httpParams = httpParams.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // To Update the Business Password on the server
    async InsertBusinessPasswordFromServer(BusinessName, BusinessNumber: string, BusinessPassword: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();

        this.InsertUserInstallDate(BusinessNumber, BusinessUUID);
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', BusinessName);
        httpParams = httpParams.append('BusinessPassword', BusinessPassword);
        httpParams = httpParams.append('BusinessParameter', '2');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }
    // To get the Business Response from the server
    async UpdateBusinessPassword(BusinessNumber: string, BusinessPassword: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', null);
        httpParams = httpParams.append('BusinessPassword', BusinessPassword);
        httpParams = httpParams.append('BusinessParameter', '3');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }
    // To get the Business Response from the server
    async UpdateBusinessDetails(BusinessNumber: string, BusinessPassword: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', null);
        httpParams = httpParams.append('BusinessPassword', BusinessPassword);
        httpParams = httpParams.append('BusinessParameter', '4');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // To get the Business Response from the server
    async UpdateBusinessNumber(BusinessNumber: string, BusinessPassword: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', null);
        httpParams = httpParams.append('BusinessPassword', BusinessPassword);
        httpParams = httpParams.append('BusinessParameter', '5');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // update the User OnBoarded Information into the RDS
    async UpdateUserOnBoardedToRDS(profileInfo, legalInfo, userOnboarded, BusinessUUID) {
        // the business user gateway URL
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameters to be passed with the URL
        httpParams = httpParams.append('TypeOfBiz', profileInfo.TypeOfBiz);
        httpParams = httpParams.append('ProductType', profileInfo.ProductType);
        httpParams = httpParams.append('Address', profileInfo.Address);
        httpParams = httpParams.append('City', profileInfo.City);
        httpParams = httpParams.append('Email', profileInfo.Email);
        httpParams = httpParams.append('State', profileInfo.State);
        httpParams = httpParams.append('PinCode', profileInfo.PinCode);
        httpParams = httpParams.append('PAN', legalInfo.PAN);
        httpParams = httpParams.append('GSTIN', legalInfo.GSTIN);
        httpParams = httpParams.append('CIN', legalInfo.CIN);
        httpParams = httpParams.append('UserOnboarded', userOnboarded);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', profileInfo.Name);
        httpParams = httpParams.append('GSTRegistrationType', profileInfo.GSTRegistrationType);
        httpParams = httpParams.append('BusinessParameter', '6');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server after updating the user Onboarding info : ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }


    // Update the User OnBoarded Information into the RDS
    async UpdateUserDataOnBoardedToRDS(profileInfo, legalInfo, userOnboarded, BusinessUUID) {
        // the business user gateway URL
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameters to be passed with the URL
        httpParams = httpParams.append('TypeOfBiz', profileInfo.TypeOfBiz);
        httpParams = httpParams.append('ProductType', profileInfo.ProductType);
        httpParams = httpParams.append('Address', profileInfo.Address);
        httpParams = httpParams.append('City', profileInfo.City);
        httpParams = httpParams.append('Email', profileInfo.Email);
        httpParams = httpParams.append('State', profileInfo.State);
        httpParams = httpParams.append('PinCode', profileInfo.PinCode);
        httpParams = httpParams.append('PAN', legalInfo.PAN);
        httpParams = httpParams.append('GSTIN', legalInfo.GSTIN);
        httpParams = httpParams.append('CIN', legalInfo.CIN);
        httpParams = httpParams.append('UserOnboarded', userOnboarded);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', profileInfo.Name);
        httpParams = httpParams.append('GSTRegistrationType', profileInfo.GSTRegistrationType);
        httpParams = httpParams.append('BusinessParameter', '7');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server after updating the user Onboarding info : ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // To get the userOnborading s3 links from the RDS
    async getUserOnBoardingS3Links(Sector: any, isImageURL) {
        let sector: string;
        if (Sector.length > 0) {
            sector = Sector.join('\',\'');
            console.log('sector:', sector);
        } else {
            sector = Sector[0].toString();
        }
        // the url where the request will be sent and the callback respond will be received
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.USER_ON_BOARDING.ON_BOARDING_API_URL_DEV; } else { url = ConstMessages.USER_ON_BOARDING.ON_BOARDING_API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter(s) to be passed with the URL
        if (isImageURL) {
            httpParams = httpParams.append('sector', sector);
            httpParams = httpParams.append('imageURLs', isImageURL);
        } else {
            httpParams = httpParams.append('sector', sector);
        }
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // update the User OnBoarded Information into the RDS
    async UpdateBusinessFireBaseToken(TokenID, MobileNumber, BusinessUUID) {
        // the business user gateway URL
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameters to be passed with the URL
        httpParams = httpParams.append('TokenID', TokenID);
        httpParams = httpParams.append('BusinessNumber', MobileNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessParameter', '8');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server : ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // add the install date for that particular user on to the server
    // when user tries to get the backupdata from the server then he can get it directly between the install data
    async InsertUserInstallDate(BusinessNumber: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.BusinessInstallDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessInstallDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = date + ' ' + time;
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('InstallDate', dateTime);
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // when user tries to get the backupdata from the server then he can get it directly between the install data
    async InsertReinstallDate(BusinessNumber: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        const today = new Date();
        const date = today.toISOString();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('ReinstallDate', date);
        httpParams = httpParams.append('BusinessParameter', '9');
        httpParams = httpParams.append('BusinessName', '');
        httpParams = httpParams.append('BusinessPassword', '');
        console.log('Inside Reinstall Date Function');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            console.log('Inside Reinstall Date Response received Function', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // when user restart the app then update the last used  on to the server
    async LastUsedTime(BusinessNumber: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        const today = new Date();
        const date = today.toISOString();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('LastUsedOn', date);
        httpParams = httpParams.append('BusinessParameter', '12');
        httpParams = httpParams.append('BusinessName', '');
        httpParams = httpParams.append('BusinessPassword', '');
        console.log('LastUsedOn Function');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('LastUsedOn Response received Function', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server LastUsedOn: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // when user restart the app then update the last used  on to the server
    async UpdateAppVersion(BusinessNumber: string, BusinessUUID: string, AppVersion: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('ActiveVersion', AppVersion);
        httpParams = httpParams.append('BusinessParameter', '11');
        httpParams = httpParams.append('BusinessName', '');
        httpParams = httpParams.append('BusinessPassword', '');
        console.log('Update App Version Function');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('UpdateAppVersion Response received Function', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server UpdateAppVersion: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // To get the Business Response from the server
    async getDatabaseAutoIncrementDataFromServer(BusinessNumber: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.BusinessDataAutoIncrementCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataAutoIncrementCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }

    // To insert the Business details without verification
    async InsertBusinessWithoutVerification(BusinessName, BusinessNumber: number) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', String(BusinessNumber));
        httpParams = httpParams.append('BusinessName', BusinessName);
        httpParams = httpParams.append('BusinessParameter', '14');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined)  { console.log('Error: ', err); }
            return err;
        });
    }

    // store the updated business details on to the server
    async StoreUpdatedBusinessDetails(BusinessNumber: string, Name: string, BusinessPassword: string, BusinessUUID: string) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        if (isDevMode()) { url = ConstMessages.BusinessDataCapture.API_URL_DEV; } else { url = ConstMessages.BusinessDataCapture.API_URL; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('BusinessNumber', BusinessNumber);
        httpParams = httpParams.append('BusinessUUID', BusinessUUID);
        httpParams = httpParams.append('BusinessName', Name);
        httpParams = httpParams.append('BusinessPassword', BusinessPassword);
        httpParams = httpParams.append('BusinessParameter', '14');
        return await this.http.get(url, { params: httpParams, headers: { 'x-api-key': APIKey } }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            if (err !== undefined) { console.log('Error: ', err); }
            return err;
        });
    }
}
