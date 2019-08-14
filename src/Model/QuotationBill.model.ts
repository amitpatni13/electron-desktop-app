export interface IQuotationBill {
    InvoiceNumber: string;
    PartyName: string;
    InvoiceDate: string;
    SubTotal?: number;
    AdditionalCharges: number;
    TotalDiscount: number;
    TotalTax: number;
    GrandTotal: number;
    PaymentStatus: string;
    InvoiceDueDate?: string;
}
