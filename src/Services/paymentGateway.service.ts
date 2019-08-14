import { Injectable, isDevMode } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ConstantMessages } from '../Constants/constant';
import { IInvoiceCustomerDetails } from '../Model/customerData.model';
@Injectable()
export class PaymentGateWayService {
    CustomerDetails: IInvoiceCustomerDetails;
    ProductDetails: any;
    PreviousValue = '';
    InvoiceData = {
        InvoiceNumber: '',
        InvoiceDate: ''
    };
    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService, public http: Http, private httpClient: HttpClient) {
    }

    /** GET THE ORDER ID FROM THE LOCAL DEVICE IF EXIST */
    getOrderID() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Select OrderID,PaymentCompleted from PaymentGateWay ORDER BY ID DESC LIMIT 1', []).then(async (data: any) => {
            let orderID = '';
            if ( data && data.length > 0 && data[0] && data[0].PaymentCompleted !== 1) {
                orderID = data[0].OrderID;
            }
            return await orderID;
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    // INSERT THE ORDER ID IN THE LOCAL DATABASE */
    InsertOrderID(OrderID) {
        const createdDate = Date.now();
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('insert into PaymentGateWay("OrderID","CreatedDate")  VALUES (?, ?)', [OrderID, createdDate]).then(async (data) => {
            return await data;
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    // UPDATE THE ORDER ID IN THE LOCAL DATABASE */
    UpdateOrderID(OrderID) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('update PaymentGateWay SET PaymentCompleted="1" where OrderID=?', [OrderID]).then(async (data) => {
            return await data;
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    // UPDATE THE BUSINESS Expiry Date With Latest Date THE LOCAL DATABASE */
    UpdateBusinessExpiryDate(MobileNumber, Time, ExpiryDate) {
        const ExpiryMilliSeconds = new Date(ExpiryDate).getTime();
        const TodaysDate = new Date().getTime();
        let NewExpiry;
        if (TodaysDate > ExpiryMilliSeconds) {
            NewExpiry = new Date(TodaysDate + Time);
        } else {
            NewExpiry = new Date(ExpiryMilliSeconds + Time);
        }
        const ExpiryTime = NewExpiry.toISOString().split('T')[0];
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('update Business SET ExpiryDate=? where ContactNumber=?', [ExpiryTime, MobileNumber]).then(async (data) => {
            return await data;
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    // Send the data to the server for storing it in the server Database
    async createNewOrderID(receipt, Payment) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_ORDERID; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_ORDERID; }
        const reqBody = {
            amount: Payment,
            currency: 'INR',
            // tslint:disable-next-line:object-literal-shorthand
            receipt: receipt,
            payment_capture: false,
            ParameterCheck: 1
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('createNewOrderID: ', err);
            console.log('error ', err);
            return null;
        });
    }

    // Send the data to the server for storing it in the server Database
    async SelectOrderID(OrderID) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            OrderID: OrderID,
            ParameterCheck: 4
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('SelectOrderID: ', err);
            console.log('error ', err);
            return null;
        });
    }


    /** create new receipt on to the server */
    async createNewReceiptID(BusinessID, MobileNumber) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_RECEIPT; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            BusinessID: BusinessID, // sendingBusiness ID For Creating the receiptID
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 2
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('createNewReceiptID', err);
            console.log('error ', err);
            return null;
        });
    }

    /** update the payment id on to the server */
    async UpdateServerWithPaymentID(ReceiptID, PaymentID, MobileNumber, ExpiryTime) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_RECEIPT; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const reqBody = {
            receipt: ReceiptID, // sendingBusiness ID For Creating the receiptID
            // tslint:disable-next-line:object-literal-shorthand
            PaymentID: PaymentID,
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 3,
            // tslint:disable-next-line:object-literal-shorthand
            ExpiryTime: ExpiryTime
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            if (err !== undefined) {
                console.log('UpdateServerWithPaymentID', err);
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:UpdateServerWithPaymentID', err);
                console.log('error ', err);
            }
            return null;
        });
    }

    /** get the business details from the server */
    async GetBusinessIDDataFromServer(MobileNumber) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_RECEIPT; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 1
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('GetBusinessIDDataFromServer: ', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:GetBusinessIDDataFromServer', err);
            return null;
        });
    }


    /** Get the payment Details From RazonPAY */
    async GetPaymentFromRazorPay(OrderID) {
        // the url where the request will be send and the callback respond will get
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.RAZOR_PAY_API_URL_DEV_ORDERID; } else { url = ConstMessages.PAYMENT_GATEWAY.RAZOR_PAY_API_URL_PROD_ORDERID; }
        let httpParams = new HttpParams();
        // parameter to be passed with the URL
        httpParams = httpParams.append('order_id', OrderID);
        return await this.httpClient.get(url, { params: httpParams }).toPromise().then((response: any) => {
            // check for the response from the server
            console.log('GetPaymentFromRazorPay: ', response);
            return response;
        }, (err) => {
            console.log('GetPaymentFromRazorPay: ', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ';SRC - Service Class:BusinessUserServerCheck method:GetPaymentFromRazorPay', err);
            console.log('error ', err);
            return null;
        });
    }

    /*store the customer details on to the CRM */
    async StoreCustomerDetails(CustomerDetails) {
        let url = ''; let firstName; let SecondName = ''; let lastName = ''; let StateCode = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Add_Contact; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Add_Contact; }
        const fullName = CustomerDetails.customerName.split(' ');
        if (fullName[0]) { firstName = fullName[0]; }
        if (fullName[fullName.length - 2]) { SecondName = fullName[fullName.length - 2]; }
        if (fullName[fullName.length - 1]) { lastName = fullName[fullName.length - 1]; }
        for (const state of ConstantMessages.IndianStates) {
            if (state.name === CustomerDetails.State) {
                StateCode = state.code;
            }
        }
        const reqBody = {
            fields: {
                NAME: firstName,
                SECOND_NAME: SecondName,
                LAST_NAME: lastName,
                OPENED: 'Y',
                ASSIGNED_BY_ID: 1,
                TYPE_ID: 'CLIENT',
                SOURCE_ID: 'SELF',
                PHONE: [{ VALUE: CustomerDetails.Telephone, VALUE_TYPE: 'WORK' }],
                UF_CRM_1544703883: CustomerDetails.GSTIN,
                EMAIL: [{ VALUE: CustomerDetails.Email, VALUE_TYPE: 'WORK' }],
                // tslint:disable-next-line:max-line-length
                UF_CRM_1544703832: CustomerDetails.BillingAddress + ' ' + CustomerDetails.City + ' ' + CustomerDetails.State + ' ' + CustomerDetails.PostalCode,
                UF_CRM_1544703787: CustomerDetails.customerName,
                UF_CRM_1544703841: CustomerDetails.State,
                UF_CRM_1544703859: StateCode,
                UF_CRM_1544703874: CustomerDetails.PostalCode,
                UF_CRM_1544703904: 'PAN',
                UF_CRM_5C1330BD57F16: 'BUSINESS TYPE',
                UF_CRM_5C1330BD5EBB4: 'PRODUCT TYPE',
                UF_CRM_5C1330BD6A43E: 'MUMBAI',
                UF_CRM_5C1330BD74EC5: 'APP VERSION',
            }
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response) => {
            return await response;
        }, (err) => {
            console.log('StoreCustomerDetails', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:StoreCustomerDetails', err);
            console.log('error ', err);
            return null;
        });
    }


    /*update the customer details on to the CRM */
    async UpdateCustomerDetails(CustomerDetails, CustomerID) {
        let url = ''; let firstName; let SecondName = ''; let lastName = ''; let StateCode = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Update_Contact; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Update_Contact; }
        const fullName = CustomerDetails.customerName.split(' ');
        if (fullName[0]) { firstName = fullName[0]; }
        if (fullName[fullName.length - 2]) { SecondName = fullName[fullName.length - 2]; }
        if (fullName[fullName.length - 1]) { lastName = fullName[fullName.length - 1]; }
        for (const state of ConstantMessages.IndianStates) {
            if (state.name === CustomerDetails.State) {
                StateCode = state.code;
            }
        }

        // REFER THE CONSTANT FILE FOR  GETTING THE NAME OF EACH FIELD (ConstMessages.CRM_CUSTOMER_DETAILS)*/
        const reqBody = {
            id: CustomerID,
            fields: {
                NAME: firstName, // FIRST NAME
                SECOND_NAME: SecondName, // SECOND NAME
                LAST_NAME: lastName, // LAST NAME
                OPENED: 'Y',
                ASSIGNED_BY_ID: 1, // ASSIGNED ID
                TYPE_ID: 'CLIENT', // TYPE OF USER
                SOURCE_ID: 'SELF', // SOURCE CREATED FROM
                PHONE: [{ VALUE: CustomerDetails.Telephone, VALUE_TYPE : 'WORK' }], // MOBILE NUMBER
                UF_CRM_1544703883: CustomerDetails.GSTIN, // GSTING NUMBER
                EMAIL: [{ VALUE: CustomerDetails.Email, VALUE_TYPE: 'WORK' }], // EMAIL ID
                // tslint:disable-next-line:max-line-length
                UF_CRM_1544703832: CustomerDetails.BillingAddress + ' ' + CustomerDetails.City + ' ' + CustomerDetails.State + ' ' + CustomerDetails.PostalCode, // BILLING ADDRESS
                UF_CRM_1544703787: CustomerDetails.customerName, // CUSTOMER NAME (BILLING NAME)
                UF_CRM_1544703841: CustomerDetails.State, // STATE
                UF_CRM_1544703859: StateCode, // STATE CODE
                UF_CRM_1544703874: CustomerDetails.PostalCode, // POSTAL CODE
                UF_CRM_1544703904: CustomerDetails.PAN, // PAN NUMBER
                UF_CRM_5C1330BD57F16: CustomerDetails.BUSINESS_TYPE, // BUSINESS TYPE
                UF_CRM_5C1330BD5EBB4: CustomerDetails.PRODUCT_TYPE, // PRODUCT TYPE
                UF_CRM_5C1330BD6A43E: CustomerDetails.CITY, // CITY
                UF_CRM_5C1330BD74EC5: CustomerDetails.APP_VERSION // APP VERSION

            }
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response) => {
            return await response;
        }, (err) => {
            console.log('UpdateCustomerDetails', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:StoreCustomerDetails', err);
            return null;
        });
    }


    /*Create New Invoice on to the CRM */
    async CreateNewInvoice(CustomerDetails, PaymentID, customerID, OrderID, ProductDetails) {
        let url = ''; const TodaysDate = new Date(); let StateCode = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Add_Invoice; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Add_Invoice; }
        for (const state of ConstantMessages.IndianStates) {
            if (state.name === CustomerDetails.State) {
                StateCode = state.code;
            }
        }
        const  reqBody = {
            FIELDS: {
                UF_CRM_5C1251E854B21: CustomerDetails.customerName, // business name
                UF_CRM_5C1251E85F697: CustomerDetails.Telephone, // Mobile Number
                UF_CRM_5C1251E8671B4: CustomerDetails.State, // state
                UF_CRM_5C1251E86E845: CustomerDetails.Email, // email id
                UF_CRM_5C1251E8C7D3E: CustomerDetails.GSTIN, // GSTIN
                UF_CRM_5C13339D08915: StateCode, // state code
                // tslint:disable-next-line:max-line-length
                UF_CRM_5C13339D278FD: CustomerDetails.BillingAddress + ' ' + CustomerDetails.City + ' ' + CustomerDetails.State + ' ' + CustomerDetails.PostalCode, // address
                UF_CRM_5C13339D3653A: CustomerDetails.CITY, // city
                UF_CRM_5C13339D3DB4B: CustomerDetails.PostalCode, // pincode
                UF_CRM_1544775055: PaymentID, // razorPay payment id
                UF_CRM_1544775074: OrderID, // razorPay Order ID
                DATE_INSERT: TodaysDate, // INSERTED DATE
                PERSON_TYPE_ID: '1', // customer id
                UF_CONTACT_ID: customerID, // Customer id
                UF_MYCOMPANY_ID: '1', // company id
                DATE_PAY_BEFORE: TodaysDate,
                DATE_BILL: TodaysDate,
                ORDER_TOPIC: 'Payment Invoice',
                PR_LOCATION: '1',
                STATUS_ID: 'P',
                PAY_SYSTEM_ID: 4,
                RESPONSIBLE_ID: 1,
                INVOICE_PROPERTIES: {
                    FIO: CustomerDetails.customerName, // bill name for the invoice
                    EMAIL: CustomerDetails.Email, // email id for the invoice
                    PHONE: CustomerDetails.Telephone, // mobile number for the invoice
                    // tslint:disable-next-line:max-line-length
                    ADDRESS: CustomerDetails.BillingAddress + ' ' + CustomerDetails.City + ' ' + CustomerDetails.State + ' ' + CustomerDetails.PostalCode, // BILLING ADDRESS
                },
                PRODUCT_ROWS: [
                    {
                        ID: 0,
                        PRODUCT_ID: ProductDetails.ID,
                        QUANTITY: '1.0000',
                        PRICE: ProductDetails.PRICE,
                        PRODUCT_NAME: ProductDetails.NAME
                    }
                ]

            }
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response) => {
            return await response;
        }, (err) => {
            console.log('CreateNewInvoice', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:CreateNewInvoice', err);
            return null;
        });
    }

    /** get the customer details from the CRM */
    async GetInvoiceIDDataFromCRM(InvoiceId) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Get_Invoice; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Get_Invoice; }
        const reqBody = {
            id: InvoiceId
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response: any) => {
            return response;
        }, (err) => {
            console.log('GetInvoiceIDDataFromCRM', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:GetInvoiceIDDataFromCRM', err);
            return null;
        });
    }


    /** get the Invoice details from the server */
    async GetInvoiceDataFromServer(OrderId) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_DEV; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_PROD; }
        const reqBody = {
            OrderID: OrderId,
            ParameterCheck: 3
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('GetCustomerIDDataFromServer', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:GetInvoiceDataFromServer', err);
            return null;
        });
    }

    /** store the invoice details from the server */
    async StoreInvoiceIDDataFromServer(BusinessID, MobileNumber, CustomerID, ORDERID, INVOICEID) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_DEV; }
        // tslint:disable-next-line:one-line
        else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_PROD; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 4,
            BUSINESSID: BusinessID,
            // tslint:disable-next-line:object-literal-shorthand
            CustomerID: CustomerID,
            OrderID: ORDERID,
            InvoiceID: INVOICEID
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; }
        // tslint:disable-next-line:one-line
        else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('StoreCustomerIDDataFromServer', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:StoreCustomerIDDataFromServer', err);
            return null;
        });
    }

    /** get the customer details from the server */
    async GetCustomerIDDataFromServer(MobileNumber) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_DEV; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_PROD; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 1
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('GetCustomerIDDataFromServer', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:GetCustomerIDDataFromServer', err);
            return null;
        });
    }


    // store the customer details from the server */
    async StoreCustomerIDDataFromServer(BusinessID, MobileNumber, CustomerID) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_DEV; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Bitrix_Lambda_PROD; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 2,
            BUSINESSID: BusinessID,
            // tslint:disable-next-line:object-literal-shorthand
            CustomerID: CustomerID
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('StoreCustomerIDDataFromServer', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:StoreCustomerIDDataFromServer', err);
            return null;
        });
    }


    // get the product details from the CRM */
    async GetProductDataFromCRM() {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Product_List; } else { url = ConstMessages.PAYMENT_GATEWAY.CRM_API_Product_List; }

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, options).toPromise().then(async (response) => {
            return await response;
        }, (err) => {
            console.log('GetProductDataFromCRM', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:GetProductDataFromCRM', err);
            console.log('error ', err);
            return null;
        });
    }

    // INSERT the payment id on to the server */
    async InsertPaymentIDOnServer(BusinessID, PaymentID, MobileNumber, ExpiryTime) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_RECEIPT; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_RECEIPT; }
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const reqBody = {
            BUSINESSID: BusinessID,
            // tslint:disable-next-line:object-literal-shorthand
            PaymentID: PaymentID,
            // tslint:disable-next-line:object-literal-shorthand
            MobileNumber: MobileNumber,
            ParameterCheck: 5,
            // tslint:disable-next-line:object-literal-shorthand
            ExpiryTime: ExpiryTime
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            console.log('UpdateServerWithPaymentID', err);
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:InsertPaymentIDOnServer', err);
            console.log('error ', err);
            return null;
        });
    }

    // Update Payment To captured */
    async UpdatedPaymentToCaptured(PaymentID, Amount) {
        let url = '';
        // tslint:disable-next-line:max-line-length
        if (isDevMode()) { url = ConstMessages.PAYMENT_GATEWAY.API_URL_DEV_ORDERID; } else { url = ConstMessages.PAYMENT_GATEWAY.API_URL_ORDERID; }
        const reqBody = {
            amount: Amount,
            // tslint:disable-next-line:object-literal-shorthand
            PaymentID: PaymentID,
            ParameterCheck: 2
        };
        let APIKey = '';
        if (isDevMode()) { APIKey = ConstMessages.API_KEY.Dev_API_Key; } else { APIKey = ConstMessages.API_KEY.Prod_API_Key; }
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', APIKey);
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then(async (response: any) => {
            if (response && response._body && response._body.indexOf('errorMessage') > 0) { return null; }
            return await response;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, ' ;SRC -Service Class:PaymentGateWayService method:UpdatedPaymentToCaptured', err);
            console.log('error ', err);
            return null;
        });
    }


    // set default value for customer */
    CustomerData() {
        return this.CustomerDetails = {
            customerName: '',
            Email: '',
            Telephone: '',
            GSTIN: '',
            BillingAddress: '',
            City: '',
            State: '',
            PostalCode: '',
            PAN: '',
            BUSINESS_TYPE: '',
            PRODUCT_TYPE: '',
            CITY: '',
            APP_VERSION: ''
        };
    }
}
