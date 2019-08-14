import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IGSTR1Report } from '../Model/Reports.model';

@Injectable()
export class GSTR2Service {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Get the details of sales invoice table for GSTR1 Report
    async  getGSTR2SaleData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,P.GSTIN,P.ShippingState,PII.ItemName,PII.Tax,PII.Rate,PII.CGST,PII.SGST,PII.IGST,PII.CESS,PI.PurchaseInvoiceNumber,PI.PurchaseInvoiceDate,PI.TotalAmount,PII.PurchasePrice,PII.Quantity,PI.reverseCharge, "Regular" as InvoiceType, 0 as ECommerceGSTIN, PI.IsPurchaseReturn from PurchaseInvoices PI  LEFT Join Party P ON  PI.PartyID=P.PartyID Left Outer Join(Select PurchaseInvoiceNo,PurchasePrice, Quantity,ItemName, TaxSlab1 as Tax,(TaxSlab1Amt+TaxSlab2Amt) as Rate,TaxSlab1Amt as CGST,TaxSlab2Amt as SGST,0 as IGST,0 as CESS From PurchaseInvoiceItems Union All  Select PurchaseInvoiceNo,PurchasePrice, Quantity,ItemName,TaxSlab3 as Tax,TaxSlab3Amt as Rate,0 as CGST,0 as SGST,TaxSlab3Amt as IGST,0 as CESS  From PurchaseInvoiceItems  Union All  Select PurchaseInvoiceNo,PurchasePrice, Quantity,ItemName,TaxSlab4 as Tax,TaxSlab4Amt as Rate,0 as CGST,0 as SGST,0 as IGST,TaxSlab4Amt as CESS  From PurchaseInvoiceItems ) PII on PI.PurchaseInvoiceID=PII.PurchaseInvoiceNo where (date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) <= date(?)) AND PI.IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR1Data: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    GSTR1Data.push({
                        GSTIN: dataRow.GSTIN,
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        InvoiceDate: dataRow.PurchaseInvoiceDate,
                        TotalPayable: dataRow.TotalAmount,
                        ReverseCharge: dataRow.reverseCharge,
                        SellingPrice: dataRow.PurchasePrice,
                        Quantity: dataRow.Quantity,
                        InvoiceType: dataRow.InvoiceType,
                        ECommerceGSTIN: dataRow.ECommerceGSTIN,
                        Tax: dataRow.Tax,
                        Rate: dataRow.Rate,
                        TotalTax: dataRow.TotalTax,
                        IGST: dataRow.IGST,
                        CGST: dataRow.CGST,
                        SGST: dataRow.SGST,
                        CESS: dataRow.CESS,
                        ItemName: dataRow.ItemName,
                        PlaceOfSupply: dataRow.ShippingState,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsPurchaseReturn
                    });
                }
            }
            return GSTR1Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    async  getGSTR2ItemData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.PurchaseInvoiceNumber,SII.TaxSlab4,SII.TaxSlab3,SII.TaxSlab2,SII.TaxSlab1,SI.TotalAmount,SII.Item_ID,SII.PurchasePrice,SII.ItemName, SII.HSNCode, SII.Quantity,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsPurchaseReturn from PurchaseInvoices SI LEFT Join Party P ON SI.PartyID=P.PartyID Left Outer Join PurchaseInvoiceItems SII on SI.PurchaseInvoiceID=SII.PurchaseInvoiceNo where (Date(PurchaseInvoiceDate) >= date(?) AND Date(PurchaseInvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR1Data: IGSTR1Report[] = [];
            if (data.length > 0) {
                for (const dataRow of data) {
                    GSTR1Data.push({
                        InvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        TotalPayable: dataRow.TotalAmount,
                        ItemName: dataRow.ItemName,
                        TotalTax: dataRow.TotalTax,
                        Quantity: dataRow.Quantity,
                        HSNNumber: dataRow.HSNCode,
                        CGST: dataRow.TaxSlab1Amt,
                        SGST: dataRow.TaxSlab2Amt,
                        IGST: dataRow.TaxSlab3Amt,
                        CESS: dataRow.TaxSlab4Amt,
                        SellingPrice: dataRow.PurchasePrice,
                        Item_ID: dataRow.Item_ID,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsPurchaseReturn,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4
                    });
                }
            }
            return GSTR1Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
