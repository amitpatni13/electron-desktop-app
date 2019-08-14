export class ConstMessages {
    public static OtpConfig = {
        INVALID_OTP: 'Incorrect OTP',
        VALID_OTP: 'otp_verified',
        ALREADY_VALID_OTP: 'already_verified',
        SEND_OTP_URL: 'http://api.msg91.com/api/sendotp.php?',
        VERIFY_OTP_URL: 'http://api.msg91.com/api/verifyRequestOTP.php?',
        VERIFY_OTP_CALL_URL: 'http://api.msg91.com/api/retryotp.php?',
        OTP_MESSAGE: 'OTP%20is%20',
        // tslint:disable-next-line:max-line-length
        OTP_MESSAGE1: '%20to%20verify%20your%20Mobile%20Number%20for%20registration%20at%20GSTDigiBill.%0A%0AUse%20this%20as%20default%20password%20for%20future%20login.%0A%0AThank%20you%2C%0ATeam%20GSTDigiBill',
        PARAM_OTP: 'otp',
        PARAM_MOBILE: 'mobile',
        INVALID_MOBILE_NUMBER: 'Incorrect Mobile Number!',
        INVALID_BUSINESS_NAME: 'Required Business Name!',
        INCORRECT_MOBILE_NUMBER: 'Required Mobile Number!',
        RETRYTYPE_PARAM: 'retrytype',
        RETRYTYPE: 'voice'

    };

    public static PaymentSMSDetails = {
        TRANSACTION_MESSAGE1: ' Hi%20',
        // tslint:disable-next-line:max-line-length
        TRANSACTION_MESSAGE2: '%20,%20Welcome%20to%20DigiBill%20-%20Billing%20and%20Account%20App.%20Let\'s%20get%20started%20with%20DigiBill%20App%20Quick%20tour%20http://bit.ly/2QDheS3%20',

    };
    public static SmsSendingDetails = {
        PARAM_AUTH_KEY: 'authkey',
        AUTH_KEY: '169841AZe4n3UhT599152b9',
        PARAM_MOBILE: 'mobiles',
        PARAM_MOBILE_NO: 'mobile',
        PARAM_MESSAGE: 'message',
        PARAM_SENDER_ID: 'sender',
        SENDER_ID: 'DGBILL',
    };
    public static TransactionSms = {
        SEND_TRANSACTION_URL: 'https://control.msg91.com/api/sendhttp.php?',
        TRANSACTION_MESSAGE: 'Dear ',
        TRANSACTION_MESSAGE1: ' Thank you for buying with us.Your bill amount ',
        TRANSACTION_MESSAGE2: ' for invoice ',
        TRANSACTION_MESSAGE3: ' has been shared with you.',
        PARAM_ROUTE: 'route',
        PARAM_ROUTE_VALUE: '4',
    };

    public static OTPVerification = {
        SEND_TRANSACTION_URL: 'http://control.msg91.com/api/sendotp.php',
        TRANSACTION_MESSAGE: 'Dear ',
        TRANSACTION_MESSAGE1: ' Thank you for buying with us.Your bill amount ',
        TRANSACTION_MESSAGE2: ' for invoice ',
        TRANSACTION_MESSAGE3: ' has been shared with you.',
        PARAM_ROUTE: 'route',
        PARAM_ROUTE_VALUE: '4',
        OTP_VERIFY_KEY_PROD: '%2B2ycJ8DS34m',
        OTP_VERIFY_KEY_DEV: 'Uk1QHTXXyUU'
    };
    public static SMSSendingAPI = {
        API_URL_DEV: 'https://iisl5v2yr6.execute-api.us-east-2.amazonaws.com/Dev/digibillsms',
        API_URL_PROD: 'https://scxtp6lfo3.execute-api.eu-west-1.amazonaws.com/Prod/digibillsms'
    };
    public static FinalBillPage = {
        SAVE_INVOICE_CONFIG_NAME: 'DSI'
    };
    public static PurchasePage = {
        SAVE_INVOICE_CONFIG_NAME: 'PI',
        SAVE_Draft_INVOICE_CONFIG_NAME: 'PID'
    };
    public static UpdatePassSms = {
        SEND_PASSWORD_UPDATE_URL: 'https://control.msg91.com/api/sendhttp.php?',
        // tslint:disable-next-line:max-line-length
        TRANSACTION_MESSAGE: 'Your%20DigiBill%20App%20password%20has%20been%20updated%20successfully.%20Please%20contact%20support%20if%20it%20was%20not%20requested%20by%20you.',
        PARAM_ROUTE: 'route',
        PARAM_ROUTE_VALUE: '4',
    };
    public static EmailSending = {
        API_URL: 'https://4ypyb49zph.execute-api.eu-west-1.amazonaws.com/Prod/digibillemailsending-auth',
        AUTHORIZATION_KEY: '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',
        EMAIL_FROM: 'digibillapp@digiplusit.com',
        PAYMENT_EMAIL_FROM: 'suresh.nm@digiplusit.com',
        ERROR_LOG_MAILS: 'digibilldevops@digiplusit.com',
        EMAIL_TO: 'digibillapp@digiplusit.com',
        EMAIL_SENT: 'Thanks for your feedback!',
        EMAIL_FAILED_SEND: 'Failed to share your feedback!',
        ERROR_LOG_FILE_NAME: 'FileLoggerData.txt'
    };
    public static API_KEY = {
        Dev_API_Key: 'jFy5rPYIx29GHf1xePxEu4RkoyWKLyiD8wwBrUnv',
        Prod_API_Key: 'tIPXbZjTyM8NerpTlHzkO7R10vnHTgRy50ndTtW4'
    };

    public static BusinessDataCapture = {
        // master build url
        API_URL: 'https://7p261sa5b7.execute-api.eu-west-1.amazonaws.com/Prod/businessuserdatacapture-auth',
        API_URL_DEV: 'https://8a1j43atri.execute-api.us-east-2.amazonaws.com/Dev/businessuserdatacapture-new',
        // testing purpose  url
        // API_URL: "https://fh4zv6wahb.execute-api.eu-west-1.amazonaws.com/Pro/-businessdetails-dev",
        REMAINING_DAYS: ' Days remaining for your Subscription!',
        SUBSCRIPTION_OVER: 'Your Subscription has expired!',
        ALREADY_REGISTER: 'Number is already register on some other device!',
        SUCCESS_NEW_REGISTER: 'Successfully registered this device with your mobile number',
        INVALID_CREDIT: 'Invalid Credentials Entered!',
        ACCOUNT_EXIST: 'Redirecting to SignIn.Account already exists with ',
        MOBILE_NUMBER_UPDATE: 'Mobile Number Updated',
        DEVICE_UPDATE: 'Other Devices will be Logged Out'
     };
    public static BusinessDataAutoIncrementCapture = {
        // master build url
        API_URL: 'https://r2rqrsg02l.execute-api.eu-west-1.amazonaws.com/prod/databaseautoincrementdata',
        API_URL_DEV: 'https://sdsdxjm647.execute-api.us-east-2.amazonaws.com/Dev/databaseautoincrementdata',
        // testing purpose  url
        // API_URL: "https://fh4zv6wahb.execute-api.eu-west-1.amazonaws.com/Pro/-businessdetails-dev",
        REMAINING_DAYS: ' Days remaining for your Subscription!',
        SUBSCRIPTION_OVER: 'Your Subscription has expired!',
        ALREADY_REGISTER: 'Number is already register with some other device!',
        SUCCESS_NEW_REGISTER: 'Successfully registered this device with your mobile number',
        INVALID_CREDIT: 'Invalid Credentials Entered!',
        ACCOUNT_EXIST: 'Redirecting to SignIn.Account already exists with ',
        MOBILE_NUMBER_UPDATE: 'Mobile Number Updated',
        DEVICE_UPDATE: 'Other Devices will be Logged Out'
    };
    public static BusinessInstallDataCapture = {
        // master build url
        API_URL: 'https://g58zocxfg5.execute-api.eu-west-1.amazonaws.com/Prod/businessuserinstalldate-auth',
        API_URL_DEV: 'https://sfpl1zqq0a.execute-api.us-east-2.amazonaws.com/Dev/businessuserinstalldate-auth',

    };

    public static PUSH_NOTIFICATION_PAGES = {
        PageName: 'PageName',
        Page: 'Page',
        Reminder: 'Reminder',
        Backup: 'Backup',
        GSTR1Page: 'GSTR1Page',
        GSTR2Page: 'GSTR2Page'
    };

    public static DatabasePushNotification = {
        DB: 'DBSQLQuery',
        UpdateDataONServer: 'UpdateDataONServer',
        ShowLocalNotification: 'ShowLocalNotification'
    };

    public static USER_ON_BOARDING = {
        ON_BOARDING_API_URL: 'https://awssp3gz6c.execute-api.eu-west-1.amazonaws.com/Prod/useronboarding-auth',
        ON_BOARDING_API_URL_DEV: 'https://ek0rgl0x4j.execute-api.us-east-2.amazonaws.com/Dev/useronboarding-auth'
    };
    public static ErrorLogging = {
        FILE_HEADER: 'CustomMessage$|$ErrorMessage$|$TimeStamp',
        FILE_NAME: 'FileLoggerData.txt',
        COLUMN_SEPARATOR: '$|$',
        // master build url
        GATEWAY_URL: 'https://suc81pa2id.execute-api.eu-west-1.amazonaws.com/Prod/errorlog-auth',
        GATEWAY_URL_DEV: 'https://mqg5syh0hj.execute-api.us-east-2.amazonaws.com/Dev/errorlog-auth',
        // testing purpose  url
        // GATEWAY_URL : "https://fy3ynwuqll.execute-api.eu-west-1.amazonaws.com/erroLog/errorlog-dev",
        BATCH_SIZE: 200,
        ROW_SEPARATOR: '$@$',
        ERROR_LOG_FILE_NAME: 'FileLoggerData.txt'
    };
    public static DB_INCREMENTAL = {
        API_URL: 'https://wwdvsrfaw2.execute-api.eu-west-1.amazonaws.com/Incremental/dbincremental',
        API_URL_DEV: 'https://byil8tte3m.execute-api.us-east-2.amazonaws.com/Dev/db-incremental'
    };

    public static DATA_ANALYTICS = {
        API_URL: 'https://gs8ljxxz26.execute-api.eu-west-1.amazonaws.com/Prod/transactiondataforanalytics-auth',
        API_URL_DEV: 'https://91z5m2d6pb.execute-api.us-east-2.amazonaws.com/Dev/transactiondataforanalytics-auth'
    };
    public static SERVER_DATA_UPDATE = {
        API_URL: 'https://l5dq1ruqhf.execute-api.eu-west-1.amazonaws.com/Pro/storedataonaws', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_DEV: 'https://4u7i6nfsff.execute-api.us-east-2.amazonaws.com/Dev/storedataonaws', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_ANALYTICS: 'https://gs8ljxxz26.execute-api.eu-west-1.amazonaws.com/Prod/transactiondataforanalytics-auth', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_DEV_ANALYTICS: 'https://91z5m2d6pb.execute-api.us-east-2.amazonaws.com/Dev/transactiondataforanalytics-auth', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_ANALYTICS_FOR_DAY: 'https://p5rqpnvud7.execute-api.eu-west-1.amazonaws.com/Prod/transactiondperdayforanalytics-auth', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_DEV_ANALYTICS_FOR_DAY: 'https://gmoaegdz9l.execute-api.us-east-2.amazonaws.com/Dev/transactiondperdayforanalytics-auth', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_ANALYTICS_TIME_SPENT: 'https://q2pacwno43.execute-api.eu-west-1.amazonaws.com/Pro/inserttimespentpersessiononserver', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_DEV_ANALYTICS_TIME_SPENT: 'https://ujte5ck346.execute-api.us-east-2.amazonaws.com/Dev/inserttimespentpersessiononserver', // UPDATE THE LINK FOR THE SERVER DATA UPDATE
        // tslint:disable-next-line:max-line-length
        API_URL_BUSINESS_USER: 'https://6yd42p0hd4.execute-api.eu-west-1.amazonaws.com/Pro/pushnotifications', // SEND THE RESPONSE BACK TO THE USER FOR UPDATING THE DATA,
        // tslint:disable-next-line:max-line-length
        API_URL_DIGI_BILL_PUSH_NOTIFICATION: 'https://9e93bmk3wb.execute-api.eu-west-1.amazonaws.com/Pro/sendpushnotificationdigibill' // SEND THE PUSH NOTIFICATION TO THE DIGIBILL APP
    };

    public static PAYMENT_GATEWAY = {
        API_URL_RECEIPT: 'https://51c8xzgdxb.execute-api.eu-west-1.amazonaws.com/Prod/paymentgatewayreceiptid-auth',
        API_URL_DEV_RECEIPT: 'https://1s4u70pq4h.execute-api.us-east-2.amazonaws.com/Prod/paymentgatewayreceiptid-auth',
        API_URL_ORDERID: 'https://7ju1blyt79.execute-api.eu-west-1.amazonaws.com/Prod/paymentgatewayorderid-auth',
        API_URL_DEV_ORDERID: 'https://me5f3vthrg.execute-api.us-east-2.amazonaws.com/Dev/paymentgatewayorderid-auth',
        RAZOR_PAY_API_URL_DEV_ORDERID: 'https://rzp_test_PZgcLPcEfxXUkX:l3iiI04505uNnK2EHALF5Cju@api.razorpay.com/v1/payments',
        RAZOR_PAY_API_URL_PROD_ORDERID: 'https://rzp_live_gx8keakpSbFJfM:SPyYHRm1RuxOFveiEI1j6AWh@api.razorpay.com/v1/payments',
        CRM_API_Add_Contact: 'https://digibill.bitrix24.com/rest/1/2nmozm620l8o6ls1/crm.contact.add',
        CRM_API_Update_Contact: 'https://digibill.bitrix24.com/rest/1/2nmozm620l8o6ls1/crm.contact.update',
        CRM_API_Add_Invoice: 'https://digibill.bitrix24.com/rest/1/2nmozm620l8o6ls1/crm.invoice.add',
        CRM_API_Get_Invoice: 'https://digibill.bitrix24.com/rest/1/2nmozm620l8o6ls1/crm.invoice.get',
        CRM_API_Product_List: 'https://digibill.bitrix24.com/rest/1/2nmozm620l8o6ls1/crm.product.list',
        CRM_API_Bitrix_Lambda_PROD: 'https://iisz1dxvr9.execute-api.eu-west-1.amazonaws.com/Prod/crmdatabitrix24-auth',
        CRM_API_Bitrix_Lambda_DEV: 'https://ivd7p0amh1.execute-api.us-east-2.amazonaws.com/Dev/crmdatabitrix24-auth'
    };
    public static SalesPaymentMode = { // Order should not be changed in below arrays
        PaymentModeID: [12, 1, 2, 3, 11, 4, 5, 6, 7, 8, 9, 10],
        // tslint:disable-next-line:max-line-length
        PaymentModeValue: ['None', 'Cash', 'Card', 'Cheque', 'Bank Transfer', 'Voucher', 'Credit Note', 'NEFT', 'RTGS', 'UPI', 'E-wallet', 'NEFT/RGTS']
    };
    public static PurchasePaymentMode = { // Order should not be changed in below arrays
        PaymentModeID: [12, 1, 2, 3, 11, 4, 5, 6, 7, 8, 9, 10],
        // tslint:disable-next-line:max-line-length
        PaymentModeValue: ['None', 'Cash', 'Card', 'Cheque', 'Bank Transfer', 'Voucher', 'Debit Note', 'NEFT', 'RTGS', 'UPI', 'E-wallet', 'NEFT/RGTS']
    };

    public static SalesReturnPaymentMode = {
        PaymentModeID: [1, 2],
        PaymentModeValue: ['Cash', 'Credit Note']
    };
    public static PurchaseReturnPaymentMode = {
        PaymentModeID: [1, 2],
        PaymentModeValue: ['Cash', 'Debit Note']
    };

    public static ItemMeasurementMaster = {
        ItemMeasurementMasterID: [1, 2, 3, 4, 5, 6, 7],
        ItemMeasurementFieldName: ['kg', 'grams', 'ltr', 'mltr', 'pcs', 'cm', 'mtr']
    };

    public static ReportStaticData = {
        SALE_DRAFT_NAME: 'Draft',
        PURCHASE_DRAFT_NAME: 'Draft'
    };

    public static ErrorCode = {
        INVALID_PERCENTAGE_VALUE: 'Please enter a valid percent value between 0 and 100',
        INVALID_TEXT: 'Please put a valid text ',
        INVALID_NUMBER_DECIMAL: 'Please put a valid Number',
        INVALID_ALPHANUMERIC: 'Entered value should be a number/alphabet ',
        INVALID_DECIMAL: 'Decimal value required',
        REQUIRED: 'Required',
        INVALID_CREDIT: 'Is invalid credit card number',
        INVALID_EMAIL_ADDRESS: 'Invalid email address',
        INVALID_PASSWORD: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
        INVALID_NUMBER: 'Entered value should contain numbers with required length  ',
        GSTIN_NUMBER: 'Invalid GSTIN Format',
        PAN_NUMBER: 'Invalid PAN Format',
        SUCCESS: 'SUCCESS',
        CART_ITEM_LIMIT_EXCEED: ' in cart are more than available in stock',
        FAILED: 'Operation failed due to some reason. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_DB_ALREADY_EXISTS: 'This Business name already exists. Create a new Business Name',
        ERROR_DB_UPDATE_FAIL: 'Business Details update Fail. If the problem persists, please contact DigiBill technical support',
        ERROR_DB_CREATION_SUCCESS: 'Business Name added.',
        ERROR_DB_GET_FAIL: 'Business Details Not Available. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DASHBOARD_GET_BAR_GRAPH_DATA: 'Bar graph Data Not available.If the problem persists, please contact DigiBill technical support',
        ERROR_DASHBOARD_GET_SALES_DATA: 'Sales Data Not available.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DASHBOARD_GET_PURCHASESALESDATA: 'Purchase Sales Data Not available.If the problem persists, please contact DigiBill technical support',
        ERROR_NAME_ALREADY_EXISTS: 'This party name already exist. Create a new party name.',
        ERROR_ITEM_ALREADY_EXISTS: 'This item name already exist. Create a new item name.',
        ERROR_ITEM_CODE_ALREADY_EXISTS: 'Item with same item code already exists. Please enter new item code.',
        ERROR_ITEM_NOT_PRESENT: 'This item name is not present. Please add the item before making transactions. ',
        ERROR_ITEM_UNIT_CANT_CHANGE: 'You can not change the unit for this item as unit has already been used in transaction.',
        ERROR_NAME_EMPTY: 'Party name can not be left empty.',
        ERROR_EXPENSE_SAVE_SUCCESS: 'New Expense save successfully',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_SAVE_FAILED: 'Failed to save expense name. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_GET_FAILED: 'Failed to get expense details. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_UPDATE_FAILED: 'Failed to Update expense details. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_CATEGORY_SAVE_FAILED: 'Failed to save expense category. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_CATEGORY_GET_FAILED: 'Failed to get expense category details. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_EXPENSE_CATEGORY_UPDATE_FAILED: 'Failed to Update expense category details. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_EXPENSE_NAME_EXISTS: 'Expense name already exists. Please enter new name.',
        ERROR_ITEM_NAME_EMPTY: 'Item name can not be left empty',
        ERROR_NAME_DOESNOT_EXIST: 'Party name doesn\'t exist, please create a new party.',
        // tslint:disable-next-line:max-line-length
        ERROR_FIRM_UPDATE_FAILED: 'Failed to update firm. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_FIRM_UPDATE_SUCCESS: 'Firm updated successfully',
        ERROR_INVALID_PHONENUMBER: 'Please enter a valid phone number.',
        ERROR_REMINDER_GET_FAILED: 'Failed to get Reminder Data.',
        ERROR_PHONENUMBER_EMPTY: 'No phone number specified for the party. Please update the party with phone number and then try again.',
        ERROR_INVALID_EMAILID: 'Please enter a valid email address.',
        // tslint:disable-next-line:max-line-length
        ERROR_NAME_SAVE_FAILED: 'Failed to save the name. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_NAME_SAVE_SUCCESS: 'New party saved successfully.',
        ERROR_NAME_UPDATE_SUCCESS: 'Party updated successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_NAME_UPDATE_FAILED: 'Party updation failure. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_ITEMCATEGORY_SAVE_SUCCESS: 'New category saved successfully.',
        ERROR_ITEMCATEGORY_UPDATE_SUCCESS: 'Category updated successfully.',
        ERROR_ITEMCATEGORY_DELETE_SUCCESS: 'Category deleted successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEMCATEGORY_SAVE_FAILED: 'Failed to save the category. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEMCATEGORY_UPDATE_FAILED: 'Failed to update the category. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEMCATEGORY_DELETE_FAILED: 'Failed to delete the category. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEM_CATEGORY_DOES_NOT_EXIST: 'Specified category doesn\'t exist, please create a new group by clicking on "Add new category"',
        ERROR_ITEMCATEGORY_ALREADYEXISTS: 'Specified category already exists, please use a different name.',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEMCATEGORY_LOAD_FAILED: 'Failed to load the category details. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_ITEM_SAVE_SUCCESS: 'New item saved successfully.',
        ERROR_NAME_DELETE_SUCCESS: 'Party has been deleted successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_NAME_DELETE_FAILED: 'This party can not be deleted as it already has open transactions. Please delete all transactions before deleting the party.',
        ERROR_TXN_INVALID_AMOUNT: 'Invalid value for amount. Please enter a valid value.',
        // tslint:disable-next-line:max-line-length
        ERROR_TXN_SAVE_FAILED: 'Failed to save the transaction. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_TXN_TOTAL_EMPTY: 'Total amount can\'t be empty',
        ERROR_TXN_SAVE_SUCCESS: 'New transaction saved successfully.',
        ERROR_TXN_DELETE_SUCCESS: 'Transaction has been deleted successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_TXN_DELETE_FAILED: 'Failed to delete the transaction. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_TXN_REFNO_UNIQUE: 'Unique reference number.',
        ERROR_TXN_REFNO_ALREADY_USED: 'Specified Invoice No. is already used. Please use a different number greater than ',
        ERROR_ITEM_USED: 'We can\'t delete this item as it is being used in a transaction',
        ERROR_ITEM_DELETE_SUCCESS: 'Item has been successfully deleted.',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEM_DELETE_FAILED: 'This item can not be deleted as it already as transactions. Please delete all transactions before deleting the item.',
        // tslint:disable-next-line:max-line-length
        ERROR_TXN_LOAD_FAILED: 'Failed to load this transaction. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_NAME_LOAD_FAILED: 'Failed to load this party. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEM_LOAD_FAILED: 'Failed to load this item. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_IMAGE_LOAD_FAILED: 'Failed to load this image. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ITEM_SAVE_FAILED: 'Failed to save the item. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SETTING_SAVE_FAILED: 'Failed to save the setting. Please try again. If the problem persists, please contact DigiBill technical support',
        ERROR_SETTING_SAVE_SUCCESS: 'Settings have been saved successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_SETTING_GET_FAILED: 'Failed to load the setting.. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_IMAGE_NOT_SAVED_IN_DATA_FOLDER: 'Failed to store image with transaction. Remove attached image and try to save transaction again. Please check the permissions given to the application also. If problem persists, contact DigiBill technical support.',
        // tslint:disable-next-line:max-line-length
        ERROR_GENERIC: 'Something went wrong. Try again later.  If problem persists, please contact DigiBill technical support.Please check the permissions given to the application also.',
        ERROR_PROFILE_DATA_VALID: 'Entered data is valid',
        ERROR_PROFILE_NAME_EMPTY: 'Name field can\'t be left empty.',
        ERROR_PROFILE_NUMBER_EMPTY: 'Contact number field can\'t be left empty.',
        ERROR_PROFILE_EMAIL_EMPTY: 'Email-Id field can\'t be left empty.',
        ERROR_PROFILE_NUMBER_INVALID: 'Please enter a valid Contact number.',
        ERROR_PROFILE_EMAIL_INVALID: 'Please enter a valid Email-Id.',
        ERROR_PROFILE_UPDATE_SUCCESS: 'Profile has been updated.',
        ERROR_PROFILE_TIN_EMPTY_PRINT_ENABLED: 'Print TIN on transaction is enabled so TIN can not be left empty.',
        // tslint:disable-next-line:max-line-length
        ERROR_PROFILE_UPDATE_FAILED: 'Profile updation has been failed. Please try again later. If the problem persists, please contact DigiBill technical support.',
        // tslint:disable-next-line:max-line-length
        ERROR_FIRM_SAVE_FAILED: 'Failed to save firm. Please try again later. If the problem persists, please contact DigiBill technical support',
        ERROR_FIRM_SAVE_SUCCESS: 'Firm saved successfully',
        ERROR_FIRM_NAME_EMPTY: 'Firm name cannot be empty. Please retry',
        ERROR_FIRM_ALREADYEXISTS: 'This firm name already exists, please enter new name',
        ERROR_DB_UNSUPPORTED: 'Unsupported format of backup file. Please select a valid DigiBill backup',
        // tslint:disable-next-line:max-line-length
        ERROR_DB_VERSION_LOWER: 'This backup is from older version of DigiBill Android app, please upgrade your android app, then take the backup and restore in desktop',
        ERROR_DB_VERSION_HIGHER: 'This backup is from newer version of DigiBill app, please upgrade your current app.',
        ERROR_TAX_CODE_NAME_EXISTS: 'This tax rate/group name already exists, please enter a new name.',
        ERROR_TAX_CODE_NAME_SAVE_SUCCESS: 'New tax rate saved successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_TAX_CODE_NAME_SAVE_FAILED: 'Failed saving new tax rate. Please try again later. If the problem persists, please contact DigiBill technical support.',
        ERROR_TAX_CODE_NAME_EDIT_SUCCESS: 'New tax rate edited successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_TAX_CODE_NAME_GET_FAILED: 'Failed to get Tax Rate Data. Please try again later. If the problem persists, please contact DigiBill technical support.',
        // tslint:disable-next-line:max-line-length
        ERROR_TAX_CODE_NAME_EDIT_FAILED: 'Failed editing new tax rate. Please try again later. If the problem persists, please contact DigiBill technical support.',
        ERROR_TAX_CODE_NAME_DELETE_SUCCESS: 'Tax rate deleted successfully.',
        // tslint:disable-next-line:max-line-length
        ERROR_TAX_CODE_NAME_DELETE_FAILED: 'Failed Deleting tax rate. Please try again later. If the problem persists, please contact DigiBill technical support.',
        ERROR_TAX_CODE_CANNOT_EDIT: 'Cannot edit tax rate, its being used in . Delete the transactions first',
        ERROR_TAX_CAN_DELETE_EDIT: 'Can delete',
        // tslint:disable-next-line:max-line-length
        ERROR_TAX_RATE_EDIT_USED_IN_ITEM: 'This tax rate is already used in item, chaining/deleting this will cause changes in item too. Do you wish to proceed?',
        ERROR_TAX_RATE_USED_IN_ITEM: 'Cannot Delete/Edit this tax rate since this is being used in item.',
        ERROR_TAX_RATE_USED_IN_GROUP: 'Cannot Delete/Edit this tax rate since this is being used in group.',
        ERROR_TAX_RATE_USED_IN_TRANSACTION: 'Cannot Delete/Edit this tax rate since this is being used in transaction.',
        // tslint:disable-next-line:max-line-length
        ERROR_PAYMENT_MODE_FAILED: 'Failed to get Payment Mode. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_INVOICE_DATA_FAILED: 'Failed to get DraftInvoiceData. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_INVOICE_CONFIG_DATA_FAILED: 'Failed to get Invoice Config Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_INVOICE_CONFIG_DATA_DELETE_FAILED: 'Failed to delete Invoice Config Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_INVOICE_CONFIG_DATA_UPDATE_FAILED: 'Failed to Update Invoice Config Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_DATA_FAILED: 'Failed to get Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_DATA_UPDATE_FAILED: 'Failed to Update Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_DATA_ADD_FAILED: 'Failed to Insert Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_ITEM_DATA_FAILED: 'Failed to get Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_ITEM_DATA_ADD_FAILED: 'Failed to Add Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_INVOICE_ITEM_DATA_UPDATE_FAILED: 'Failed to Update Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_SALES_QUOTATION_DATA_FAILED: 'Failed to get Sales Quotation Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_DATA_FAILED: 'Failed to get Draft Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_DATA_UPDATE_FAILED: 'Failed to Update Draft Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_DATA_ADD_FAILED: 'Failed to Add Draft Sales Invoice Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_ITEM_DATA_FAILED: 'Failed to get Draft Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_ITEM_DATA_ADD_FAILED: 'Failed to Add Draft Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_SALES_INVOICE_ITEM_DATA_UPDATE_FAILED: 'Failed to Update Draft Sales Invoice item Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_GET_GSTR1_DATA_FAILED: 'Failed to get GSTR1 Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_GET_GSTR2_DATA_FAILED: 'Failed to get GSTR2 Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_GET_GSTR9_DATA_FAILED: 'Failed to get GSTR9 Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PARTY_DATA_FAILED: 'Failed to get Party Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PARTY_DATA_ADD_FAILED: 'Failed to Add New Party. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PARTY_DATA_UPDATE_FAILED: 'Failed to Update Party Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PARTY_DATA_UPDATE_OUTSTANDING_BALANCE_FAILED: 'Failed to get Party Data. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PARTY_STATEMENT_DATA_FAILED: 'Failed to get Party Data From Invoice. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_DATA_FAILED: 'Failed to get Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_DATA_UPDATE_FAILED: 'Failed to Update Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_DATA_ADD_FAILED: 'Failed to add Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_DATA_FAILED: 'Failed to get Draft Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_DATA_UPDATE_FAILED: 'Failed to Update Draft Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_DATA_ADD_FAILED: 'Failed to add  Draft Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_DATA_DELETE_FAILED: 'Failed to Delete  Draft Purchase Sales Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_ITEM_DATA_FAILED: 'Failed to get Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_ITEM_DATA_UPDATE_FAILED: 'Failed to Update Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_SALES_ITEM_DATA_ADD_FAILED: 'Failed to add Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_FAILED: 'Failed to get Draft Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_UPDATE_FAILED: 'Failed to Update Draft Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_ADD_FAILED: 'Failed to add  Draft Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_DELETE_FAILED: 'Failed to Delete  Draft Purchase Sales Item Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_GET_RECENT_ACTIVITIES_FAILED: 'Failed to Get Recent Activities Data.If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_ADD_RECENT_ACTIVITIES_FAILED: 'Failed to Add Recent Activities Data.If the problem persists, please contact DigiBill technical support',
        ERROR_SOCIAL_SHARE_WHATSAPP: 'Failed to Send WhatsApp Message',
        ERROR_SOCIAL_SHARE_FACEBOOK: 'Failed to Send Facebook Message',
        ERROR_SOCIAL_SHARE_TWITTER: 'Failed to Send Twitter Message',
        ERROR_SOCIAL_SHARE_EMAIL: 'Failed to Send Email',
        ERROR_LOGIN_AUTHENTICATION: 'Error occurred while login',
        ERROR_BAR_CODE_DATA_FAILED: 'Failed to Find the Bar Code Data.If the problem persists, please contact DigiBill technical support',
        ERROR_DATABASE_CONNECT: 'Error connecting database',
        ERROR_DATABASE_QUERY_FAILED: 'Failed to Execute the query',
        ERROR_SERVER_REQUEST_FAILED: 'Failed to get response from the server',
        ERROR_PDF_GENERATE_FAILED: 'Failed to Generate PDF',
        ERROR_PDF_SAVE_FAILED: 'Failed to SAVE PDF',
        ERROR_PDF_FETCH_FAILED: 'Error Fetching Base64 PDF Data',
        ERROR_ITEM_STOCK: 'Error Stock Limited',
        ERROR_ITEM_STOCK_COUNT: 'Error Item limit Reached',
        ERROR_ITEM_DISCOUNT: 'Error Invalid Discount',
        ERROR_ITEM_PRICE: 'Error Item Price',
        ERROR_ITEM_COUNT_FAILED: 'Please enter a valid item count value',
        ERROR_ITEM_DISCOUNT_FAILED: 'Please select a Discount Type',
        ERROR_ITEM_DISCOUNT_VALUE_FAILED: 'Please add the Discounted Value',
        ERROR_ITEM_DISCOUNT_PERCENT_FAILED: 'Invalid percent discount value provided, please try again',
        ERROR_FINAL_DISCOUNT_FAILED: 'Discount Value should be a positive number. Please Try again!',
        ERROR_FINAL_DISCOUNT_PERCENT_FAILED: 'Discount Percent Value should be between 0 and 100. Please Try again!',
        ERROR_FINAL_OTHER_COST: 'Other Cost Value should be a positive number. Please Try again!',
        ERROR_FINAL_AMOUNT_RECEIVED: 'Amount Received Value should be a positive number. Please Try again!',
        ERROR_FINAL_PAYMENT_REFERENCE: 'Payment Reference Number should be Alphanumeric. Please Try again!',
        ERROR_ITEM_PRICE_FAILED: 'Value Entered is higher than current item price',
        ERROR_ITEM_DISCOUNT_MORE: 'Discount Provided is more than Total Bill Price',
        ERROR_FORGOT_OTP_FAILED: 'Forgot OTP Error',
        ERROR_OTP_SEND: 'Unable To Send the OTP!',
        ERROR_VALID_NUMBER: 'Enter valid number',
        ERROR_PASSWORD_RESET: 'Password Reset Error',
        ERROR_FOLDER_EXIST: 'DigiBill Folder Exists',
        ERROR_FILE_EXIST: 'File Already Exists',
        ERROR_BILL_FORMAT: 'Bill Format Setting',
        ERROR_UPDATE_BILL_FORMAT: 'Bill Format Setting Update Failed!',
        ERROR_TOGGLE_BUTTON: 'Setting Toggle Data',
        ERROR_UPDATE_CART_ITEM: 'Error Cart Item',
        ERROR_TRANSACTION_SMS: 'Transaction SMS Failed TO Send',
        ERROR_AMOUNT_RECEIVED: 'Please enter the Amount Received Value',
        ERROR_CREDIT_AMOUNT: 'Please enter the Credit Amount Value',
        ERROR_EMAIL_SEND: 'Failed to send the email With Send grid API',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_ITEM_DATA_RESTORE_FAILED: 'Failed to Restore Deleted Draft Purchase Sales Item Data. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        ERROR_DRAFT_PURCHASE_SALES_DATA_RESTORE_FAILED: 'Failed to Restore Deleted Draft Purchase Sales Data. If the problem persists, please contact DigiBill technical support',
        ERROR_ACCESS: 'Access Not Allowed',
        NO_INTERNET_CONNECTION: 'No Internet Connectivity',
        FAILED_ORDER: 'Failed To Complete The Order',
        ORDER_COMPLETED: 'Order Completed',
        PAYMENT_INCOMPLETE: 'Payment is not done for this Coupon Code',
        COUPON_ALREADY_USED: 'Coupon Code Already Used',
        // tslint:disable-next-line:max-line-length
        ERROR_PURCHASE_QUOTATION_DATA_FAILED: 'Failed to get Purchase Order Data. Please try again. If the problem persists, please contact DigiBill technical support',
        MEASUREMENT_UNIT_ADDED: 'Measurement Unit Added Successfully!',
        MEASUREMENT_UNIT_FAILED: 'Measurement Unit Failed!',
        MEASUREMENT_UNIT_DELETED: 'Measurement Unit Deleted Successfully!',
        MEASUREMENT_UNIT_ENTERNAME: 'Enter the Measuremet Name',
        // tslint:disable-next-line:max-line-length
        GOOGLE_DRIVE_BACKUP_UPLOAD_FAILED: 'Failed to upload Backup File to Google Drive. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        GOOGLE_DRIVE_BACKUP_DOWNLOAD_FAILED: 'Failed to download Backup File from Google Drive for Restore. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        GOOGLE_DRIVE_BACKUP_SYNC_FAILED: 'Failed to sync Backup files data from Google Drive. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        GOOGLE_DRIVE_AUTO_BACKUP_REMOVE_FAILED: 'Failed to remove Auto-Backup file from Google Drive. Please try again. If the problem persists, please contact DigiBill technical support',
        // tslint:disable-next-line:max-line-length
        GOOGLE_ACCOUNT_LOGIN_FAILED: 'Failed to login to Google Account. Please try again. If the problem persists, please contact DigiBill technical support',
        OTP_INTERNAL_ERROR: 'Error Connecting. Please try again after sometime'

    };
    public static WARNCode = {
        WARN_ADD_TAX_RATES: 'Tax Rates WARN',
        WARN_ALL_FIELDS: 'Enter All required Fields',
        WARN_INCORRECT_DATA: 'Incorrect Data Entered',
        WARN_FORGOT_OTP: 'Forgot OTP WARN',
        WARN_INTERNET_ACCESS: 'No Internet Access',
        WARN_NUMBER_REGISTERED: 'Number Not Registered With This Device!!',
        WARN_PASSWORD_RESET: 'Password Reset Warning',
        WARN_CORRECT_DETAILS: 'Enter Correct Details',
        WARN_CURRENT_PASSWORD: 'Current Password Do Not Match',
        WARN_PASSWORD_MATCH: 'New Password and Confirm Password do not Match',
        WARN_BUSINESS_DETAILS: 'Business Details Warning',
        WARN_MOBILE_NUMBER: 'Enter Mobile Number',
        WARN_MOBILE_VALID_NUMBER: 'Enter Valid Mobile Number',
        WARN_VALID_PASSWORD: 'Enter Valid Password',
        WARN_REGISTER_BUSINESS: 'Register Business Warning',
        WARN_PURCHASE: 'Purchase Warning',
        WARN_PURCHASE_ITEM: 'Add Items to the Purchase list',
        WARN_NEW_PARTY: 'New Party Warning',
        WARN_PARTY_NAME: 'Enter Party Name',
        WARN_CUSTOMER_NAME: 'Enter Customer Name',
        WARN_NEW_ITEM: 'New Item Warning',
        WARN_NEW_CATEGORY: 'New Category Warning',
        WARN_CATEGORY_NAME: 'Category name is required',
        WARN_NEW_EXPENSE: 'New Expense Add Warning',
        WARN_AMOUNT: 'Enter Amount',
        WARN_OTHER_CONST: 'Other Cost',
        WARN_PAYMENT_REFERENCE: 'Payment Reference',
        WARN_HSN_SERVER_RESPONSE_REQUEST: 'Server request for HSN/SAC number failed warning',
    };
    static FLOW_NAME: any;
    static TABLE_NAME: any;
    static MAX_SALES_LIMIT: number;
    static MAX_PURCHASE_LIMIT: number;
    static MAX_EXPENSE_LIMIT: number;
    static MAX_PARTY_LIMIT: number;
    static MAX_ITEMS_LIMIT: number;
}
