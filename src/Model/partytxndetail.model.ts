export interface IPartyTxnDetail {
    SalesInvoiceID: number;
    InvoiceNumber: number;
    InvoiceDate: string;
    InvoiceDueDate: string;
    TotalPayable: number;
    AmountReceived: number;
    Balance: number;
    Discount?: number;
    TotalTax?: number;
    isSaleReturn?: number;
    IsPurchaseReturn?: number;
    creditAmountUsed?: number;
    PaymentReceived?: number;
    BalanceDuplicate?: number;
    PreviousAmoutReceived?: number;
    TotalAmoutRemaining?: boolean;
    FullAmountReceived?: boolean;
    PartialAmountReceived?: boolean;
    SalesInvoiceDisable?: boolean;
    SalesInvoiceEdited?: boolean;
    InvoiceId?: number;
    paidIn?: number;
    PaymentLabel?: string;
    cssClass?: string;
    PaymentLabelClass?: string;
    Type?: string;
    MonthLabel?: string;
    isSaleQuotation?: boolean;
    SaleQuotationStatus?: string;
    partyName?: string;
    partyId?: string;
}
export interface IPartyPayment {
    partyId: number;
    AmountReceived: number;
    RemainingBalance?: number;
    InvoiceDate?: string;
    InvoiceNote?: string;
    InvoiceImage?: string;
    ReceiptDate?: string;
    creditAmountUsed?: number;
    cssClass?: string;
    PaymentLabelClass?: string;
    PaymentLabel?: string;
    paidIn?: number;
}
export interface ISaleItemDetail {
    ItemName: string;
    tax: number;
    NetAmountReceivable: number;
    Quantity: number;
}

export interface IOverviewData {
    id?: number;
    billType?: string;
    totalAmount: number;
    totalPayment: number;
    totalOutstanding: number;
    header: string;
    showCard: boolean;
}
