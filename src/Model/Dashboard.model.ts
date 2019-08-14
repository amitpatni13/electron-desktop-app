export interface IExpenseData {
    totalExpenseAmount: number;
    expenseCategoryID: number;
    expenseCategoryName?: string;
    expenseDate?: string;
    expenseCategoryColor?: string;
}

export interface ISalesData {
    TotalAmount?: number;
    saleInvoiceNumber: string;
    saleDate: string;
    totalSaleAmount?: number;
    itemID?: number;
    itemName?: string;
    itemQuantity?: number;
    itemPurchasePrice?: number;
    itemSellingPrice?: number;
}
