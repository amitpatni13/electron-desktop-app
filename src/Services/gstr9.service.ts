import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IGSTR9Report } from '../Model/Reports.model';
import { ConstantMessages } from '../Constants/constant';

@Injectable()
 export class GSTR9Service {
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Get the details of sales invoice table for GSTR9 Report
    async  getGSTR9SaleData(startDate, endDate) {

        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,P.GSTIN,P.ShippingState,SII.ItemName,SII.HSNCode,SII.Tax,SII.Rate,SII.CGST,SII.SGST,SII.IGST,SII.CESS,SI.InvoiceNumber,SI.InvoiceDate,SI.TotalPayable,SII.SellingPrice,SII.Quantity,"N" as ReverseCharge,"Regular" as InvoiceType, 0 as ECommerceGSTIN, SI.IsSaleReturn from SalesInvoices SI  LEFT Join Party P ON  SI.PartyID=P.PartyID Left Outer Join(Select SalesInvoiceNo,SellingPrice, Quantity,ItemName, TaxSlab1 as Tax,(TaxSlab1Amt+TaxSlab2Amt) as Rate,TaxSlab1Amt as CGST,TaxSlab2Amt as SGST,0 as IGST,0 as CESS,HSNCode From SalesInvoiceItems Union All  Select SalesInvoiceNo,SellingPrice, Quantity,ItemName,TaxSlab3 as Tax,TaxSlab3Amt as Rate,0 as CGST,0 as SGST,TaxSlab3Amt as IGST,0 as CESS,HSNCode  From SalesInvoiceItems Union All  Select SalesInvoiceNo,SellingPrice, Quantity,ItemName,TaxSlab4 as Tax,TaxSlab4Amt as Rate,0 as CGST,0 as SGST,0 as IGST,TaxSlab4Amt as CESS,HSNCode  From SalesInvoiceItems ) SII on SI.SalesInvoiceID=SII.SalesInvoiceNo where (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
         const  GSTR9Data: IGSTR9Report[] = [];
         if (data && data.length > 0) {
                for (const dataRow of data) {
                        GSTR9Data.push({
                            GSTIN: dataRow.GSTIN,
                            InvoiceNumber: dataRow.InvoiceNumber,
                            InvoiceDate: dataRow.InvoiceDate,
                            TotalPayable: dataRow.TotalPayable,
                            HSNNumber: dataRow.HSNCode,
                            ReverseCharge: dataRow.ReverseCharge,
                            SellingPrice: dataRow.SellingPrice,
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
                            isReturnInvoice: dataRow.IsSaleReturn,
                            Measurement: dataRow.Measurement
                        });
                    // }
                }
            }
         return GSTR9Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    async  getGSTR9SalesItemData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.InvoiceNumber,SII.Measurement,SI.TotalPayable,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3, SII.TaxSlab4,SII.Item_ID,SII.HSNCode,SII.SellingPrice,SII.ItemName, SII.Quantity, SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax,SI.IsSaleReturn from SalesInvoices SI LEFT Join Party P ON SI.PartyID=P.PartyID Left Outer Join SalesInvoiceItems SII on SI.SalesInvoiceID=SII.SalesInvoiceNo  where (date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR9Data: IGSTR9Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                        GSTR9Data.push({
                            InvoiceNumber: dataRow.InvoiceNumber,
                            TotalPayable: dataRow.TotalPayable,
                            TotalTax: dataRow.TotalTax,
                            HSNNumber: dataRow.HSNCode,
                            Quantity: dataRow.Quantity,
                            CGST: dataRow.TaxSlab1Amt,
                            SGST: dataRow.TaxSlab2Amt,
                            IGST: dataRow.TaxSlab3Amt,
                            CESS: dataRow.TaxSlab4Amt,
                            Item_ID: dataRow.Item_ID,
                            SellingPrice: dataRow.SellingPrice,
                            RegistrationType: dataRow.RegistrationType,
                            isReturnInvoice: dataRow.IsSaleReturn,
                            TaxSlab1: dataRow.TaxSlab1,
                            TaxSlab2: dataRow.TaxSlab2,
                            TaxSlab3: dataRow.TaxSlab3,
                            TaxSlab4: dataRow.TaxSlab4,
                            Measurement: dataRow.Measurement
                        });
                   }
            }
            return GSTR9Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    async  getGSTR9PurchaceItemData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,SI.PurchaseInvoiceNumber,SII.TaxSlab4,SII.Measurement,SII.TaxSlab3,SII.TaxSlab2,SII.TaxSlab1,SI.TotalAmount,SII.Item_ID,SII.PurchasePrice,SII.ItemName, SII.HSNCode, SII.Quantity,SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax, SI.IsPurchaseReturn from PurchaseInvoices SI LEFT Join Party P ON SI.PartyID=P.PartyID Left Outer Join PurchaseInvoiceItems SII on SI.PurchaseInvoiceID=SII.PurchaseInvoiceNo where (Date(PurchaseInvoiceDate) >= date(?) AND Date(PurchaseInvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR9Data: IGSTR9Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    GSTR9Data.push({
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
                        Measurement: dataRow.Measurement,
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
            return GSTR9Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    async  getGSTR9PurchaseData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,PII.HSNCode,PII.Measurement,P.GSTIN,P.ShippingState,PII.ItemName,PII.Tax,PII.Rate,PII.CGST,PII.SGST,PII.IGST,PII.CESS,PI.PurchaseInvoiceNumber,PI.PurchaseInvoiceDate,PI.TotalAmount,PII.PurchasePrice,PII.Quantity,PI.reverseCharge,"Regular" as InvoiceType, 0 as ECommerceGSTIN, PI.IsPurchaseReturn from PurchaseInvoices PI  LEFT Join Party P ON  PI.PartyID=P.PartyID Left Outer Join(Select PurchaseInvoiceNo,Measurement,HSNCode,PurchasePrice, Quantity,ItemName, TaxSlab1 as Tax,(TaxSlab1Amt+TaxSlab2Amt) as Rate,TaxSlab1Amt as CGST,TaxSlab2Amt as SGST,0 as IGST,0 as CESS From PurchaseInvoiceItems Union All  Select Measurement,HSNCode,PurchaseInvoiceNo,PurchasePrice, Quantity,ItemName,TaxSlab3 as Tax,TaxSlab3Amt as Rate,0 as CGST,0 as SGST,TaxSlab3Amt as IGST,0 as CESS  From PurchaseInvoiceItems  Union All  Select Measurement,HSNCode,PurchaseInvoiceNo,PurchasePrice, Quantity,ItemName,TaxSlab4 as Tax,TaxSlab4Amt as Rate,0 as CGST,0 as SGST,0 as IGST,TaxSlab4Amt as CESS  From PurchaseInvoiceItems ) PII on PI.PurchaseInvoiceID=PII.PurchaseInvoiceNo where (date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) <= date(?)) AND PI.IsActivate="1" AND PI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR9Data: IGSTR9Report[] = [];
            if (data  && data.length > 0) {
                for (const dataRow of data) {
                    GSTR9Data.push({
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
                        Measurement: dataRow.Measurement,
                        ItemName: dataRow.ItemName,
                        PlaceOfSupply: dataRow.ShippingState,
                        RegistrationType: dataRow.RegistrationType,
                        isReturnInvoice: dataRow.IsPurchaseReturn,
                        HSNNumber: dataRow.HSNCode
                    });
                }
            }
            for (const sqldata of GSTR9Data) {
                for (const  rate of ConstantMessages.GSTTaxRate) {
                    if (sqldata.Tax === rate.TaxSlabID) {
                        sqldata.Tax = rate.TaxSlabValue * 100;
                        break;
                    }
                }
                for (const rate of ConstantMessages.IGSTTaxRate) {
                    if (sqldata.Tax === rate.TaxSlabID) {
                        sqldata.Tax = rate.TaxSlabValue * 100;
                        break;
                    }
                }
            }
            return GSTR9Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
