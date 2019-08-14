import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IGSTR1Report } from '../Model/Reports.model';

@Injectable()
 export class GSTR1Service {
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // Get the details of sales invoice table for GSTR1 Report
    async  getGSTR1SaleData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select P.RegistrationType,P.GSTIN,P.ShippingState,SII.ItemName,SII.Tax,SII.Rate,SII.CGST,SII.SGST,SII.IGST,SII.CESS,SI.InvoiceNumber,SI.InvoiceDate,SI.TotalPayable,SII.SellingPrice,SII.Quantity,"N" as ReverseCharge,"Regular" as InvoiceType, 0 as ECommerceGSTIN, SI.IsSaleReturn from SalesInvoices SI  LEFT Join Party P ON  SI.PartyID=P.PartyID Left Outer Join(Select SalesInvoiceNo,SellingPrice, Quantity,ItemName, TaxSlab1 as Tax,(TaxSlab1Amt+TaxSlab2Amt) as Rate,TaxSlab1Amt as CGST,TaxSlab2Amt as SGST,0 as IGST,0 as CESS From SalesInvoiceItems Union All  Select SalesInvoiceNo,SellingPrice, Quantity,ItemName,TaxSlab3 as Tax,TaxSlab3Amt as Rate,0 as CGST,0 as SGST,TaxSlab3Amt as IGST,0 as CESS  From SalesInvoiceItems Union All  Select SalesInvoiceNo,SellingPrice, Quantity,ItemName,TaxSlab4 as Tax,TaxSlab4Amt as Rate,0 as CGST,0 as SGST,0 as IGST,TaxSlab4Amt as CESS  From SalesInvoiceItems ) SII on SI.SalesInvoiceID=SII.SalesInvoiceNo where (date(InvoiceDate) >= date(?) AND date(InvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const  GSTR1Data: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                        GSTR1Data.push({
                            GSTIN: dataRow.GSTIN,
                            InvoiceNumber: dataRow.InvoiceNumber,
                            InvoiceDate: dataRow.InvoiceDate,
                            TotalPayable: dataRow.TotalPayable,
                            ReverseCharge: dataRow.ReverseCharge,
                            SellingPrice: dataRow.SellingPrice,
                            Quantity: dataRow.Quantity,
                            InvoiceType: dataRow.InvoiceType,
                            ECommerceGSTIN:  dataRow.ECommerceGSTIN,
                            Tax:  dataRow.Tax,
                            Rate: dataRow.Rate,
                            TotalTax: dataRow.TotalTax,
                            IGST: dataRow.IGST,
                            CGST: dataRow.CGST,
                            SGST: dataRow.SGST,
                            CESS:  dataRow.CESS,
                            ItemName: dataRow.ItemName,
                            PlaceOfSupply:  dataRow.ShippingState,
                            RegistrationType: dataRow.RegistrationType,
                            isReturnInvoice: dataRow.IsSaleReturn
                        });
                    // }
                }
            }
            return GSTR1Data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
    async  getGSTR1ItemData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const  query = 'select P.RegistrationType,SI.InvoiceNumber,SI.TotalPayable,SII.TaxSlab1,SII.TaxSlab2,SII.TaxSlab3, SII.TaxSlab4,SII.Item_ID,SII.HSNCode,SII.SellingPrice,SII.ItemName, SII.Quantity, SII.TaxSlab1Amt,SII.TaxSlab2Amt,SII.TaxSlab3Amt,SII.TaxSlab4Amt,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax,SI.IsSaleReturn from SalesInvoices SI LEFT Join Party P ON SI.PartyID=P.PartyID Left Outer Join SalesInvoiceItems SII on SI.SalesInvoiceID=SII.SalesInvoiceNo  where (date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) <= date(?)) AND SI.IsActivate="1" AND SI.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY SII.Item_ID ASC';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const GSTR1Data: IGSTR1Report[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                        GSTR1Data.push({
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
