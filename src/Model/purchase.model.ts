export interface IPurchaseTxnDetail {
    PurchaseInvoiceID?: number;
    PurchaseInvoiceNumber?: string;
    PurchaseInvoiceDate?: string;
    PurchaseReceiptDate: string;
    TotalAmount: number;
    TotalDue: number;
    AmountPaid: number;
    PartyName?: string;
    cssClass?: string;
    PartyId?: number;
    InvoiceAmount?: number;
    outStandingBalance?: number;
    paidIn?: number;
    paidType?: string;
    paymentRef?: string;
    PaymentRefImagePath?: string;
    hsnCode?: number;
    isActive?: number;
    Type?: string;
    otherCosts?: number;
    isPurchaseReturn?: number;
    creditAmountUsed?: number;
    purchaseReturnType?: string;
    PaymentLabelClass?: string;
    PaymentLabel?: string;
    PartyID?: number;
    TotalTax?: number;
    MonthLabel?: string;
    ReverseCharge?: number;
    PurchaseQuotationStatus?: string;
    isPurchaseQuotation?: boolean;
    totalItemsAdded?: number;
    ReceiptDate?: string;
}

export interface IPurchaseItemData {
    id: number;
    name: string;
    purchasePrice: number;
    TotalQuantity: number;
    TaxSlabID1?: number;
    TaxSlabID2?: number;
    TaxSlabID3?: number;
    TaxSlabID4?: number;
    TaxSlabValue1: number;
    TaxSlabValue2: number;
    TaxSlabValue3: number;
    TaxSlabValue4: number;
    hsnCode: string;
    weightUnit?: string;
}
