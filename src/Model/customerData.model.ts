export interface ICustomerList {
    partyId: number;
    name: string;
    outstandingBalance: number;
    creditAmount?: number;
    Phone?: string;
}

export interface ICustomerTxnHistory {
txnID: number;
custId: number;
date: string;
total: number;
paid: number;
balance: number;
}

export interface ITransactionDetails {
id: number;
txnID: number;
itemName: string;
quantity: number;
price: number;
tax: number;
}

export interface IInvoiceCustomerDetails {
customerName: string;
Email?: string;
Telephone?: string;
GSTIN?: string;
BillingAddress?: string;
City?: string;
State?: string;
PostalCode?: string;
PAN?: string;
BUSINESS_TYPE?: string;
PRODUCT_TYPE: string;
CITY?: string;
APP_VERSION?: string;
}

