import { Injectable } from '@angular/core';
import { ConstantMessages } from '../Constants/constant';

@Injectable()
export class MonthLabelService {

    /** To get the Type of Bill and add appropriate month label as oer th items data received */
    getMonthLabelData(BillType: string, AllItemsData: any[], callback) {
        const MonthLabelData = [];
        const months = ConstantMessages.Months;
        const ItemsList = [];
        this.sortItems(BillType, AllItemsData); // Sorting the list by date in descending order before adding labels
        for (const data of AllItemsData) {  // data received from the database
            data.MonthLabel = '';
            let currentItemDate: Date;
            // tslint:disable-next-line:max-line-length
            if (ConstantMessages.MONTH_LABEL_TYPES.SALE === BillType) { currentItemDate = new Date(data.InvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.PURCHASE === BillType) { currentItemDate = new Date(data.PurchaseInvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.PAYMENT === BillType) { currentItemDate = new Date(data.InvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.EXPENSE === BillType) { currentItemDate = new Date(data.ExpenseDate); }
            if (!ItemsList.length) {  // check if the array is empty or not
                const InsertDate = {
                    Month: currentItemDate.getMonth(),
                    Year: currentItemDate.getFullYear()
                };
                // tslint:disable-next-line:max-line-length
                MonthLabelData.push(InsertDate);  // store the month and year if same month is present in the array then insert below that index
                data.MonthLabel = months[currentItemDate.getMonth()] + ' ' + currentItemDate.getFullYear(); // Show the heading for the item
                ItemsList.push(data); // insert the first item in the array
            } else { // if it is not the first item which is getting inserted in the array
                let ItemsListDate: Date;
                // tslint:disable-next-line:max-line-length
                if (ConstantMessages.MONTH_LABEL_TYPES.SALE === BillType) { ItemsListDate = new Date(ItemsList[ItemsList.length - 1].InvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.PURCHASE === BillType) { ItemsListDate = new Date(ItemsList[ItemsList.length - 1].PurchaseInvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.PAYMENT === BillType) { ItemsListDate = new Date(ItemsList[ItemsList.length - 1].InvoiceDate); } else if (ConstantMessages.MONTH_LABEL_TYPES.EXPENSE === BillType) { ItemsListDate = new Date(ItemsList[ItemsList.length - 1].ExpenseDate); }
                // tslint:disable-next-line:max-line-length
                if (currentItemDate.getMonth() !== ItemsListDate.getMonth() || ItemsListDate.getFullYear() !== currentItemDate.getFullYear()) { // check if previous inserted month is same or not
                    // tslint:disable-next-line:max-line-length
                    const VerifyMonth = this.VerifyMonthExistOrNot(currentItemDate.getMonth(), currentItemDate.getFullYear(), MonthLabelData); // verify whether that month exist in the array or not
                    if (VerifyMonth) { // if the month exist in the array then insert below that index
                        data.MonthLabel = '';
                        ItemsList.push(data);
                    } else {
                        const ItemDateData = {
                            Month: currentItemDate.getMonth(),
                            Year: currentItemDate.getFullYear()
                        };
                        MonthLabelData.push(ItemDateData); // insert the month for that item which is not present in that array
                        data.MonthLabel = months[currentItemDate.getMonth()] + ' ' + currentItemDate.getFullYear();
                        ItemsList.push(data); // if it is the last index then insert it at the last position of the array
                    }
                } else {
                    data.MonthLabel = '';
                    ItemsList.push(data); // insert the item into the array
                }
            }
        }
        callback(ItemsList); // To return the item list along with the month label
    }

    /** Verify whether month and year are present in the items list or not */
    VerifyMonthExistOrNot(Month, Year, MonthLabelData) {
        for (const data of MonthLabelData) {
            if (data.Month === Month && data.Year === Year) { return true; }
        }
        return false;
    }

    /** To sort the items list in descending order of date */
    sortItems(BillType: string, itemsList: any[]) {
        let item1Date: Date;
        let item2Date: Date;
        itemsList.sort((item1, item2) => {
            if (ConstantMessages.MONTH_LABEL_TYPES.SALE === BillType) {
                item1Date = new Date(item1.InvoiceDate);
                item2Date = new Date(item2.InvoiceDate);
            } else if (ConstantMessages.MONTH_LABEL_TYPES.PURCHASE === BillType) {
                item1Date = new Date(item1.PurchaseInvoiceDate);
                item2Date = new Date(item2.PurchaseInvoiceDate);
            } else if (ConstantMessages.MONTH_LABEL_TYPES.PAYMENT === BillType) {
                item1Date = new Date(item1.InvoiceDate);
                item2Date = new Date(item2.InvoiceDate);
            } else if (ConstantMessages.MONTH_LABEL_TYPES.EXPENSE === BillType) {
                item1Date = new Date(item1.ExpenseDate);
                item2Date = new Date(item2.ExpenseDate);
            }
            return item1Date > item2Date ? -1 : item1Date < item2Date ? 1 : 0;
        });
    }
}
