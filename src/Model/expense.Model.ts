export interface IExpenseListIns {
    ExpenseID?: number;
    ExpenseAmount: number;
    ExpenseDate: string;
    ReceiptDate?: string;
    ExpensePaidTo: string;
    ExpenseGST?: string;
    ExpenseCESS?: string;
    ExpenseDetails?: string;
    PurchaseIn?: string;
    ExpenseAttachment?: string;
    ExpenseColor?: string;
    ExpenseCategoryName?: string;
    ExpenseCategoryID?: number;
    PartyID?: number;
    IsActivate?: number;
}

export class ExpenseModel implements IExpenseListIns {
    ExpenseID?: number;
    ExpenseId: number;
    ExpenseAmount: number;
    ExpenseDate: string;
    ReceiptDate?: string;
    ExpensePaidTo: string;
    ExpenseGST?: string;
    ExpenseCESS?: string;
    ExpenseDetails?: string;
    PurchaseIn?: string;
    ExpenseAttachment?: string;
    ExpenseColor?: string;
    ExpenseCategoryID?: number;
    ExpenseCategoryName?: string;

    constructor() {
        this.ExpenseID = null;
        this.ExpenseAmount = null;
        this.ExpenseDate = null;
        this.ReceiptDate = null;
        this.ExpensePaidTo = null;
        this.ExpenseGST = null;
        this.ExpenseCESS = null;
        this.ExpenseDetails = null;
        this.PurchaseIn = null;
        this.ExpenseAttachment = null;
        this.ExpenseColor = null;
        this.ExpenseCategoryName = null;
        this.ExpenseCategoryID = null;
        this.ExpenseCategoryName = null;

    }

}

export interface IExpenseCategories {
id?: number;
name?: string;
color?: string;
date?: string;
}
