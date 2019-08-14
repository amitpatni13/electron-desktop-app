import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ErrorLogService } from './errorLog.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpParams, HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { AppSettings } from './appSetting.service';
@Injectable()
export class SyncDataWithServer {
    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, private httpClient: HttpClient, private appSetting: AppSettings, public logService: ErrorLogService, public http: Http) { }

    // Selecting the sales invoice which are not sync with thee server
    async  getAllSalesInvoices(mobileNumber, SaleInvoiceID) {
        // tslint:disable-next-line:max-line-length
        const query = 'select SalesInvoiceID,InvoiceNumber,PartyName,Status,InvoiceDate,TotalPayable,AmountReceived,PartyID,TotalAmount,Discount,OtherCosts,TotalTax,PaymentModeID,PaymentRef,PaymentRefImagePath,InvoiceNote,SaleUpdated,IsActivate,CreditsUsed,IsSaleReturn,InvoiceDueDate, BusinessID from SalesInvoices where (SaleUpdated="1" or SalesInvoiceID>?) AND BusinessID = "1" ORDER BY SalesInvoiceID ASC';
        return await this.dbProvider.executeSql(query, [SaleInvoiceID]).then((data: any) => {
            const salesReportData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    salesReportData.push({
                        MobileNumber: mobileNumber,
                        SalesInvoiceID: dataRow.SalesInvoiceID,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        PartyName: dataRow.PartyName,
                        Status: dataRow.Status,
                        InvoiceDate: dataRow.InvoiceDate,
                        TotalPayable: dataRow.TotalPayable,
                        AmountReceived: dataRow.AmountReceived,
                        PartyID: dataRow.PartyID,
                        TotalAmount: dataRow.TotalAmount,
                        Discount: dataRow.Discount,
                        OtherCosts: dataRow.OtherCosts,
                        TotalTax: dataRow.TotalTax,
                        PaymentModeID: dataRow.PaymentModeID,
                        PaymentRef: dataRow.PaymentRef,
                        PaymentRefImagePath: dataRow.PaymentRefImagePath,
                        InvoiceNote: dataRow.InvoiceNote,
                        SaleUpdated: dataRow.SaleUpdated,
                        IsActivate: dataRow.IsActivate,
                        CreditsUsed: dataRow.CreditsUsed,
                        IsSaleReturn: dataRow.IsSaleReturn,
                        InvoiceDueDate: dataRow.InvoiceDueDate
                    });
                }
            }
            return salesReportData; // sending the sale invoice array back to the user
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    // Selecting the Purchase invoice which are not sync with thee server
    async getAllPurchasesInvoices(mobileNumber, PurchaseInvoiceID) {
        // tslint:disable-next-line:max-line-length
        const query = 'Select PurchaseInvoiceID,PurchaseInvoiceNumber,PurchaseInvoiceDate,PurchaseReceiptDate,TotalAmount,TotalDue,AmountPaid,PartyName,PartyID,InvoiceAmount,TotalTax,PaymentModeID,PaymentRef,PaymentRefImagePath,PurchaseUpdated,IsActivate,IsPurchaseReturn,otherCosts from PurchaseInvoices where (PurchaseUpdated="1" or PurchaseInvoiceID>?) AND BusinessID = "1" ORDER BY PurchaseInvoiceID ASC';
        return await this.dbProvider.executeSql(query, [PurchaseInvoiceID]).then((data: any) => {
            const PurchaseTxnDetail = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseTxnDetail.push({
                        MobileNumber: mobileNumber,
                        PurchaseInvoiceID: dataRow.PurchaseInvoiceID,
                        PurchaseInvoiceNumber: dataRow.PurchaseInvoiceNumber,
                        PurchaseInvoiceDate: dataRow.PurchaseInvoiceDate,
                        PurchaseReceiptDate: dataRow.PurchaseReceiptDate,
                        TotalAmount: dataRow.TotalAmount,
                        TotalDue: dataRow.TotalDue,
                        AmountPaid: dataRow.AmountPaid,
                        PartyName: dataRow.PartyName,
                        PartyID: dataRow.PartyID,
                        InvoiceAmount: dataRow.InvoiceAmount,
                        TotalTax: dataRow.TotalTax,
                        PaymentModeID: dataRow.PaymentModeID,
                        PaymentRef: dataRow.PaymentRef,
                        PaymentRefImagePath: dataRow.PaymentRefImagePath,
                        PurchaseUpdated: dataRow.PurchaseUpdated,
                        IsActivate: dataRow.IsActivate,
                        IsPurchaseReturn: dataRow.IsPurchaseReturn,
                        otherCosts: dataRow.otherCosts

                    });

                }
            }
            return PurchaseTxnDetail; // sending purchase  invoice array back to the server
        }, err => {
            console.log('error ', err);
            return [];
        });
    }

    //  selecting the sales invoice items table data for sync with server
    async getAllSalesInvoicesItemsData(mobileNumber, SalesInvoiceItemID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select SalesInvoiceItemID,SalesInvoiceNo,Item_ID,ItemName,SellingPrice,Quantity,TaxSlab1,TaxSlab2,TaxSlab3,TaxSlab4,TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt,TaxSlab4Amt,Discount,HSNCode,NetAmountReceivable,IsActivate,SaleItemUpdated,SellingPriceTax,IsSellingPriceTaxInclusive from SalesInvoiceItems where (SaleItemUpdated="1" or SalesInvoiceItemID>?) AND BusinessID = "1" ORDER BY SalesInvoiceItemID ASC', [SalesInvoiceItemID]).then(
            async (data: any) => {
                const ItemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        ItemData.push({
                            MobileNumber: mobileNumber,
                            SalesInvoiceItemID: dataRow.SalesInvoiceItemID,
                            SalesInvoiceNo: dataRow.SalesInvoiceNo,
                            Item_ID: dataRow.Item_ID,
                            ItemName: dataRow.ItemName,
                            SellingPrice: dataRow.SellingPrice,
                            Quantity: dataRow.Quantity,
                            TaxSlab1: dataRow.TaxSlab1,
                            TaxSlab2: dataRow.TaxSlab2,
                            TaxSlab3: dataRow.TaxSlab3,
                            TaxSlab4: dataRow.TaxSlab4,
                            TaxSlab1Amt: dataRow.TaxSlab1Amt,
                            TaxSlab2Amt: dataRow.TaxSlab2Amt,
                            TaxSlab3Amt: dataRow.TaxSlab3Amt,
                            TaxSlab4Amt: dataRow.TaxSlab4Amt,
                            Discount: dataRow.Discount,
                            HSNCode: dataRow.HSNCode,
                            NetAmountReceivable: dataRow.NetAmountReceivable,
                            IsActivate: dataRow.IsActivate,
                            SaleItemUpdated: dataRow.SaleItemUpdated,
                            sellingPriceTax: dataRow.SellingPriceTax,
                            isSellingPriceTaxInclusive: dataRow.IsSellingPriceTaxInclusive
                        });

                    }
                }
                return await ItemData; // return the item data info based on the number of rows it have

            },
            (err) => {
                console.log('error ', err);
                return [];
            }
        );
    }


    // Selecting the Purchase invoice Item data, it returns multiple rows from purchase invoice item table
    async getAllPurchaseInvoicesItemsData(mobileNumber, PurchaseInvoiceItemID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select PurchaseInvoiceItemID,PurchaseInvoiceNo,Item_ID,ItemName,PurchasePrice,Quantity,TaxSlab1,TaxSlab2,TaxSlab3,TaxSlab4,TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt,TaxSlab4Amt,HSNCode,NetAmountReceivable,IsActivate,purchaseItemUpdated from PurchaseInvoiceItems where (purchaseItemUpdated= "1" or PurchaseInvoiceItemID> ?) AND BusinessID = "1" ORDER BY PurchaseInvoiceItemID ASC', [PurchaseInvoiceItemID]).then(async (data: any) => {
            const PurchaseItemData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PurchaseItemData.push({
                        MobileNumber: mobileNumber,
                        PurchaseInvoiceItemID: dataRow.PurchaseInvoiceItemID,
                        PurchaseInvoiceNo: dataRow.PurchaseInvoiceNo,
                        Item_ID: dataRow.Item_ID,
                        ItemName: dataRow.ItemName,
                        PurchasePrice: dataRow.PurchasePrice,
                        Quantity: dataRow.Quantity,
                        TaxSlab1: dataRow.TaxSlab1,
                        TaxSlab2: dataRow.TaxSlab2,
                        TaxSlab3: dataRow.TaxSlab3,
                        TaxSlab4: dataRow.TaxSlab4,
                        TaxSlab1Amt: dataRow.TaxSlab1Amt,
                        TaxSlab2Amt: dataRow.TaxSlab2Amt,
                        TaxSlab3Amt: dataRow.TaxSlab3Amt,
                        TaxSlab4Amt: dataRow.TaxSlab4Amt,
                        hsnCode: dataRow.HSNCode,
                        NetAmountReceivable: dataRow.NetAmountReceivable,
                        IsActivate: dataRow.IsActivate,
                        purchaseItemUpdated: dataRow.purchaseItemUpdated
                    });

                }
            }
            return await PurchaseItemData; // return the item data info based on the number of rows it have
        }, (err) => {
            console.log('error ', err);
            return [];
        });
    }


    // get all the items list from the database to sync with the server
    getAllItemsData(mobileNumber, ItemID) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT Item_ID,ItemCategory_ID,ItemName,Item_Desc,HSN_SAC,barcode,Item_ImagePath,ItemImageString,ItemImageCss,PurchasePrice,Item_Weight,DiscountedPrice,SellingPrice,IsMaintainStock,MinStockNotification,Brand,AllowNegativeStock,CurrentStock,isSellingPriceTaxInclusive,isPurchasePriceTaxInclusive,CreatedDate,TaxSlabID1,TaxSlabID2,TaxSlabID3,TaxSlabID4,TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt,TaxSlab4Amt,ItemMeasurementMasterID,IsActivate,ItemSold,itemUpdated FROM Item where (Item_ID>? or itemUpdated ="1") AND BusinessID = "1" ORDER BY Item_ID ASC';
        return this.dbProvider.executeSql(query, [ItemID]).then(async (data: any) => {
            const allItemsData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    allItemsData.push({
                        MobileNumber: mobileNumber,
                        Item_ID: dataRow.Item_ID,
                        ItemCategory_ID: dataRow.ItemCategory_ID,
                        ItemName: dataRow.ItemName,
                        Item_Desc: dataRow.Item_Desc,
                        HSN_SAC: dataRow.HSN_SAC,
                        barcode: dataRow.barcode,
                        Item_ImagePath: dataRow.Item_ImagePath,
                        ItemImageString: dataRow.ItemImageString,
                        ItemImageCss: dataRow.ItemImageCss,
                        PurchasePrice: dataRow.PurchasePrice,
                        Item_Weight: dataRow.Item_Weight,
                        DiscountedPrice: dataRow.DiscountedPrice,
                        SellingPrice: dataRow.SellingPrice,
                        IsMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        Brand: dataRow.Brand,
                        AllowNegativeStock: dataRow.AllowNegativeStock,
                        CurrentStock: dataRow.CurrentStock,
                        isSellingPriceTaxInclusive: dataRow.isSellingPriceTaxInclusive,
                        isPurchasePriceTaxInclusive: dataRow.isPurchasePriceTaxInclusive,
                        CreatedDate: dataRow.CreatedDate,
                        TaxSlabID1: dataRow.TaxSlabID1,
                        TaxSlabID2: dataRow.TaxSlabID2,
                        TaxSlabID3: dataRow.TaxSlabID3,
                        TaxSlabID4: dataRow.TaxSlabID4,
                        TaxSlab1Amt: dataRow.TaxSlab1Amt,
                        TaxSlab2Amt: dataRow.TaxSlab2Amt,
                        TaxSlab3Amt: dataRow.TaxSlab3Amt,
                        TaxSlab4Amt: dataRow.TaxSlab4Amt,
                        ItemMeasurementMasterID: dataRow.ItemMeasurementMasterID,
                        IsActivate: dataRow.IsActivate,
                        ItemSold: dataRow.ItemSold,
                        itemUpdated: dataRow.itemUpdated
                    });

                }
            }
            return await allItemsData;
        }, err => {
            console.log('error ', err);
            return err;
        });
    }

    // To fetch all the category details from Item Category Table in DB
    async getAllCategories(mobileNumber, ItemCategoryID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT ItemCategoryID,ItemCategory_Name,ItemCategory_Desc,ItemCategory_ImagePath,ItemCategory_ImageString,ItemCategory_ImageCss,categoryUpdated,IsActivate FROM ItemCategory where (ItemCategoryID>? or categoryUpdated="1") AND BusinessID = "1" ORDER BY ItemCategoryID ASC', [ItemCategoryID]).then((data: any) => {
            const itemCategories = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {

                    itemCategories.push({
                        MobileNumber: mobileNumber,
                        ItemCategoryID: dataRow.ItemCategoryID,
                        ItemCategory_Name: dataRow.ItemCategory_Name,
                        ItemCategory_Desc: dataRow.ItemCategory_Desc,
                        ItemCategory_ImagePath: dataRow.ItemCategory_ImagePath,
                        ItemCategory_ImageString: dataRow.ItemCategory_ImageString,
                        ItemCategory_ImageCss: dataRow.ItemCategory_ImageCss,
                        categoryUpdated: dataRow.categoryUpdated,
                        IsActivate: dataRow.IsActivate
                    });


                }
            }
            return itemCategories;
        }, err => {
            console.log('error ', err);
            return [];
        });
    }



    // Get expense data from the database to store in the server
    async getAllExpenses(mobileNumber, ExpenseID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select ExpenseID,ExpensePaidTo,ExpenseDate,ReceiptDate,ExpenseCategoryID,ExpenseAmount,ExpenseGST,ExpenseCESS,ExpenseDetails,ExpenseAttachment,ExpenseUpdated,IsActivate from ExpenseList where (ExpenseID>? or ExpenseUpdated ="1") AND BusinessID = "1" ORDER BY ExpenseID ASC', [ExpenseID]).then((data: any) => {
            const expenseListData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    expenseListData.push({
                        MobileNumber: mobileNumber,
                        ExpenseID: dataRow.ExpenseID,
                        ExpensePaidTo: dataRow.ExpensePaidTo,
                        ExpenseDate: dataRow.ExpenseDate,
                        ReceiptDate: dataRow.ReceiptDate,
                        ExpenseCategoryID: dataRow.ExpenseCategoryID,
                        ExpenseAmount: dataRow.ExpenseAmount,
                        ExpenseGST: dataRow.ExpenseGST,
                        ExpenseCESS: dataRow.ExpenseCESS,
                        ExpenseDetails: dataRow.ExpenseDetails,
                        ExpenseAttachment: dataRow.ExpenseAttachment,
                        ExpenseUpdated: dataRow.ExpenseUpdated,
                        IsActivate: dataRow.IsActivate
                    });


                }
            }
            return expenseListData; // sending the expense array back to te user
        }, err => {
            console.log('error ', err);
            return [];
        });
    }
    // Get parties data from the database to store in the server
    async getAllParties(mobileNumber, PartyID) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select PartyID,PartyName,ContactNumber,BillingAddress,BillingCity,BillingState,BillingPincode,ShippingAddress,ShippingCity,ShippingState,ShippingPincode,GSTIN,Email,OutstandingBalance,CreatedOn,RegistrationType,partyUpdated,CreditPoints from Party where (PartyID>? or partyUpdated =\'1\') AND BusinessID = \'1\' ORDER BY PartyID ASC', [PartyID]).then(async (data: any) => {
            const partyList = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    partyList.push({
                        MobileNumber: mobileNumber,
                        PartyID: dataRow.PartyID,
                        PartyName: dataRow.PartyName,
                        ContactNumber: dataRow.ContactNumber,
                        BillingAddress: dataRow.BillingAddress,
                        BillingCity: dataRow.BillingCity,
                        BillingState: dataRow.BillingState,
                        BillingPincode: dataRow.BillingPincode,
                        ShippingAddress: dataRow.ShippingAddress,
                        ShippingCity: dataRow.ShippingCity,
                        ShippingState: dataRow.ShippingState,
                        ShippingPincode: dataRow.ShippingPincode,
                        GSTIN: dataRow.GSTIN,
                        Email: dataRow.Email,
                        OutstandingBalance: dataRow.OutstandingBalance,
                        CreatedOn: dataRow.CreatedOn,
                        RegistrationType: dataRow.RegistrationType,
                        partyUpdated: dataRow.partyUpdated,
                        CreditPoints: dataRow.CreditPoints
                    });


                }
            }
            return partyList;
        }, err => {
            console.log('Error', err);
            return err;
        });
    }
    // Get parties data from the database to store in the server
    async getAllProductInventory(mobileNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select ChangeSetID,name,ItemID,Date,QtyChanged,Reason,TransactionType from ProductInventory where ServerSync="0" AND BusinessID = "1"', []).then(async (data: any) => {
            const ProductInventoryData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    ProductInventoryData.push({
                        ChangeSetID: dataRow.ChangeSetID,
                        MobileNumber: mobileNumber,
                        name: dataRow.name,
                        ItemID: dataRow.ItemID,
                        Date: dataRow.Date,
                        QtyChanged: dataRow.QtyChanged,
                        Reason: dataRow.Reason,
                        TransactionType: dataRow.TransactionType
                    });
                }
            }
            return ProductInventoryData;
        }, err => {
            console.log('Error', err);
            return err;
        });
    }
    // Get parties data from the database to store in the server
    async getAllPayment(mobileNumber) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select id,BillType,InvoiceId,InvoiceNumber,PartyId,AmountPaid,PaymentMode,PaymentNote,PaymentImage,PaymentDate,IsActivate,PaymentUpdated from Payment where (ServerSync="0" or PaymentUpdated ="1") AND BusinessID = "1"', []).then(async (data: any) => {
            const PaymentData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    PaymentData.push({
                        MobileNumber: mobileNumber,
                        id: dataRow.id,
                        BillType: dataRow.BillType,
                        InvoiceId: dataRow.InvoiceId,
                        InvoiceNumber: dataRow.InvoiceNumber,
                        PartyId: dataRow.PartyId,
                        AmountPaid: dataRow.AmountPaid,
                        PaymentMode: dataRow.PaymentMode,
                        PaymentNote: dataRow.PaymentNote,
                        PaymentImage: dataRow.PaymentImage,
                        PaymentDate: dataRow.PaymentDate,
                        IsActivate: dataRow.IsActivate,
                        PaymentUpdated: dataRow.PaymentUpdated

                    });
                }
            }
            return PaymentData;
        }, err => {
            console.log('Error', err);
            return err;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendSaleDataToSever(SaleData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            saleData: SaleData, // sending sale Invoice array to the server
            ServerSyncID: 1
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error', err);
            return false;
        });
    }

    // Send the data to the server for storing it in the server Database
    async SendSaleItemDataToSever(saleItemData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {

            // tslint:disable-next-line:object-literal-shorthand
            saleItemData: saleItemData, // sending sale item Invoice array
            ServerSyncID: 9
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error', err);
            return err;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendPurchaseDataToSever(PurchaseData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            PurchaseData: PurchaseData, // sending purchase Invoice array to the server
            ServerSyncID: 2

        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error', err);
            return err;
        });
    }

    // Send the data to the server for storing it in the server Database
    async SendPurchaseItemDataToSever(purchaseItemData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; }
        // tslint:disable-next-line:one-line
        else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            purchaseItemData: purchaseItemData, // sending purchase Item array to the server
            ServerSyncID: 10

        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('Error', err);
            return err;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendItemDataToSever(itemData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            itemData: itemData, // sending itemData array to the server
            ServerSyncID: 3
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendCategoryDataToSever(categoryData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
         // tslint:disable-next-line:object-literal-shorthand
            categoryData: categoryData, // sending category  array to the server
            ServerSyncID: 4
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendPartyDataToSever(PartyData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            PartyData: PartyData, // sending party array to the server
            ServerSyncID: 5
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }
    // Send the data to the server for storing it in the server Database
    async SendExpenseDataToSever(ExpenseData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            ExpenseData: ExpenseData, // sending expense array to the server
            ServerSyncID: 6
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }

    // Send the data to the server for storing it in the server Database
    async SendPaymentDataToSever(PaymentData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            PaymentData: PaymentData, // sending Payment array to the server
            ServerSyncID: 8
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }

    // Send the data to the server for storing it in the server Database
    async SendProductInventoryToSever(ProductInventoryData: any[]) {
        let url = '';
        if (isDevMode()) { url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DEV; } else { url = ConstMessages.SERVER_DATA_UPDATE.API_URL; }
        const reqBody = {
            // tslint:disable-next-line:object-literal-shorthand
            ProductInventoryData: ProductInventoryData, // sending Payment array to the server
            ServerSyncID: 7
        };
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // tslint:disable-next-line:object-literal-shorthand
        const options = new RequestOptions({ headers: headers });
        return await this.http.post(url, reqBody, options).toPromise().then((response) => {
            return response;
        }, (err) => {
            console.log(ConstMessages.ErrorCode.ERROR_SERVER_REQUEST_FAILED, err);
            console.log('error ', err);
            return false;
        });
    }

    // Update All the Table for Sync with server column
    async  UpdateExpenseTableData(ExpenseData: any[]) {
        // To update the existing expense table data info in DB
        for (const expense of ExpenseData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE ExpenseList SET ServerSync = ? and ExpenseUpdated = ? WHERE ExpenseID = ?', [1, 0, expense.ExpenseID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);  return err;
            });
        }
    }
    // Update All the Table for Sync with server column
    async  UpdatePaymentTableData(PaymentData: any[]) {
        // To update the existing expense table data info in DB
        for (const Payment of PaymentData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE Payment SET ServerSync = ? and PaymentUpdated = ? WHERE id = ?', [1, 0, Payment.id]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }
    // Update All the Table for Sync with server column
    async  UpdateProductInventoryTableData(ProductInventoryData: any[]) {
        // To update the existing expense table data info in DB
        for (const PoductInventory of ProductInventoryData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE ProductInventory SET ServerSync = ? WHERE ChangeSetID = ?', [1, PoductInventory.ChangeSetID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }
    // Update All the Table for Sync with server column
    async  UpdateSaleTableData(SaleData: any[]) {
        // To update the existing sale table data info in DB
        for (const sale of SaleData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE SalesInvoices SET ServerSync = ?, SaleUpdated = ? WHERE SalesInvoiceID = ?', [1, 0, sale.SalesInvoiceID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }

    }

    // Update All the Table for Sync with server column
    async  UpdateSaleItemTableData(saleItemData: any[]) {
        // To update the existing sale item table data info in DB
        for (const saleItem of saleItemData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE SalesInvoiceItems SET ServerSync = ?,SaleItemUpdated =? WHERE SalesInvoiceItemID = ?', [1, 0, saleItem.SalesInvoiceItemID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }
    // Update All the Table for Sync with server column
    async  UpdatePurchaseTableData(PurchaseData: any[]) {
        // To update the existing purchase table data info in DB
        for (const purchase of PurchaseData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE PurchaseInvoices SET ServerSync = ?,PurchaseUpdated =? WHERE PurchaseInvoiceID = ?', [1, 0, purchase.PurchaseInvoiceID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }

    // Update All the Table for Sync with server column
    async  UpdatePurchaseItemTableData(purchaseItemData: any[]) {
        // To update the existing purchase item table data info in DB
        for (const purchaseItem of purchaseItemData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE PurchaseInvoiceItems SET ServerSync = ? ,purchaseItemUpdated = ? WHERE PurchaseInvoiceItemID = ?', [1, 0, purchaseItem.PurchaseInvoiceItemID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }
    // Update All the Table for Sync with server column
    async  UpdateItemTableData(itemData: any[]) {
        // To update the existing item table data info in DB
        for (const items of itemData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE Item SET ServerSync = ? ,itemUpdated =? WHERE Item_ID = ?', [1, 0, items.Item_ID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }

    }
    // Update All the Table for Sync with server column
    async  UpdateCategoryTableData(categoryData: any[]) {
        // To update the existing category table data info in DB
        for (const category of categoryData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE ItemCategory SET ServerSync = ?,categoryUpdated =? WHERE ItemCategoryID = ?', [1, 0, category.ItemCategoryID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }
    }

    // Update All the Table for Sync with server column
    async  UpdateOtherCategoryTableData() {
        // To update the existing category table data info in DB
        // tslint:disable-next-line:max-line-length
        this.dbProvider.executeSql('UPDATE ItemCategory SET ServerSync = ? ,categoryUpdated =? WHERE ItemCategoryID = ?', [1, 0, 1]).then((data) => {
            return data;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }

    // Update All the Table for Sync with server column
    async  UpdatePettyCashPartyTableData() {
        // To update the existing category table data info in DB
        this.dbProvider.executeSql('UPDATE Party SET ServerSync = ? ,partyUpdated =? WHERE PartyID = ?', [1, 0, 1]).then((data) => {
            return data;
        }, (err) => {
            console.log('error ', err);
            return err;
        });
    }
    // Update All the Table for Sync with server column
    async  UpdatePartyTableData(PartyData: any[]) {

        // To update the existing party table data info in DB
        for (const party of PartyData) {
            // tslint:disable-next-line:max-line-length
            this.dbProvider.executeSql('UPDATE Party SET ServerSync = ? ,partyUpdated =? WHERE PartyID = ?', [1, 0, party.PartyID]).then((data) => {
                return data;
            }, (err) => {
                console.log('error ', err);
                return err;
            });
        }


    }
    // SEND THE RESPONSE BACK TO THE USER AFTER UPDATING THE DATA ON TO THE SERVER
    async  SendResponseBackToServer(BusinessDeviceToken) {
        // the business user gateway URL
        const url = ConstMessages.SERVER_DATA_UPDATE.API_URL_BUSINESS_USER;
        let httpParams = new HttpParams();
        // parameters to be passed with the URL
        httpParams = httpParams.append('DeviceID', BusinessDeviceToken);
        httpParams = httpParams.append('SenderID', BusinessDeviceToken);
        return await this.http.get(url, { params: httpParams }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            console.log('error ', err);
            return err;
        });
    }

    // SEND THE RESPONSE TO THE OLD USER
    async  SendRequestToOldDevice(BusinessDeviceToken) {
        // the business user gateway URL
        const url = ConstMessages.SERVER_DATA_UPDATE.API_URL_DIGI_BILL_PUSH_NOTIFICATION;
        let httpParams = new HttpParams();
        // parameters to be passed with the URL
        httpParams = httpParams.append('DeviceID', BusinessDeviceToken);
        httpParams = httpParams.append('SenderID', BusinessDeviceToken);
        httpParams = httpParams.append('Tab', '1');
        httpParams = httpParams.append('customData', 'UpdateReadOnlyMode');
        httpParams = httpParams.append('messageData', 'UpdatingTheDevice');
        return await this.httpClient.get(url, { params: httpParams }).toPromise().then((response) => {
            // check for the response from the server
            console.log('Response received form Server: ', response);
            return response;
        }, (err) => {
            console.log('Error in getting Data from Server: ', err);
            console.log('error ', err);
            return err; console.log('error ', err);
            return err;
        });
    }


    // update the purchase item data to the server
    PurchaseDataItemtoServer(purchaseItemData) {
        console.log('purchaseItemData Item Data' + JSON.stringify(purchaseItemData));
        this.SendPurchaseItemDataToSever(purchaseItemData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdatePurchaseItemTableData(purchaseItemData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for purchaseItemData');
                });
            }
        });
    }

    ItemDataUpdateToServer(itemData) {
        console.log('itemData Item Data' + JSON.stringify(itemData));
        // send the item data to the server
        this.SendItemDataToSever(itemData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdateItemTableData(itemData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for itemData');
                });
            }
        });
    }

    // update category Data To Server
    CategoryDataUpdateToServer(CategoryData) {
        console.log('CategoryData Item Data' + JSON.stringify(CategoryData));
        // send the category data to the server
        this.SendCategoryDataToSever(CategoryData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdateCategoryTableData(CategoryData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for CategoryData');
                });
            }
        });
    }

    // update the party data To Server
    PartyDataUpdateToServer(PartyData) {
        console.log('PartyData Item Data' + JSON.stringify(PartyData));
        // send the party data to the server
        this.SendPartyDataToSever(PartyData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdatePartyTableData(PartyData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for PartyData');
                });
            }
        });
    }

    // update the expense data to server
    ExpenseDataUpdateToServer(ExpenseData) {
        console.log('ExpenseData Item Data' + JSON.stringify(ExpenseData));
        // send the Expense data to the server
        this.SendExpenseDataToSever(ExpenseData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdateExpenseTableData(ExpenseData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for ExpenseData');
                });
            }
        });
    }

    // update the Payment Data To Server
    PaymentDataUpdateToServer(PaymentData) {
        console.log('PaymentData Item Data' + JSON.stringify(PaymentData));
        this.SendPaymentDataToSever(PaymentData).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdatePaymentTableData(PaymentData).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for PaymentData');
                });
            }
        });
    }

    // update the ProductInventory data to the server
    ProductInventoryDataUpdateToServer(ProductInventory) {
        console.log('ProductInventory Item Data' + JSON.stringify(ProductInventory));
        // send the ProductInventory data to the server
        this.SendProductInventoryToSever(ProductInventory).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdateProductInventoryTableData(ProductInventory).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for ProductInventory');
                });
            }
        });
    }

    // send sale item data to server
    SaleItemDataToServerUpdate(SaleItemDataToServer) {
        console.log('Sale Item Data' + JSON.stringify(SaleItemDataToServer));
        // send the Sale data to the server
        this.SendSaleItemDataToSever(SaleItemDataToServer).then(Response => {
            if (Object.keys(Response).length) {
                this.UpdateSaleItemTableData(SaleItemDataToServer).then(ResponseAfterUpdate => {
                    const CurrentTime = new Date(); // get the current time for updating in the invoice config setting
                    // tslint:disable-next-line:max-line-length
                    this.appSetting.updateAppSetting(CurrentTime, 'syncServerDate'); // update with the current time in the invoice config setting
                    console.log('Data Updated on to the server for Sale Item Data');
                });
            }
        });
    }

}
