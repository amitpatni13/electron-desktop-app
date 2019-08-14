import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IProductItemsData, IProductItemsFooterData } from '../Model/productItemsData.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class SalesInvoiceItems {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // tslint:disable-next-line:max-line-length
    // To store the Transactions Data provided by user in Sales Invoice Items Table, this will create transactions details for us to use later
    async insertSalesInvoiceItemsDataToDB(item: IProductItemsData) {
        if (undefined !== item && null !== item) {
            if (item.TaxSlabData === 0) {
                item.TaxSlabData = null;
            }
            if (item.TaxSlabIGSTData === 0) {
                item.TaxSlabIGSTData = null;
            }
            if (item.TaxSlabCESSData === 0) {
                item.TaxSlabCESSData = null;
            }
            if (item.weightUnit === undefined) {
                item.weightUnit = '';
            }
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO SalesInvoiceItems (\'SalesInvoiceNo\', \'Item_ID\', \'ItemName\', \'SellingPrice\', \'Quantity\', \'TaxSlab1\', \'TaxSlab2\', \'TaxSlab3\', \'TaxSlab4\', \'TaxSlab1Amt\', \'TaxSlab2Amt\', \'TaxSlab3Amt\', \'TaxSlab4Amt\', \'NetAmountReceivable\', \'Discount\', \'HSNCode\', \'IsActivate\', \'SellingPriceTax\', \'IsSellingPriceTaxInclusive\', \'Measurement\',\'Item_Desc\', \'BusinessID\') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'1\', ?, ?, ?,?, (SELECT BusinessID FROM Business WHERE IsActive = \'1\'))';
            // tslint:disable-next-line:max-line-length
            const data = [item.salesInvoiceID, item.id, item.name, item.discountedPrice, item.count, item.TaxSlabData, item.TaxSlabData, item.TaxSlabIGSTData, item.TaxSlabCESSData, item.TaxSlabCGST, item.TaxSlabSGST, item.TaxSlabIGST, item.TaxSlabCESS, (item.discountedPrice + item.tax), item.discount, item.HSN_SAC, item.sellingPriceTax, Number(item.isSellingPriceTaxInclusive), item.weightUnit, item.description];
            return await this.dbProvider.executeSql(query, data).then((dataRow) => {
                console.log(dataRow);
                return dataRow;
            }, (err) => {
               console.log('Error', err);
               return err;
            }
            );
        }
    }

    // tslint:disable-next-line:max-line-length
    // To store the Final Bill From Data provided by user in DraftSalesInvoice Table, this will create transactions which the user can use it if he wants complete the transaction
    // it return the updated row value
    async insertDraftFinalBillDataToDB(footerData: IProductItemsFooterData, BillImage: string, InvoiceType: number) {
        let InvoiceDate = new Date();
        // tslint:disable-next-line:max-line-length
        if (footerData.invoiceDate) { InvoiceDate = new Date(footerData.invoiceDate); } else { footerData.invoiceDate = (new Date()).toISOString().split('T')[0]; } // If Invoice date is not set
        InvoiceDate.setMonth(InvoiceDate.getMonth() + 3);
        // tslint:disable-next-line:max-line-length
        const InvoiceDueDate = (new Date(InvoiceDate)).toISOString().split('T')[0]; // Setting the Invoice Due Date to 90 Days more than the invoice date
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO DraftSalesInvoices ("InvoiceDate", "InvoiceNumber", "InvoiceDueDate", "PartyID", "PartyName", "Status", "TotalAmount", "Discount","DiscountIn", "OtherCosts", "TotalTax", "TotalPayable", "AmountReceived", "PaymentModeID", "PaymentRef", "PaymentRefImagePath", "InvoiceShared","InvoiceNote", "IsActivate", "SaleDraftPage", "categoryPageRedirect", "categoryPageRedirectName", "InvoiceType","Eway", "isSaleQuotation", "SaleQuotationStatus", "BusinessID") VALUES (?, "1", ?, ?, ?, "Payment Received", ?, ?, ?,?, "", ?, ?, ?, ?, ?, "", ?, "1", ?, ?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [footerData.invoiceDate, InvoiceDueDate, footerData.partyId, footerData.partyName, footerData.totalBillPrice, footerData.totalBillDiscount, footerData.discountIn, footerData.otherCosts, footerData.totalPayable, footerData.amtReceived, footerData.paidIn, footerData.paymentRefNo, BillImage, footerData.invoiceNote, footerData.SaleDraftPage, footerData.categoryPageRedirect, footerData.categoryPageRedirectName, InvoiceType, footerData.Eway, Number(footerData.isSaleQuotation), footerData.SaleQuotationStatus];
        return await this.dbProvider.executeSql(query, data).then(
            (salesInvoiceResponse) => {
                console.log(salesInvoiceResponse);
                return salesInvoiceResponse;
            }, (err) => {
                console.log('Error', err);
                return err;
            });
    }

    // To delete the DraftSalesItemData from database by passing the invoice id for that transaction.
    async deleteDraftSalesItemDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update DraftSalesInvoiceItems SET IsActivate="0" where SalesInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error', err);
            return err;
        });
    }

    // update the draft bill data if user again click on save button
    // return the updated row value
    async UpdateDraftFinalBillDataToDB(footerData: IProductItemsFooterData, BillImage: string, TaxInvoice) {
        let InvoiceDate = new Date();
        // tslint:disable-next-line:max-line-length
        if (footerData.invoiceDate) { InvoiceDate = new Date(footerData.invoiceDate); } else { footerData.invoiceDate = (new Date()).toISOString().split('T')[0]; } // If Invoice date is not set
        InvoiceDate.setMonth(InvoiceDate.getMonth() + 3);
        // tslint:disable-next-line:max-line-length
        const InvoiceDueDate = (new Date(InvoiceDate)).toISOString().split('T')[0]; // Setting the Invoice Due Date to 90 Days more than the invoice date
        // tslint:disable-next-line:max-line-length
        const query = 'update DraftSalesInvoices SET InvoiceDate = ?, InvoiceDueDate = ?, TotalAmount = ?, Discount = ?,DiscountIn = ?, OtherCosts = ?, TotalTax = ?, TotalPayable = ?, AmountReceived = ?, PaymentModeID = ?, PaymentRef = ?, PaymentRefImagePath = ?, InvoiceNote = ?,SaleDraftPage = ?, categoryPageRedirectName = ?, categoryPageRedirect = ?, InvoiceType = ?, PartyID = ?, PartyName = ?, isSaleQuotation = ?, SaleQuotationStatus = ?,Eway=? where InvoiceNumber = ?';
        // tslint:disable-next-line:max-line-length
        const data = [footerData.invoiceDate, InvoiceDueDate, footerData.totalBillPrice, footerData.totalBillDiscount, footerData.discountIn, footerData.otherCosts, footerData.totalTax, footerData.totalPayable, footerData.amtReceived, footerData.paidIn, footerData.paymentRefNo, BillImage, footerData.invoiceNote, footerData.SaleDraftPage, footerData.categoryPageRedirectName, footerData.categoryPageRedirect, TaxInvoice, footerData.partyId, footerData.partyName, Number(footerData.isSaleQuotation), footerData.SaleQuotationStatus, footerData.Eway, footerData.invoiceNumber];
        return await this.dbProvider.executeSql(query, data).then(
            (DraftSalesInvoiceResponse) => {
                console.log(DraftSalesInvoiceResponse);
                return DraftSalesInvoiceResponse;
            },
            (err) => {
                console.log('Error', err);
                return err;
            }
        );
    }

    // To store the Transactions Draft data in Sales Invoice Items Draft Table, this will create transactions details for us to use later
    async insertDraftSalesInvoiceItemsDataToDB(item: IProductItemsData) {
        if (undefined !== item && null !== item) {
            if (item.weightUnit === undefined) {
                item.weightUnit = '';
            }
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO DraftSalesInvoiceItems ("SalesInvoiceNo", "Item_ID", "ItemName", "SellingPrice","maximumRetailPrice", "Quantity", "TaxSlab1", "TaxSlab2", "TaxSlab3", "TaxSlab4", "TaxSlab1Amt", "TaxSlab2Amt", "TaxSlab3Amt", "TaxSlab4Amt", "NetAmountReceivable", "Discount", "HSNCode", "IsActivate", "SellingPriceTax", "IsSellingPriceTaxInclusive", "Measurement","Item_Desc", "BusinessID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "1", ?, ?, ?,?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
            // tslint:disable-next-line:max-line-length
            const data = [item.salesInvoiceID, item.id, item.name, item.discountedPrice, item.maximumRetailPrice, item.count, item.TaxSlabData, item.TaxSlabData, item.TaxSlabIGSTData, item.TaxSlabCESSData, item.TaxSlabCGST, item.TaxSlabSGST, item.TaxSlabIGST, item.TaxSlabCESS, (item.discountedPrice + item.tax), item.discount, item.HSN_SAC, (item.TaxSlabCGST + item.TaxSlabSGST + item.TaxSlabIGST + item.TaxSlabCESS), Number(item.isSellingPriceTaxInclusive), item.weightUnit, item.description];
            return await this.dbProvider.executeSql(query, data).then((dataRow) => {
                console.log(data);
                return data;
            }, (err) => {
                console.log('Error', err);
                return err;
            });
        }
    }

    // tslint:disable-next-line:max-line-length
    // To store the Sales Invoice Number generated on final bill page in DraftSalesInvoice Table, this will be helpful in retrieving transactions...
    updateDraftSalesInvoiceNumberInDB(invoiceId: number, invoiceNumber: string) {
        const query = 'UPDATE DraftSalesInvoices SET InvoiceNumber = ? WHERE SalesInvoiceID = ?';
        return this.dbProvider.executeSql(query, [invoiceNumber, invoiceId]).then((data) => {
            console.log('Update Sent to DB...'); console.log(data);
            return data;
        },
            (err) => {
                console.log('Error', err);
                return err;
            });
    }
}
