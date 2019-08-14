import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IProductItemsFooterData } from '../Model/productItemsData.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ConstantMessages } from '../Constants/constant';
import { AllItems } from '../BizLogic/itemData';
import { TransactionDataService } from './transactionDataService';

@Injectable()
export class FinalBillDBService {
    public Categories = [];
    public salesInvoiceId: number;
    public oldPartyId: number; // In case of Sale Edit
    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, public TransactionData: TransactionDataService, public logService: ErrorLogService, public itemData: AllItems) { }

    /**
     * To get the PaymentID for the payment method chosen by user, to be stored in SalesInvoice Table.
     * It returns multiple rows from payment mode table
     */
    async getPaymentModeFromDB(PaymentMode: string) {
        const paymentModes = [];
        if (ConstantMessages.BillType.SALE === PaymentMode) {
            // tslint:disable-next-line:max-line-length
            for (let PaymentModeSalesData = 0; PaymentModeSalesData < ConstMessages.SalesPaymentMode.PaymentModeID.length; PaymentModeSalesData++) {
                paymentModes.push({
                    PaymentModeID: ConstMessages.SalesPaymentMode.PaymentModeID[PaymentModeSalesData],
                    PaymentModeValue: ConstMessages.SalesPaymentMode.PaymentModeValue[PaymentModeSalesData]
                });
            }
        }
        if (ConstantMessages.BillType.PURCHASE === PaymentMode) {
            for (let PaymentModeData = 0; PaymentModeData < ConstMessages.PurchasePaymentMode.PaymentModeID.length; PaymentModeData++) {
                paymentModes.push({
                    PaymentModeID: ConstMessages.PurchasePaymentMode.PaymentModeID[PaymentModeData],
                    PaymentModeValue: ConstMessages.PurchasePaymentMode.PaymentModeValue[PaymentModeData]
                });
            }
        }
        if (ConstantMessages.BillType.SALE_RETURN === PaymentMode) {
            for (let PaymentModeData = 0; PaymentModeData < ConstMessages.SalesReturnPaymentMode.PaymentModeID.length; PaymentModeData++) {
                paymentModes.push({
                    PaymentModeID: ConstMessages.SalesReturnPaymentMode.PaymentModeID[PaymentModeData],
                    PaymentModeValue: ConstMessages.SalesReturnPaymentMode.PaymentModeValue[PaymentModeData]
                });
            }
        }
        if (ConstantMessages.BillType.PURCHASE_RETURN === PaymentMode) {
            // tslint:disable-next-line:max-line-length
            for (let PaymentModeData = 0; PaymentModeData < ConstMessages.PurchaseReturnPaymentMode.PaymentModeID.length; PaymentModeData++) {
                paymentModes.push({
                    PaymentModeID: ConstMessages.PurchaseReturnPaymentMode.PaymentModeID[PaymentModeData],
                    PaymentModeValue: ConstMessages.PurchaseReturnPaymentMode.PaymentModeValue[PaymentModeData]
                });
            }
        }
        return await paymentModes;
    }
    // to delete the DraftInvoiceData from database by passing the invoice id for that transaction.
    deleteDraftInvoiceDataFromDB(invoiceId) {
        return this.dbProvider.executeSql('Update DraftSalesInvoices SET IsActivate="0" where SalesInvoiceID=?', [invoiceId]).then(
            (data) => {
                console.log('deleted successfully');
                return data;
            }, (err) => {
                console.log('Error fetching DraftInvoiceData data: ' + err);
                return err;
            }
        );
    }

    // to select the invoice prefix changed value from database
    async SelectAutoIncrementInvoice(InvoiceConfigName, InvoiceConfigId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select InvoiceConfigFieldValue from InvoiceConfiguration WHERE InvoiceConfigFieldName = ?', [InvoiceConfigName]).then((data: any) => {
            let InvoiceData: any;
            if (data && data.length > 0) {
                InvoiceData = {
                    InvoiceVerify: data[0].InvoiceConfigFieldValue,
                };
            }
            return InvoiceData;
        },
            (err) => {
                console.log('Error: ', err);
                return err;
             });

    }
    // selecting the invoiceNumber by passing the previous sales invoice id
    SelectPreviousInvoiceNumber(InvoiceData) {
        const query = 'select InvoiceNumber from SalesInvoices where SalesInvoiceID=?';
        return this.dbProvider.executeSql(query, [InvoiceData]).then(
            (data: any) => {
                let salesInvoiceResponse: any;
                if (data && data.length > 0) {
                    salesInvoiceResponse = {
                        InvoiceNumber: data[0].InvoiceNumber
                    };
                }
                return salesInvoiceResponse;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }
    // To store the Final Bill From Data provided by user in SalesInvoice Table, this will create transactions for us to use later
    async insertFinalBillDataToDB(footerData: IProductItemsFooterData, BillImage: string) {
        const  TodaysDate = new Date();
        // tslint:disable-next-line:max-line-length
        const  TodaysTime = new Date(TodaysDate.getTime() - TodaysDate.getTimezoneOffset() * 60000).toISOString().split('T')[1].split('.')[0];
        const InvoiceDate = new Date(footerData.invoiceDate);
        footerData.invoiceDate = InvoiceDate.toISOString().split('T')[0] + ' ' + TodaysTime;
        InvoiceDate.setMonth(InvoiceDate.getMonth() + 3);
        const InvoiceDueDate = (new Date(InvoiceDate.toISOString().split('T')[0])).toISOString().split('T')[0] + ' ' + TodaysTime;
        // tslint:disable-next-line:max-line-length
        if (undefined === footerData.creditAmountUsed || null === footerData.creditAmountUsed || isNaN(Number(footerData.creditAmountUsed))) { footerData.creditAmountUsed = 0; }
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO SalesInvoices ("InvoiceDate", "InvoiceNumber", "InvoiceDueDate", "PartyID", "PartyName", "Status", "TotalAmount", "Discount", "OtherCosts", "TotalTax", "TotalPayable", "AmountReceived", "PaymentModeID", "PaymentRef", "PaymentRefImagePath", "InvoiceShared", "InvoiceNote", "IsActivate", "CreditsUsed", "BusinessID") VALUES (?, "1", ?, ?, ?, "Payment Received", ?, ?, ?, \'\', ?, ?, ?, ?, ?, "", ?, "1", ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [footerData.invoiceDate, InvoiceDueDate, footerData.partyId, footerData.partyName, footerData.totalBillPrice, footerData.totalBillDiscountFinal, footerData.otherCosts, Math.round(footerData.totalPayable), Math.round(footerData.amtReceived), footerData.paidIn, footerData.paymentRefNo, BillImage, footerData.invoiceNote, footerData.creditAmountUsed];
        return await this.dbProvider.executeSql(query, data).then((salesInvoiceResponse) => {
            console.log(salesInvoiceResponse);
            return salesInvoiceResponse;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To store the Final Bill From Data provided by user in SalesInvoice Table, this will create transactions for us to use later
    async insertFinalBillDataToDataBase(footerData: IProductItemsFooterData, BillImage: string, InvoiceType: number) {
        const TodaysDate = new Date();
        // tslint:disable-next-line:max-line-length
        const  TodaysTime = new Date(TodaysDate.getTime() - TodaysDate.getTimezoneOffset() * 60000).toISOString().split('T')[1].split('.')[0];
        const InvoiceDate = new Date(footerData.invoiceDate);
        footerData.invoiceDate = InvoiceDate.toISOString().split('T')[0] + ' ' + TodaysTime;
        InvoiceDate.setMonth(InvoiceDate.getMonth() + 3);
       // let InvoiceDueDate = (new Date(InvoiceDate.toISOString().split('T')[0])).toISOString().split('T')[0] + ' ' + TodaysTime;
        // tslint:disable-next-line:max-line-length
        if (undefined === footerData.creditAmountUsed || null === footerData.creditAmountUsed || isNaN(Number(footerData.creditAmountUsed))) { footerData.creditAmountUsed = 0; }
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO SalesInvoices ("InvoiceDate", "InvoiceNumber", "InvoiceDueDate", "PartyID", "PartyName", "Status", "TotalAmount", "Discount", "OtherCosts", "TotalTax", "TotalPayable", "AmountReceived", "PaymentModeID", "PaymentRef", "PaymentRefImagePath", "InvoiceShared", "InvoiceNote", "IsActivate", "CreditsUsed", "InvoiceType", "Eway", "BusinessID") VALUES (?, "1", ?, ?, ?, "Payment Received", ?, ?, ?, "", ?, ?, ?, ?, ?, "", ?, "1", ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [footerData.invoiceDate, footerData.invoiceDueDate, footerData.partyId, footerData.partyName, footerData.totalBillPrice, footerData.totalBillDiscountFinal, footerData.otherCosts, Math.round(footerData.totalPayable), Math.round(footerData.amtReceived), footerData.paidIn, footerData.paymentRefNo, BillImage, footerData.invoiceNote, footerData.creditAmountUsed, InvoiceType, footerData.Eway];
        return await this.dbProvider.executeSql(query, data).then((salesInvoiceResponse) => {
            console.log(salesInvoiceResponse);
            const TodaysDateAnalytics = new Date().getTime();
            this.TransactionData.UpdateAnalyticsData(TodaysDateAnalytics, ConstantMessages.TransactionDateAnalytics.SALE, false);
            this.TransactionData.UpdateAnalyticsDataForDay(ConstantMessages.TransactionDateAnalyticsForDay.SALE, 1);
            return salesInvoiceResponse;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // selecting the sales invoice data from sale invoice table for viewing the transaction and pdf again
    // it returns the number of rows with each column value
    async getFinalBillDataFromDB(InvoiceNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select SalesInvoiceID,InvoiceDate,InvoiceNumber,PartyID,PartyName,TotalAmount,Discount,TotalPayable,TotalTax,AmountReceived,PaymentModeID,PaymentRefImagePath,InvoiceNote,IsActivate,OtherCosts,PaymentRef,IsSaleReturn,CreditsUsed,InvoiceType,Eway  from SalesInvoices where SalesInvoiceID=?', [InvoiceNumber]).then(
            (data: any) => {
                let BillData: IProductItemsFooterData;
                if (data && data.length > 0) {
                    BillData = {
                        InvoiceId: data[0].SalesInvoiceID,
                        invoiceDate: data[0].InvoiceDate,
                        invoiceNumber: data[0].InvoiceNumber,
                        partyId: data[0].PartyID,
                        partyName: data[0].PartyName,
                        totalBillPrice: data[0].TotalAmount,
                        totalBillDiscount: data[0].Discount,
                        totalPayable: data[0].TotalPayable,
                        totalTax: data[0].TotalTax,
                        amtReceived: data[0].AmountReceived,
                        paidIn: data[0].PaymentModeID,
                        PaymentImage: data[0].PaymentRefImagePath,
                        invoiceNote: data[0].InvoiceNote,
                        isActive: data[0].IsActivate,
                        otherCosts: data[0].OtherCosts,
                        paymentRefNo: data[0].PaymentRef,
                        isSaleReturn: data[0].IsSaleReturn,
                        creditAmountUsed: data[0].CreditsUsed,
                        InvoiceType: data[0].InvoiceType,
                        Eway: data[0].Eway
                    };
                }
                return BillData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }

    // selecting the sales invoice data from sale invoice table for viewing the transaction and pdf again
    // it returns the number of rows with each column value
    async getFinalBillDataFromDBForPayment(InvoiceNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select SalesInvoiceID,InvoiceDate,InvoiceNumber,PartyID,PartyName,TotalAmount,Discount,TotalPayable,TotalTax,AmountReceived,PaymentModeID,PaymentRefImagePath,InvoiceNote,IsActivate,OtherCosts,PaymentRef,IsSaleReturn,CreditsUsed from SalesInvoices where SalesInvoiceID=?', [InvoiceNumber]).then(
            (data: any) => {
                let BillData = {};
                if (data && data.length > 0) {
                    BillData = {
                        InvoiceId: data[0].SalesInvoiceID,
                        InvoiceDate: data[0].InvoiceDate,
                        InvoiceNumber: data[0].InvoiceNumber,
                        partyId: data[0].PartyID,
                        partyName: data[0].PartyName,
                        totalBillPrice: data[0].TotalAmount,
                        totalBillDiscount: data[0].Discount,
                        TotalPayable: data[0].TotalPayable,
                        totalTax: data[0].TotalTax,
                        amtReceived: data[0].AmountReceived,
                        paidIn: data[0].PaymentModeID,
                        PaymentImage: data[0].PaymentRefImagePath,
                        invoiceNote: data[0].InvoiceNote,
                        isActive: data[0].IsActivate,
                        otherCosts: data[0].OtherCosts,
                        paymentRefNo: data[0].PaymentRef,
                        isSaleReturn: data[0].IsSaleReturn,
                        creditAmountUsed: data[0].CreditsUsed
                    };
                }
                return BillData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }

    // selecting the sales invoice items table data for viewing the transaction again in printout format
    // return the item data info based on the number of rows it have
    async getSalesInvoiceItemsDataFromDB(SalesInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select Item_Desc,SalesInvoiceNo,Item_ID,ItemName,SellingPrice,Quantity,TaxSlab1,TaxSlab2,TaxSlab3,TaxSlab4,TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt,TaxSlab4Amt,Discount,HSNCode,SellingPriceTax,IsSellingPriceTaxInclusive,Measurement from SalesInvoiceItems where SalesInvoiceNo=?', [SalesInvoiceID]).then(
            async (data: any) => {
                const  ItemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        ItemData.push({
                            SalesInvoiceNo: dataRow.SalesInvoiceNo,
                            id: dataRow.Item_ID,
                            name: dataRow.ItemName,
                            sellingPrice: dataRow.SellingPrice,
                            discountedPrice: dataRow.SellingPrice,
                            count: dataRow.Quantity,
                            TaxSlabID1: dataRow.TaxSlab1,
                            TaxSlabID2: dataRow.TaxSlab2,
                            TaxSlabID3: dataRow.TaxSlab3,
                            TaxSlabID4: dataRow.TaxSlab4,
                            TaxSlabValue1: dataRow.TaxSlab1Amt,
                            TaxSlabValue2: dataRow.TaxSlab2Amt,
                            TaxSlabValue3: dataRow.TaxSlab3Amt,
                            TaxSlabValue4: dataRow.TaxSlab4Amt,
                            discount: dataRow.Discount,
                            HSN_SAC: dataRow.HSNCode,
                            sellingPriceTax: dataRow.SellingPriceTax,
                            isSellingPriceTaxInclusive: dataRow.IsSellingPriceTaxInclusive,
                            weightUnit: dataRow.Measurement,
                            description: dataRow.Item_Desc
                        });
                        const index = ItemData.length - 1;
                        ItemData[index].isSellingPriceTaxInclusive = Boolean(Number(ItemData[index].isSellingPriceTaxInclusive));
                    }
                }
                await ItemData;
                return ItemData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }
    // selecting the draft invoice data for completing the transaction through final bill page.
    // it return the draft sale invoice row data based on the invoice number
    async getDraftFinalBillDataFromDB(InvoiceId: number) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select InvoiceDueDate,Eway,SalesInvoiceID,InvoiceNumber,PartyID,TotalAmount,TotalPayable,AmountReceived,PaymentModeID,Discount,OtherCosts,PaymentRef,PaymentRefImagePath,InvoiceNote,DiscountIn,SaleDraftPage,categoryPageRedirect,categoryPageRedirectName,InvoiceType,InvoiceDate,isSaleQuotation,SaleQuotationStatus,TotalTax from DraftSalesInvoices where SalesInvoiceID=? AND IsActivate=\'1\'', [InvoiceId]).then(
            (data: any) => {
                let BillData: IProductItemsFooterData;
                if (data && data.length > 0) {
                    BillData = {
                        InvoiceId: data[0].SalesInvoiceID,
                        invoiceNumber: data[0].InvoiceNumber,
                        partyId: data[0].PartyID,
                        totalBillPrice: data[0].TotalAmount,
                        totalPayable: data[0].TotalPayable,
                        amtReceived: data[0].AmountReceived,
                        paidIn: data[0].PaymentModeID,
                        totalBillDiscount: data[0].Discount,
                        otherCosts: data[0].OtherCosts,
                        paymentRefNo: data[0].PaymentRef,
                        PaymentImage: data[0].PaymentRefImagePath,
                        invoiceNote: data[0].InvoiceNote,
                        discountIn: data[0].DiscountIn,
                        SaleDraftPage: data[0].SaleDraftPage,
                        categoryPageRedirect: data[0].categoryPageRedirect,
                        categoryPageRedirectName: data[0].categoryPageRedirectName,
                        InvoiceType: data[0].InvoiceType,
                        invoiceDate: data[0].InvoiceDate,
                        isSaleQuotation: Boolean(Number(data[0].isSaleQuotation)),
                        SaleQuotationStatus: data[0].SaleQuotationStatus,
                        totalTax: data[0].TotalTax,
                        Eway: data[0].Eway,
                        invoiceDueDate: data[0].InvoiceDueDate
                    };
                }
                return BillData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }
    // selecting the draft invoice item table data for completing the transaction through final bill page.
    // it returns multiple rows from sales invoice item table
    async getDraftSalesInvoiceItemsDataFromDB(SalesInvoiceID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select Item_Desc,Item_ID,ItemName,SellingPrice,maximumRetailPrice,Quantity,TaxSlab1,TaxSlab2,TaxSlab3,TaxSlab4,TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt,TaxSlab4Amt,Discount,HSNCode,sellingPriceTax,Measurement  from DraftSalesInvoiceItems where SalesInvoiceNo=? AND IsActivate="1"', [SalesInvoiceID]).then(
            (data: any) => {
                const ItemData = [];
                if (data.rows.length > 0) {
                    for (const dataRow of data)  {
                     ItemData.push({
                            id: dataRow.Item_ID,
                            name: dataRow.ItemName,
                            sellingPrice: dataRow.SellingPrice,
                            discountedPrice: dataRow.SellingPrice,
                            maximumRetailPrice: dataRow.maximumRetailPrice,
                            count: dataRow.Quantity,
                            TaxSlabID1: dataRow.TaxSlab1,
                            TaxSlabID2: dataRow.TaxSlab2,
                            TaxSlabID3: dataRow.TaxSlab3,
                            TaxSlabID4: dataRow.TaxSlab4,
                            TaxSlabValue1: dataRow.TaxSlab1Amt,
                            TaxSlabValue2: dataRow.TaxSlab2Amt,
                            TaxSlabValue3: dataRow.TaxSlab3Amt,
                            TaxSlabValue4: dataRow.TaxSlab4Amt,
                            discount: dataRow.Discount,
                            HSN_SAC: dataRow.HSNCode,
                            Discount: dataRow.Discount,
                            isSellingPriceTaxInclusive: Boolean(Number(dataRow.sellingPriceTax)),
                            sellingPriceTax: dataRow.sellingPriceTax,
                            weightUnit: dataRow.Measurement,
                            description: dataRow.Item_Desc
                        });
                    }
                }
                return ItemData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            });
    }
    // tslint:disable-next-line:max-line-length
    // To store the Sales Invoice Number generated on final bill page in SalesInvoice Table, this will be helpful in retrieving transactions...
    updateSalesInvoiceNumberInDB(invoiceId: number, invoiceNumber: string) {
        const query = 'UPDATE SalesInvoices SET InvoiceNumber = ?, SaleUpdated = "1" WHERE SalesInvoiceID = ?';
        return this.dbProvider.executeSql(query, [invoiceNumber, invoiceId]).then((data) => {
            console.log('Update Sent to DB...'); console.log(data);
            return data;
        },
            (err) => {
                console.log('Error: ', err);
                return err;
            });
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
                console.log('Error: ', err);
                return err;
            });
    }
    // To get the required data for Sales Invoice Configuration to generate Unique Sales Invoice Number on Final Bill Page...
    getInvoiceConfigurationFromDB(templateId: number) {
        const query = 'SELECT InvoiceConfigFieldName, InvoiceConfigFieldValue FROM InvoiceConfiguration WHERE InvoiceTemplateID = ?';
        // tslint:disable-next-line:max-line-length
        const  invoiceConfig: { name: string, numLength: number, showGSTNumber: boolean, ShowPAN: boolean, ShowTAN: boolean, ShowCIN: boolean, ShowHSN: boolean, ShowInvNote: boolean, ShowInvImage: boolean } = { name: null, numLength: null, showGSTNumber: null, ShowPAN: null, ShowTAN: null, ShowCIN: null, ShowHSN: null, ShowInvNote: null, ShowInvImage: null };
        return this.dbProvider.executeSql(query, [templateId]).then((data: any) => {
            if (data && data.length > 0) {
                for (const InvoiceConfigData of data) {
                    const switchData = InvoiceConfigData.InvoiceConfigFieldName;
                    switch ((switchData).toString()) {
                        case 'InvoicePrefix':
                            {
                                invoiceConfig.name = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'InvoiceNumberLength':
                            {
                                invoiceConfig.numLength = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowGST':
                            {
                                invoiceConfig.showGSTNumber = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowPAN':
                            {
                                invoiceConfig.ShowPAN = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowTAN':
                            {
                                invoiceConfig.ShowTAN = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowCIN':
                            {
                                invoiceConfig.ShowCIN = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowHSN':
                            {
                                invoiceConfig.ShowHSN = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowInvNote':
                            {
                                invoiceConfig.ShowInvNote = InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                        case 'ShowInvImage':
                            {
                                invoiceConfig.ShowInvImage =  InvoiceConfigData.InvoiceConfigFieldValue;
                                break;
                            }
                    }
                }
            }
            return invoiceConfig;
        },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }

    // to delete the InvoiceData from database by passing the invoice id for that transaction.
    deleteInvoiceDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Update SalesInvoices SET IsActivate="0", SaleUpdated = "1" where SalesInvoiceID=?', [invoiceId]).then(
            (data) => {
                console.log('deleted successfully');
                return data;
            }, (err) => {
                console.log('Error fetching DraftInvoiceData data: ' + err);
                return err;
            }
        );
    }

    // To delete the SalesItemData from database by passing the invoice id for that transaction.
    async deleteSalesItemDataFromDB(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update SalesInvoiceItems SET IsActivate="0" where SalesInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To restore the deleted the SalesItemData from database by passing the invoice id for that transaction.
    async restoreDeletedInvoiceItems(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update SalesInvoiceItems SET IsActivate="1", SaleItemUpdated = "1" where SalesInvoiceItemID=?', [invoiceId]).then((data: any) => {
            console.log('Restored deleted Sales Invoice Items successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    /** To update the item stock for the Delete and Restore of Sale and Purchase Invoices */
    async AdjustInventory(TransactionType, MethodType, ItemID, Quantity: number) {
        let CurrentStock = 0;
        if (Quantity === null || Quantity === undefined) {
            return;
        }
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select CurrentStock from Item  where Item_ID =? and IsMaintainStock="1"', [ItemID]).then(async (data: any) => {
            if (data && data.length > 0) {
                CurrentStock = data[0].CurrentStock;
                // tslint:disable-next-line:max-line-length
                if (MethodType === 'Delete' && (TransactionType === ConstantMessages.BillType.SALE || TransactionType === ConstantMessages.BillType.PURCHASE_RETURN)) {
                    CurrentStock += Quantity;
                }
                // tslint:disable-next-line:max-line-length
                if (MethodType === 'Restore' && (TransactionType === ConstantMessages.BillType.SALE || TransactionType === ConstantMessages.BillType.PURCHASE_RETURN)) {
                    CurrentStock -= Quantity;
                }
                // tslint:disable-next-line:max-line-length
                if (MethodType === 'Delete' && (TransactionType === ConstantMessages.BillType.PURCHASE || TransactionType === ConstantMessages.BillType.SALE_RETURN)) {
                    CurrentStock -= Quantity;
                }
                // tslint:disable-next-line:max-line-length
                if (MethodType === 'Restore' && (TransactionType === ConstantMessages.BillType.PURCHASE || TransactionType === ConstantMessages.BillType.SALE_RETURN)) {
                    CurrentStock += Quantity;
                }
                for (const  item of this.itemData.itemList) {
                    if (item.id === ItemID) {
                        item.currentStock = CurrentStock;
                    }
                }
                // tslint:disable-next-line:max-line-length
                return await this.dbProvider.executeSql('Update Item SET CurrentStock=?, itemUpdated = "1" where Item_ID=?', [CurrentStock, ItemID]).then((res: any) => {
                    console.log('Restored deleted Sales Invoice Items successfully');
                    return res;
                }, (err) => {
                    console.log('Error: ', err);
                    return err;
                });
            }
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }


    // To restore the deleted the InvoiceData from database by passing the invoice id for that transaction.
    restoreDeletedInvoice(invoiceId) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('Update SalesInvoices SET IsActivate="1", SaleUpdated = "1" where SalesInvoiceID=?', [invoiceId]).then(
            (data) => {
                console.log('Restored deleted Sales Invoice successfully');
                return data;
            }, (err) => {
                console.log('Error fetching DraftInvoiceData data:' + err);
                console.log('Error: ', err);
                return err;
            }
        );
    }

    // To get the active value (0 or 1) for the invoice id from Sales Invoice table in DB
    isSalesInvoiceActive(id: number) {
        return this.dbProvider.executeSql('SELECT IsActivate FROM SalesInvoices WHERE SalesInvoiceID = ?', [id]).then(
            (data: any) => {
                if (data) {
                    const isActive = data[0].IsActivate;
                    return Boolean(Number(isActive));
                }
            }, (err) => {
                console.log('Error fetching Sales Invoice Table data: ' + err);
                return err;
            }
        );
    }

    // update sale data
    // To store the Final Bill From Data provided by user in SalesInvoice Table, this will create transactions for us to use later
    async updateFinalBillDataToDB(footerData: IProductItemsFooterData) {
        // tslint:disable-next-line:max-line-length
        const query = 'Update SalesInvoices SET InvoiceDate=?,InvoiceNumber=?, PartyID=?, PartyName=?,TotalAmount=?, Discount=?, OtherCosts=?, TotalTax=?, TotalPayable=?, AmountReceived=?, PaymentModeID=?, PaymentRef=?, PaymentRefImagePath=?, InvoiceNote=?,SaleUpdated="1", CreditsUsed=?, InvoiceType=?, Eway=? where SalesInvoiceID=?';
        // tslint:disable-next-line:max-line-length
        const  data = [footerData.invoiceDate, footerData.invoiceNumber, footerData.partyId, footerData.partyName, footerData.totalBillPrice, footerData.totalBillDiscount, footerData.otherCosts, footerData.totalTax, Math.round(footerData.totalPayable), Math.round(footerData.amtReceived), footerData.paidIn, footerData.paymentRefNo, footerData.PaymentImage, footerData.invoiceNote, footerData.creditAmountUsed, footerData.InvoiceType, footerData.Eway, footerData.InvoiceId];
        return await this.dbProvider.executeSql(query, data).then((salesInvoiceResponse) => {
            console.log(salesInvoiceResponse);
            return salesInvoiceResponse;
        }, (err) => {
            console.log('Error ' + err);
            return err;
        });
    }

    // To delete the SalesItemData from database by passing the invoice id for that transaction.
    async deleteNewSalesItemDataFromDB(invoiceId) {
        return await this.dbProvider.executeSql('delete from SalesInvoiceItems where SalesInvoiceNo=?', [invoiceId]).then((data) => {
            console.log('Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error:', err);
            return err;
        });
    }

    /** To get the Sales Invoice Number Count for generating new Sales Invoice Number in continuation */
    async getSaleInvoiceTotal() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS SalesInvoiceTotal FROM SalesInvoices WHERE IsSaleReturn = "0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let salesInvoiceTotal = { value: null };
            if (data && data.length > 0) {
                salesInvoiceTotal = { value: data[0].SalesInvoiceTotal };
            }
            return salesInvoiceTotal;
        }, (err) => {
            console.log('Error:', err);
            return err;
        });
    }

    /** To update the credit amount for the party in DB if used on Sale bill */
    updateCreditAmountInDB(partyId: number, creditAmount: number) {
        const query = 'UPDATE Party SET CreditPoints = ?, partyUpdated = "1" WHERE PartyID = ?';
        this.dbProvider.executeSql(query, [creditAmount, partyId]).then((data) => {
            console.log('Credit Amount Updated Response from Party Table in DB: ', data);
        }, (err) => {
            console.log('Credit Amount Updated Response from Party Table in DB: ', err);
            return err;
        });
    }

    /** To add the payment to the payment table when New Sale/Purchase/Return Invoice is added */
    addPayment(BillType: string, PaymentType: string, BillData: IProductItemsFooterData, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO Payment(BillType, PartyId, AmountPaid, PaymentMode, PaymentNote, PaymentImage, PaymentDate, Balance, PaymentType, BusinessID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [BillType, BillData.partyId, BillData.amtReceived, BillData.paidIn, BillData.paymentRefNo, BillData.PaymentImage, BillData.invoiceDate, BillData.balance, PaymentType];
        this.dbProvider.executeSql(query, data).then((PaymentSuccess) => {
            callback(PaymentSuccess);
        }, (err) => {
            console.log('Error:', err);
            return err;
        });
    }

    /** To add the payment to the payment table when New Sale/Purchase/Return Invoice is added */
    updatePaymentData(BillType: string, PaymentType: string, BillData: IProductItemsFooterData, PaymentID, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'update Payment set BillType=?,PaymentType=?,PartyId=?, AmountPaid=?, PaymentMode=?, PaymentNote=?, PaymentImage=?, PaymentDate=?,Balance=? where id =?';
        // tslint:disable-next-line:max-line-length
        const data = [BillType, PaymentType, BillData.partyId, BillData.amtReceived, BillData.paidIn, BillData.paymentRefNo, BillData.PaymentImage, BillData.invoiceDate, BillData.balance, PaymentID];
        this.dbProvider.executeSql(query, data).then((PaymentSuccess) => {
            callback(PaymentSuccess);
        }, (err) => {
            console.log('Error:', err);
            callback(null);
        });
    }


    /** To add the payment to the payment table when New Sale/Purchase/Return Invoice is added */
    addPaymentFor2Table(BillType: string, PaymentType: string, TotalBillPrice, BillData: IProductItemsFooterData, callback) {
        let AmountReceived = 0;
        let remainingBalance = 0;
        if (Number(TotalBillPrice) >= Number(BillData.amtReceived)) { AmountReceived = Number(BillData.amtReceived); } else {
            remainingBalance = Number(BillData.amtReceived) - Number(TotalBillPrice);
            AmountReceived = Number(TotalBillPrice);
        }
        if (Number(BillData.amtReceived) > 0) {
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO Payment(BillType, PaymentType, PartyId, AmountPaid, PaymentMode, PaymentNote, PaymentImage, PaymentDate, Balance, BusinessID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
            // tslint:disable-next-line:max-line-length
            const data = [BillType, PaymentType, BillData.partyId, Math.round(BillData.amtReceived), BillData.paidIn, BillData.paymentRefNo, BillData.PaymentImage, BillData.invoiceDate, remainingBalance];
            this.dbProvider.executeSql(query, data).then((PaymentSuccess: any) => {
                // tslint:disable-next-line:max-line-length
                const sqlquery = 'INSERT INTO PaymentInvoiceMapping(PaymentID, InvoiceId, InvoiceNumber, AmountPaid, PaymentDate, BusinessID) VALUES(?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
                // tslint:disable-next-line:max-line-length
                const dataRow = [PaymentSuccess.insertId, BillData.InvoiceId, BillData.invoiceNumber, Math.round(AmountReceived), BillData.invoiceDate];
                this.dbProvider.executeSql(sqlquery, dataRow).then((Success) => {
                    callback(Success);
                }, (err) => {
                    console.log('Error:', err);
                    callback(null);
                });
            }, (err) => {
                console.log('Error:', err);
                callback(null);
            });
        } else {
            callback(null);
        }
    }

    /** To add the payment to the payment table when New Sale/Purchase/Return Invoice is added */
    addPaymentForExtraAmount(BillType: string, PaymentType: string, BillData: IProductItemsFooterData, callback) {
        let AmountReceived = 0;
        let remainingBalance = 0;
        // tslint:disable-next-line:max-line-length
        if (Number(BillData.totalPayable) >= Number(BillData.oldTotalPayable) && Number(BillData.totalPayable) <= Number(BillData.amtReceived)) {
            AmountReceived = Number(BillData.totalPayable) - Number(BillData.oldTotalPayable);
            if (AmountReceived >= Number(BillData.amtReceived) - Number(BillData.oldAmtReceived)) {
                AmountReceived = Number(BillData.amtReceived) - Number(BillData.oldAmtReceived);
            } else {
                if (Number(BillData.totalPayable) >= Number(BillData.oldAmtReceived)) {
                    AmountReceived = Number(BillData.totalPayable) - Number(BillData.oldAmtReceived);
                }
            }
            remainingBalance = Number(BillData.amtReceived) - Number(BillData.oldAmtReceived) - AmountReceived;
        } else {
            // tslint:disable-next-line:max-line-length
            if (Number(BillData.totalPayable) < Number(BillData.oldTotalPayable) && Number(BillData.totalPayable) <= Number(BillData.amtReceived)) {
                AmountReceived = 0;
                remainingBalance = Number(BillData.amtReceived) - Number(BillData.oldAmtReceived) - AmountReceived;
            }
        }
        if (Number(BillData.amtReceived) > Number(BillData.oldAmtReceived)) {
            // tslint:disable-next-line:max-line-length
            const query = 'INSERT INTO Payment(BillType, PaymentType, PartyId, AmountPaid, PaymentMode, PaymentNote, PaymentImage, PaymentDate, Balance, BusinessID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
            // tslint:disable-next-line:max-line-length
            const  data = [BillType, PaymentType, BillData.partyId, (BillData.amtReceived - BillData.oldAmtReceived), BillData.paidIn, BillData.paymentRefNo, BillData.PaymentImage, BillData.invoiceDate, remainingBalance];
            this.dbProvider.executeSql(query, data).then((PaymentSuccess: any) => {
                if (AmountReceived > 0) {
                    // tslint:disable-next-line:max-line-length
                    const sqlquery = 'INSERT INTO PaymentInvoiceMapping(PaymentID, InvoiceId, InvoiceNumber, AmountPaid, PaymentDate, BusinessID) VALUES(?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
                    // tslint:disable-next-line:max-line-length
                    const dataRow = [PaymentSuccess.insertId, BillData.InvoiceId, BillData.invoiceNumber, AmountReceived, BillData.invoiceDate];
                    this.dbProvider.executeSql(sqlquery, dataRow).then((Success) => {
                        callback(Success);
                    }, (err) => {
                       console.log('Error:', err);
                       callback(null);
                    });
                }
            }, (err) => {
                console.log('Error:', err);
                callback(null);
            });
        } else {
            callback(null);
        }
    }
    // ADD THE PAYMENT INVOICE MAPPING DATA TO THE DATABASE
    AddPaymentInvoiceMapping(PaymentID, BillData, callback) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO PaymentInvoiceMapping(PaymentID, InvoiceId, InvoiceNumber, AmountPaid, PaymentDate, BusinessID) VALUES(?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        const data = [PaymentID, BillData.SalesInvoiceID, BillData.InvoiceNumber, BillData.PaymentReceived, BillData.InvoiceDate];
        this.dbProvider.executeSql(query, data).then((Success) => {
            callback(Success);
        }, (err) => {
            console.log('Error:', err);
            callback(null);
        });
    }

    /** To update the payment to the payment table in DB when Edit Sale/Purchase/Return Invoice is updated */
    updatePayment(BillType: string, BillData, PaymentID, callback) {
        // Updating party id in all transactions w.r.t. InvoiceID, in case the party is changed for the invoice
        const query = 'UPDATE PaymentInvoiceMapping SET  AmountPaid = ?, InvoiceNumber = ? WHERE PaymentID = ?';
        const data = [Number(BillData.amtReceived), BillData.invoiceNumber, PaymentID];
        this.dbProvider.executeSql(query, data).then((success) => {
            const sqlquery = 'UPDATE Payment SET Balance = ?, AmountPaid=?, PaymentUpdated = "1" WHERE id = ?';
            const dataRow = [0, BillData.amtReceived, PaymentID];
            this.dbProvider.executeSql(sqlquery, dataRow).then((result) => {
                callback(result);
            }, (err) => {
                console.log('Error:', err);
                callback(null);
            });

        }, (err) => {
           console.log('Error', err);
           callback(null);
        });
    }

    updatePaymentForAmountReceived(BillType: string, amountReceived, InvoiceNumber, Balance, PaymentID, callback) {
        // Updating party id in all transactions w.r.t. InvoiceID, in case the party is changed for the invoice
        const query = 'UPDATE PaymentInvoiceMapping SET  AmountPaid = ?, InvoiceNumber = ? WHERE PaymentID = ?';
        const data = [Number(amountReceived), InvoiceNumber, PaymentID];
        this.dbProvider.executeSql(query, data).then((success) => {
            const sqlquery = 'UPDATE Payment SET Balance = Balance+?, PaymentUpdated = "1" WHERE id = ?';
            const dataRow = [Balance, PaymentID];
            this.dbProvider.executeSql(sqlquery, dataRow).then((result) => {
                callback(result);
            }, (err) => {
                console.log('Error', err);
                callback(null);
            });

        }, (err) => {
            console.log('Error', err);
            callback(null);
        });
    }

    updatePaymentForZeroAmount(BillType: string, amountReceived, InvoiceNumber, Balance, PaymentID, callback) {
        // Updating party id in all transactions w.r.t. InvoiceID, in case the party is changed for the invoice
        const query = 'UPDATE PaymentInvoiceMapping SET  AmountPaid = ?,IsActivate = "0", InvoiceNumber = ? WHERE PaymentID = ?';
        const data = [Number(amountReceived), InvoiceNumber, PaymentID];
        this.dbProvider.executeSql(query, data).then((success) => {
            const sqlquery = 'UPDATE Payment SET Balance = Balance+?, PaymentUpdated = "1" WHERE id = ?';
            const dataRow = [Balance, PaymentID];
            this.dbProvider.executeSql(sqlquery, dataRow).then((result) => {
                callback(result);
            }, (err) => {
                console.log('Error', err);
                callback(null);
            });

        }, (err) => {
            console.log('Error', err);
            callback(null);
        });
    }

    DeletePayment(PaymentId, InvoiceId, Balance, callback) {
        const query = 'UPDATE PaymentInvoiceMapping SET IsActivate = "0", PaymentUpdated = "1" WHERE PaymentID = ? and InvoiceId = ?';
        this.dbProvider.executeSql(query, [PaymentId, InvoiceId]).then(() => {
            const sqlquery = 'UPDATE Payment SET Balance = ?, PaymentUpdated = "1" WHERE id = ?';
            this.dbProvider.executeSql(sqlquery, [Balance, PaymentId]).then((PriceUpdated) => {
                if (PriceUpdated) { callback(PriceUpdated); }
            }, (err) => {
                console.log('Error', err);
                callback(null);
            });
        }, (err) => {
            console.log('Error', err);
            callback(null);
        });
    }

    /** To update the party for all payments with the invoice id in case it is changed for Sale invoice via Sale/Purchase Edit flow */
    updatePartyForPayment(BillType: string, BillData) {
        const query = 'UPDATE Payment SET PartyId = ?, PaymentUpdated = "1" WHERE BillType = ? AND InvoiceId = ?';
        const data = [BillData.partyId, BillType, BillData.InvoiceId];
        this.dbProvider.executeSql(query, data).then((success) => {
            console.log('success');
        }, (err) => {
            console.log('Error', err);
            console.log('failed');
        });
    }

    /** To set the payment record inactive in DB when Sale/Purchase is deleted */
    deletePayment(BillType: string, PaymentId: number, callback) {
        const query = 'UPDATE Payment SET IsActivate = "0", PaymentUpdated = "1" WHERE BillType = ? AND id = ?';
        const  data = [BillType, PaymentId];
        this.dbProvider.executeSql(query, data).then((success) => {
            const sqlquery = 'UPDATE PaymentInvoiceMapping SET IsActivate = "0", PaymentUpdated = "1" WHERE PaymentID = ?';
            const dataRow = [PaymentId];
            this.dbProvider.executeSql(sqlquery, dataRow).then((querysuccess) => {
                callback('success');
            }, (err) => {
                console.log('Error', err);
                console.log('Error in Removing Payment from DB: ', err);
                callback(err);
            });
        }, (err) => {
            console.log('Error in Removing Payment from DB: ', err);
            callback(err);
        });
    }

    /** To set the payment record inactive in DB when Sale/Purchase is deleted */
    deletePaymentMappingData(BillType: string, PaymentId: number, callback) {
        const query = 'UPDATE PaymentInvoiceMapping SET IsActivate = "0", PaymentUpdated = "1" WHERE PaymentID = ?';
        const data = [PaymentId];
        this.dbProvider.executeSql(query, data).then((success) => {
            callback('success');
        }, (err) => {
            console.log('Error in Removing Payment from DB: ', err);
            callback(err);
        });

    }

    /** To update the payment balance in DB when Sale/Purchase is deleted */
    UpdatePaymentBalanceData(Balance: number, PaymentID: number, callback) {
        const  query = 'UPDATE Payment SET Balance = Balance+?, PaymentUpdated = "1" WHERE id = ?';
        const data = [Balance, PaymentID];
        this.dbProvider.executeSql(query, data).then((success) => {
            callback('success');
        }, (err) => {
            console.log('Error in Removing Payment from DB: ', err);
            callback(err);
        });
    }

    /** To set the payment record inactive in DB when Sale/Purchase is deleted */
    UpdatePaymentMappingData(BillType: string, PaymentId: number, callback) {
        const query = 'UPDATE PaymentInvoiceMapping SET AmountPaid=?, PaymentUpdated = "1" WHERE PaymentID = ?';
        const data = [PaymentId];
        this.dbProvider.executeSql(query, data).then((success) => {
            callback('success');
        }, (err) => {
            console.log('Error in Removing Payment from DB: ', err);
            callback(err);
        });

    }

    /** To set the payment record active in DB when Deleted Sale/Purchase is Restored */
    restorePayment(BillType: string, InvoiceId: number, PaymentID: number) {
        const  query = 'UPDATE Payment SET IsActivate = "1", PaymentUpdated = "1" WHERE BillType = ? AND id = ?';
        const data = [BillType, PaymentID];
        this.dbProvider.executeSql(query, data).then((success) => {
            const query2 = 'UPDATE PaymentInvoiceMapping SET IsActivate = "1" WHERE PaymentID = ? and InvoiceId = ?';
            const data2 = [PaymentID, InvoiceId];
            this.dbProvider.executeSql(query2, data2).then((success2) => {
                console.log('Payment restored from DB: ', success2);
            }, (err) => {
             console.log('Error in Removing Payment from DB: ', err);
             return err;
            });
        }, (err) => {
         console.log('Error in Removing Payment from DB: ', err);
         return err;
        });
    }

    /** To update the amount received for all the payments restored from DB for the Invoice */
    updateAmountReceivedInDB(BillType: string, InvoiceId: number, InvoiceAmount: number) {
        const query = 'SELECT SUM(AmountPaid) AS TotalAmountPaid FROM Payment WHERE BillType = ? AND InvoiceId = ?';
        this.dbProvider.executeSql(query, [BillType, InvoiceId]).then((data: any) => {
            console.log('Payment Removed from DB: ', data);
            if (data && data.length) {
                const TotalAmountReceived = data[0].TotalAmountPaid;
                let query2 = '';
                let inputs = [];
                if (ConstantMessages.BillType.SALE === BillType) { // Updating for Sale Invoice
                    query2 = 'UPDATE SalesInvoices SET AmountReceived = ?, SaleUpdated = "1" WHERE SalesInvoiceID = ?';
                    inputs = [Number(TotalAmountReceived), InvoiceId];
                } else { // Updating for Purchase Invoice
                    query2 = 'UPDATE PurchaseInvoices SET AmountPaid = ?, TotalDue = ?, PurchaseUpdated = "1" WHERE PurchaseInvoiceID = ?';
                    inputs = [Number(TotalAmountReceived), InvoiceAmount - Number(TotalAmountReceived), InvoiceId];
                }
                this.dbProvider.executeSql(query2, inputs).then((success) => {
                    console.log('Invoice Amount received Updated in DB: ', success);
                }, (error) => {
                  console.log('Error in Removing Payment from DB: ', error);
                  return error;
                });
            }
        }, (err) => {
            console.log('Error  ', err);
            console.log('Error in Removing Payment from DB: ', err);
        });
    }

    /** Update the amount received for invoices */
    InvoiceAmountReceivedUpdate(BillType, InvoiceID) {
        let query = '';
        if (ConstantMessages.BillType.PURCHASE === BillType) {
            query = 'UPDATE PurchaseInvoices SET AmountPaid = "0", PurchaseUpdated = "1" WHERE PurchaseInvoiceID = ?';
        } else {
            query = 'UPDATE SalesInvoices SET AmountReceived = "0", SaleUpdated = "1" WHERE SalesInvoiceID = ?';
        }
        const  inputs = [InvoiceID];
        this.dbProvider.executeSql(query, inputs).then((success) => {
            console.log('Invoice Amount received Updated in DB: ', success);
        }, (error) => {
            console.log('Error  ', error);
            console.log('Error in Updating the amoutn received in  DB: ', error);
        });
    }

    /** To get the first payment's id for the Invoice */
    getPaymentId(BillType: string, InvoiceID: number, callback) {
        const query2 = 'SELECT min(id) AS PaymentId FROM Payment WHERE BillType = ? AND InvoiceId = ?';
        this.dbProvider.executeSql(query2, [BillType, InvoiceID]).then((data: any) => {
            let paymentId: number = null;
            if (data && data.length) { paymentId = data[0].PaymentId; }
            callback({ PaymentID: paymentId });
        }, (err) => {
            console.log('Error  ', err);
            callback(null);
        });
    }

    /** To get the value for invoice type, whether it is tax enabled or tax disabled Invoice */
    getTaxInvoiceType(InvoiceID: number, callback) {
        const query = 'SELECT InvoiceType FROM SalesInvoices WHERE SalesInvoiceID = ?';
        this.dbProvider.executeSql(query, [InvoiceID]).then((data: any) => {
            let isTaxInvoice = 1;
            if (data && data.length) { isTaxInvoice = data[0].InvoiceType; }
            callback({ value: isTaxInvoice });
        }, (err) => {
            console.log('Error  ', err);
            callback({ value: 1 });
        });
    }

    /** selecting the invoiceNumber of the last inserted sales invoice in DB by SalesInvoiceID */
    selectLatestSalesInvoiceNumber() {
        const query = 'select InvoiceNumber from SalesInvoices where isSaleReturn = "0" ORDER BY SalesInvoiceID DESC LIMIT 1';
        return this.dbProvider.executeSql(query, []).then(
            (data: any) => {
                let salesInvoiceResponse: any;
                if (data && data.length > 0) {
                    salesInvoiceResponse = {
                        InvoiceNumber: data[0].InvoiceNumber
                    };
                }
                return salesInvoiceResponse;
            },
            (err) => {
                console.log('Error in Removing Payment from DB: ', err);
                return err;
            }
        );
    }
}
