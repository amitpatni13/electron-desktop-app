import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IGSTR1Report } from '../Model/Reports.model';

@Injectable()
export class GSTR3BService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    /*GET THE PURCHASE ITEM DATA FROM DATABASE */
    async  getPurchaseItemDataIntraState(startDate, endDate, state) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.reverseCharge,SI.PurchaseInvoiceNumber,SI.TotalAmount,SII.Item_ID,SII.PurchasePrice,SII.ItemName, SII.Quantity,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3,SII.TaxSlab4,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsPurchaseReturn from PurchaseInvoices SI left outer Join Party P ON SI.PartyID=P.PartyID Left Outer Join PurchaseInvoiceItems SII on SI.PurchaseInvoiceID=SII.PurchaseInvoiceNo where (Date(PurchaseInvoiceDate) >= date(?) AND Date(PurchaseInvoiceDate) <= date(?)) AND SI.IsActivate= "1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")  ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const PurchaseItemData: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseItemData.push({
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        TotalPayable: dataRow.TotalAmount,
                        ItemName: dataRow.ItemName,
                        TotalTax: dataRow.TotalTax,
                        Quantity: dataRow.Quantity,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        CGST: dataRow.TaxSlab1Amt,
                        SGST: dataRow.TaxSlab2Amt,
                        IGST: dataRow.TaxSlab3Amt,
                        CESS: dataRow.TaxSlab4Amt,
                        SellingPrice: dataRow.PurchasePrice,
                        Item_ID: dataRow.Item_ID,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsPurchaseReturn,
                        RevereseCharge: dataRow.reverseCharge
                    });
                }
            }
            return PurchaseItemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    /*GET THE PURCHASE ITEM DATA FROM DATABASE */
    async  getPurchaseItemDataInterState(startDate, endDate, state) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.reverseCharge,SI.PurchaseInvoiceNumber,SI.TotalAmount,SII.Item_ID,SII.PurchasePrice,SII.ItemName, SII.Quantity,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3,SII.TaxSlab4,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsPurchaseReturn from PurchaseInvoices SI left outer Join Party P ON SI.PartyID=P.PartyID Left Outer Join PurchaseInvoiceItems SII on SI.PurchaseInvoiceID=SII.PurchaseInvoiceNo where (Date(PurchaseInvoiceDate) >= date(?) AND Date(PurchaseInvoiceDate) <= date(?)) AND SI.IsActivate=\'1\' AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') and P.ShippingState!=? ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate, state]).then((data: any ) => {
            const PurchaseItemData: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseItemData.push({
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        TotalPayable: dataRow.TotalAmount,
                        ItemName: dataRow.ItemName,
                        TotalTax: dataRow.TotalTax,
                        Quantity: dataRow.Quantity,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        CGST: dataRow.TaxSlab1Amt,
                        SGST: dataRow.TaxSlab2Amt,
                        IGST: dataRow.TaxSlab3Amt,
                        CESS: dataRow.TaxSlab4Amt,
                        SellingPrice: dataRow.PurchasePrice,
                        Item_ID: dataRow.Item_ID,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsPurchaseReturn,
                        RevereseCharge: dataRow.reverseCharge
                    });
                }
            }
            return PurchaseItemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    /*GET THE SALE ITEM DATA FROM DATABASE */
    async  getSaleItemDataIntraState(startDate, endDate, state) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.InvoiceNumber,SI.TotalPayable,SII.Item_ID,SII.SellingPrice,SII.ItemName, SII.Quantity,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3,SII.TaxSlab4,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsSaleReturn from SalesInvoices SI Left Outer Join Party P ON SI.PartyID=P.PartyID Left Outer Join SalesInvoiceItems SII on SI.SalesInvoiceID=SII.SalesInvoiceNo where (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) AND SI.IsActivate=\'1\' AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const SaleItemData: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    SaleItemData.push({
                        InvoiceNumber: dataRow.InvoiceNumber,
                        TotalPayable: dataRow.TotalPayable,
                        ItemName: dataRow.ItemName,
                        TotalTax: dataRow.TotalTax,
                        Quantity: dataRow.Quantity,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        CGST: dataRow.TaxSlab1Amt,
                        SGST: dataRow.TaxSlab2Amt,
                        IGST: dataRow.TaxSlab3Amt,
                        CESS: dataRow.TaxSlab4Amt,
                        Item_ID: dataRow.Item_ID,
                        SellingPrice: dataRow.SellingPrice,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsSaleReturn
                    });
                }
            }
            return SaleItemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    // tslint:disable-next-line:jsdoc-format
    /**GET THE SALE ITEM DATA FROM DATABASE */
    async  getSaleItemDataInterState(startDate, endDate, state) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,P.ShippingState,SI.InvoiceNumber,SI.PartyID,SI.TotalPayable,SII.Item_ID,SII.SellingPrice,SII.ItemName, SII.Quantity,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3,SII.TaxSlab4,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsSaleReturn from SalesInvoices SI LEFT outer Join Party P ON SI.PartyID=P.PartyID Left Outer Join SalesInvoiceItems SII on SI.SalesInvoiceID=SII.SalesInvoiceNo where (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") and P.ShippingState!=? ORDER BY P.PartyID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate, state]).then((data: any) => {
            const SaleItemData: IGSTR1Report[] = [];
            if ( data && data.length > 0) {
                for (const dataRow of data) {
                    SaleItemData.push({
                        InvoiceNumber: dataRow.InvoiceNumber,
                        TotalPayable: dataRow.TotalPayable,
                        ItemName: dataRow.ItemName,
                        TotalTax: dataRow.TotalTax,
                        Quantity: dataRow.Quantity,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        CGST: dataRow.TaxSlab1Amt,
                        SGST: dataRow.TaxSlab2Amt,
                        IGST: dataRow.TaxSlab3Amt,
                        CESS: dataRow.TaxSlab4Amt,
                        Item_ID: dataRow.Item_ID,
                        PartyID: dataRow.PartyID,
                        SellingPrice: dataRow.SellingPrice,
                        PartyShippingState: dataRow.ShippingState,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsSaleReturn
                    });
                }
            }
            return SaleItemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
