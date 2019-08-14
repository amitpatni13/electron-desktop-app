
export interface IPartyStatement {
    InvoiceNumber: string;
    InvoiceDueDate: string;
    InvoiceDate: string;
    TransactionType: string;
    TotalPayable: number;
    Balance: number;
}

export interface ISalesReport {
    PartyName: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    TotalPayable: number;
    AmountReceived: number;
    SalesInvoiceID: number;
    cssClass?: string;
    PaymentLabelClass?: string;
    PaymentLabel?: string;
    Balance?: number;
    PartyID?: number;
    Type?: string;
    isSaleReturn?: number;
    creditAmountUsed?: number;
    paidIn?: number;
    saleReturnType?: string;
    MonthLabel?: string;
    isSaleQuotation?: boolean;
    SaleQuotationStatus?: string;
    totalTax?: number;
}

export interface IGSTR1Report {
    GSTIN?: string;
    InvoiceNumber: string;
    InvoiceDate?: string;
    TotalPayable?: number;
    Rate?: number;
    TaxableValue?: number;
    ReverseCharge?: string;
    IGST?: number;
    CGST?: number;
    SGST?: number;
    CESS?: number;
    PlaceOfSupply?: string;
    SellingPrice?: number;
    PartyShippingState?: string;
    Quantity?: number;
    InvoiceType?: string;
    ECommerceGSTIN?: string;
    TaxSlab1?: number;
    TaxSlab2?: number;
    TaxSlab3?: number;
    TaxSlab4?: number;
    SalesInvoiceID?: number;
    Tax?: number;
    TotalTax?: number;
    TaxNumber?: number;
    TaxRate?: string;
    ItemName?: string;
    Item_ID?: number;
    PartyID?: number;
    RegistrationType?: string;
    isReturnInvoice?: number;
    RevereseCharge?: number;
    HSNNumber?: string;
    Measurement?: string;
    Description?: string;
 }

export interface IGSTR2Report {
    GSTIN: string;
    InvoiceNumber: string;
    InvoiceDate: string;
    TotalPayable: number;
    Rate: number;
    TaxableValue: number;
    IGST: number;
    CGST: number;
    SGST: number;
    CESS: number;
    PlaceOfSupply: string;
    RegistrationType?: string;
    isReturnInvoice?: number;
}

export interface IGSTR9Report {
    GSTIN?: string;
    InvoiceNumber: string;
    InvoiceDate?: string;
    TotalPayable?: number;
    Rate?: number;
    TaxableValue?: number;
    ReverseCharge?: string;
    IGST?: number;
    CGST?: number;
    SGST?: number;
    CESS?: number;
    PlaceOfSupply?: string;
    SellingPrice?: number;
    PartyShippingState?: string;
    Quantity?: number;
    InvoiceType?: string;
    ECommerceGSTIN?: string;
    TaxSlab1?: number;
    TaxSlab2?: number;
    TaxSlab3?: number;
    TaxSlab4?: number;
    SalesInvoiceID?: number;
    Tax?: number;
    TotalTax?: number;
    TaxNumber?: number;
    TaxRate?: string;
    ItemName?: string;
    Item_ID?: number;
    PartyID?: number;
    RegistrationType?: string;
    isReturnInvoice?: number;
    RevereseCharge?: number;
    HSNNumber?: string;
    Measurement?: string;
    Description?: string;
}

export interface IDailyAccount {
    transactionType: string;
    totalAmount: number;
    paymentIn: number;
    paymentOut: number;
    isReturnInvoice?: number;
    PaymentId?: number;
}

export interface IHSNReport {
    Description?: string;
    HSNCode: string;
    TypeOfSupply: string;
    Quantity: number;
    UOM: string;
    IGST: number;
    CGST: number;
    SGST: number;
    CESS: number;
    SellingPrice: number;
    TotalTax: number;
    isSellingPriceTaxInclusive?: number;
    Rate?: string;
    Item_ID?: number;
    TaxableValue?: number;
    TotalTaxableAmount?: number;
    TaxSlab1?: number;
    TaxSlab3?: number;
    TaxSlab4?: number;
    isReturnInvoice?: number;
}

export interface ModelAdditionalData {
    IGST: number;
    CGST: number;
    SGST: number;
    CESS: number;
    SellingPrice: number;
    Quantity: number;
}
