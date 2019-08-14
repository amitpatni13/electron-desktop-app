export interface IExpenseListInsert {

      ExpenseAmount?: number;
      ExpenseDate?: string;
      ReceiptDate?: string;
      ExpensePaidTo?: string;
      ExpenseGST?: string;
      ExpenseCESS?: string;
      ExpenseDetails?: string;
      ExpenseCategoryName?: string;
      ExpenseAttachment?: string;
      ExpenseCategoryID?: number;
}

export interface IExpenseList {
            ExpenseID: number;
            ExpenseAmount?: number;
            ExpenseDate?: string;
            ExpensePaidTo?: string;
            ExpenseCategoryName?: string;
            ExpenseCategoryID?: number;
            BorderColourCode?: any;
            ExpenseMonthData?: string;
            ExpenseMonth?: number;
            ExpenseYear?: number;
            ExpenseDay?: number;
      }

