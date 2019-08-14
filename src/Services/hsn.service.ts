import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IHSN_SAC } from '../Model/productItemsData.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHSNReport } from '../Model/Reports.model';

@Injectable()
export class HSNService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService, private http: HttpClient) { }

    // To get the HSN Response from the server
    async getHSNDataFromServer(desc: string) {
        const url = `http://172.16.63.208:8001/hsn`;
        let httpParams = new HttpParams();
        httpParams = httpParams.append('hsnDesc', desc);
        // return new Promise(async (resolve, reject) => {});
        return await this.http.get(url, { params: httpParams }).toPromise().then((response) => {
            console.log('HSN Service: Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting HSN Data from Server: ', err);
            console.log('Error: ', err);
            return err;
        });
    }

    // To check whether the hsn search is a frequent one, if yes then search the local db else get the response from the server
    async getHSNData(desc: string) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT HSNID,HSNCode,Description,Rate,CESS FROM HSN_SAC WHERE Description LIKE "%${desc}%" OR HSNCode LIKE "%${desc}%"';
        return await this.dbProvider.executeSql(query, []).then(async (data: any) => {
            if (data && data.length) { // If the search response found in db
                const hsnData: IHSN_SAC[] = [];
                for (const dataRow of data  ) {
                    hsnData.push({
                        id: dataRow.HSNID,
                        hsn_sac: dataRow.HSNCode,
                        desc: dataRow.Description,
                        rate: dataRow.Rate,
                        cess: dataRow.CESS
                    });
                    // tslint:disable-next-line:max-line-length
                    hsnData[dataRow].rate = Number(hsnData[dataRow].rate) * 0.01; // converting the % value to decimal number for calculations
                    // tslint:disable-next-line:max-line-length
                    hsnData[dataRow].cess = Number(hsnData[dataRow].cess) * 0.01; // converting the % value to decimal number for calculations
                    await hsnData[dataRow].rate;
                    await  hsnData[dataRow].cess;
                }
                return hsnData;
            } else { // Else return empty array
                return [];
            }
        }).catch((err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To insert the new hsn object in HSN_SAC table in DB, for frequently searched hsn_sac items
    addHSNData(hsnData: IHSN_SAC) {
        const query = `INSERT INTO HSN_SAC ('HSNCode', 'Description', 'Rate', 'CESS') VALUES (?, ?, ?, ?)`;
        const data = [hsnData.hsn_sac, hsnData.desc, hsnData.rate, hsnData.cess];
        return this.dbProvider.executeSql(query, data).then((response) => {
            return response;
        }).catch((err) => {
            console.log('Error inserting HSN Data in DB: ', err);
            console.log('Error: ', err);
            return err;
        });
    }
    // Getting the sale Data Having the HSNCODE
    async GetAllHSNSaleData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select  SII.HSNCode, "Goods" as TypeOfSupply, SII.Item_ID, SII.Quantity, SII.Measurement,SII.SellingPrice,SII.IsSellingPriceTaxInclusive,(SII.TaxSlab1Amt+SII.TaxSlab2Amt+SII.TaxSlab3Amt+SII.TaxSlab4Amt) as TotalTax,SII.TaxSlab1Amt as CGST,SII.TaxSlab2Amt as SGST,SII.TaxSlab3Amt as IGST, SII.TaxSlab4Amt as CESS, SII.TaxSlab1, SII.TaxSlab3,SII.TaxSlab4, SI.IsSaleReturn  from SalesInvoiceItems  SII, SalesInvoices SI WHERE (SII.SalesInvoiceNo = SI.SalesInvoiceID)  AND  (date(SI.InvoiceDate) >= date(?) AND date(SI.InvoiceDate) <= date(?)) AND SI.IsActivate="1"';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const hsnData: IHSNReport[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data)  {
                    hsnData.push({
                        HSNCode: dataRow.HSNCode,
                        TypeOfSupply: dataRow.TypeOfSupply,
                        Item_ID: dataRow.Item_ID,
                        Quantity: dataRow.Quantity,
                        UOM: dataRow.Measurement,
                        SellingPrice: dataRow.SellingPrice,
                        isSellingPriceTaxInclusive: dataRow.IsSellingPriceTaxInclusive,
                        TotalTax: dataRow.TotalTax,
                        CGST: dataRow.CGST,
                        SGST: dataRow.SGST,
                        IGST: dataRow.IGST,
                        CESS: dataRow.CESS,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        isReturnInvoice: dataRow.IsSaleReturn
                    });
                }
            }
            return hsnData;
        }, err => {
            console.log(err);

            return [];
        });
    }

    // Getting the Purchase Data Having the HSNCODE
    async GetAllHSNPurchaseData(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'select  PII.HSNCode, "Goods" as TypeOfSupply, PII.Item_ID, PII.Quantity, PII.Measurement,PII.PurchasePrice,(PII.TaxSlab1Amt+PII.TaxSlab2Amt+PII.TaxSlab3Amt+PII.TaxSlab4Amt) as TotalTax,PII.TaxSlab1Amt as CGST,PII.TaxSlab2Amt as SGST,PII.TaxSlab3Amt as IGST, PII.TaxSlab4Amt as CESS, PII.TaxSlab1, PII.TaxSlab3, PII.TaxSlab4, PI.IsPurchaseReturn from  PurchaseInvoiceItems  PII, PurchaseInvoices PI WHERE (PII.PurchaseInvoiceNo = PI.PurchaseInvoiceID)  AND  (date(PI.PurchaseInvoiceDate) >= date(?) AND date(PI.PurchaseInvoiceDate) <= date(?)) AND PI.IsActivate="1"';
        return await this.dbProvider.executeSql(query, [startDate, endDate]).then((data: any) => {
            const hsnData: IHSNReport[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data)  {
                    hsnData.push({
                        HSNCode: dataRow.HSNCode,
                        TypeOfSupply: dataRow.TypeOfSupply,
                        Item_ID: dataRow.Item_ID,
                        Quantity: dataRow.Quantity,
                        UOM: dataRow.Measurement,
                        SellingPrice: dataRow.PurchasePrice,
                        TotalTax: dataRow.TotalTax,
                        CGST: dataRow.CGST,
                        SGST: dataRow.SGST,
                        IGST: dataRow.IGST,
                        CESS: dataRow.CESS,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        isReturnInvoice: dataRow.IsPurchaseReturn
                    });
                }
            }
            return hsnData;
        }, err => {
            console.log(err);

            return [];
        });
    }
    // getting The Description Corresponding to HsnCode and Rate
    async getDescriptionOfHSNData(hsncode, rate) {
        const query = 'select Description from HSN_SAC where HSNCode = ? and Rate = ?';
        return await this.dbProvider.executeSql(query, [hsncode, rate]).then(async (data: any) => {
            let Description = '';
            if (data && data.length > 0) {
                Description = data[0].Description;
            }
            return await Description;
        }, err => {
            console.log(err);
            return '';
        });

    }
}
