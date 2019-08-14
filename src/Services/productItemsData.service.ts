import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IProductItemsData, IHSN_SAC } from '../Model/productItemsData.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ConstantMessages } from '../Constants/constant';
import { TransactionDataService } from './transactionDataService';
import { MeasurementUnitService } from './measurementUnit.service';

@Injectable()
export class ProductItemsData {
    product: IProductItemsData;
    public itemWeightUnit: string[] = [];
    public weightUnit = '';
    itemWeightData = [];
    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, private MeasurementService: MeasurementUnitService, public TransactionData: TransactionDataService, public logService: ErrorLogService) { }

    // To get the Item Weight Value from the Item Weight Table, to be pushed to ItemList Array present in UI
    getItemWeightUnitFromDB(id, callback) {
        let itemWeightFieldName: string;
        if (!this.itemWeightData.length) {
            this.MeasurementService.getMeasurementUnit().then(MeasurementUnit => {
                for (const measurement of MeasurementUnit) {
                    this.itemWeightData.push({
                        id: measurement.MeasurementID,
                        value: measurement.MeasurementCode
                    });
                }
                // for (var WeightTypeData = 0; WeightTypeData < this.itemWeightData.length; WeightTypeData++) {
                //     if (this.itemWeightData[WeightTypeData].id == id) {
                //         itemWeightFieldName = this.itemWeightData[WeightTypeData].value;
                //         break;
                //     }
                // }
                callback(itemWeightFieldName);
            });
        } else {
            // tslint:disable-next-line:prefer-for-of
            for (let WeightTypeData = 0; WeightTypeData < this.itemWeightData.length; WeightTypeData++) {
                if (this.itemWeightData[WeightTypeData].id === id) {
                    itemWeightFieldName = this.itemWeightData[WeightTypeData].value;
                    break;
                }
            }
            callback(itemWeightFieldName);
        }



    }

    // To get all the weight measurement data from Item Measurement Master Table in DB
    async getAllWeightMeasurementData(customQuantityFlag) {
        const itemWeightData = [];
        return await this.MeasurementService.getMeasurementUnit().then(MeasurementUnit => {
            for (const measurement of MeasurementUnit) {
                if (Number(customQuantityFlag) === 1 && measurement.MeasurementCode.toLocaleLowerCase() === 'pcs') {
                    continue;
                } else {
                    itemWeightData.push({
                        id: measurement.MeasurementID,
                        value: measurement.MeasurementCode
                    });
                }

            }
            console.log('end ==== itemWeightData in service (getAllWeightMeasurementData)', itemWeightData);
            return itemWeightData;
        });
    }

    // To populate the ItemList Array by getting the data from the Item table in DB
    getProductItemsData(receivedItemIDs: number[], key: number) {
        const begin = Date.now();
        // tslint:disable-next-line:max-line-length
        let query = 'SELECT MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice,   I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2, I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag, I.DiscountedPrice FROM Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID WHERE I.IsActivate="1" AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        if (receivedItemIDs && receivedItemIDs.length) {
            query += ` AND Item_ID NOT IN (`;
            for (let index = 0; index < receivedItemIDs.length; index++) {
                // tslint:disable-next-line:max-line-length
                if (index + 1 === receivedItemIDs.length) { query += `${receivedItemIDs[index]})`; } else { query += `${receivedItemIDs[index]}, `; }
            }
        }
        query += ` ORDER BY ItemSold DESC`;
        if (key) { query += ` LIMIT ${key}`; }
        return this.dbProvider.executeSql(query, []).then(async (data: any) => {
            const allItemsData: IProductItemsData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    // let itemWeightUnit = this.getItemWeightUnitFromDB(data[index].ItemMeasurementMasterID);
                    // if (this.itemWeightUnit.length === data.rows.length) this.itemWeightUnit = [];
                    // this.itemWeightUnit.push(itemWeightUnit);
                    allItemsData.push({
                        id: dataRow.Item_ID,
                        categoryId: dataRow.ItemCategory_ID,
                        name: dataRow.ItemName,
                        description: dataRow.Item_Desc,
                        HSN_SAC: dataRow.HSN_SAC,
                        barCode: dataRow.barcode,
                        imagePath: dataRow.Item_ImagePath,
                        ItemImageString: dataRow.ItemImageString,
                        ItemImageCss: dataRow.ItemImageCss,
                        purchasePrice: dataRow.PurchasePrice,
                        weight: dataRow.Item_Weight,
                        weightUnit: dataRow.MeasurementCode,
                        discount: 0,
                        discountedPrice: dataRow.DiscountedPrice,
                        sellingPrice: dataRow.DiscountedPrice,
                        count: 0,
                        isMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        initialMinStock: dataRow.MinStockNotification,
                        brand: dataRow.Brand,
                        tax: 0,
                        viewCount: false,
                        addToCart: false,
                        mainStock: dataRow.IsMaintainStock,
                        AllowNegativeStock: dataRow.AllowNegativeStock,
                        currentStock: dataRow.CurrentStock,
                        initialStock: dataRow.CurrentStock,
                        isSellingPriceTaxInclusive: dataRow.isSellingPriceTaxInclusive,
                        isPurchasePriceTaxInclusive: dataRow.isPurchasePriceTaxInclusive,
                        CreatedDate: dataRow.CreatedDate,
                        TaxSlabID1: dataRow.TaxSlabID1,
                        TaxSlabID2: dataRow.TaxSlabID2,
                        TaxSlabID3: dataRow.TaxSlabID3,
                        TaxSlabID4: dataRow.TaxSlabID4,
                        TaxSlabValue1: dataRow.TaxSlab1Amt,
                        TaxSlabValue2: dataRow.TaxSlab2Amt,
                        TaxSlabValue3: dataRow.TaxSlab3Amt,
                        TaxSlabValue4: dataRow.TaxSlab4Amt,
                        ItemMeasurementMasterID: dataRow.ItemMeasurementMasterID,
                        ItemMeasurementMasterIDDuplicate: dataRow.ItemMeasurementMasterID,
                        isActive: dataRow.IsActivate,
                        maximumRetailPrice: dataRow.SellingPrice,
                        maximumRetailPriceDuplicate: dataRow.SellingPrice,
                        discountedPriceDuplicate: dataRow.DiscountedPrice,
                        ItemSold: dataRow.ItemSold,
                        customQuantityFlag: dataRow.customQuantityFlag,
                        sellingPriceDuplicate: dataRow.DiscountedPrice,
                        sellingPriceTax: 0,
                        isNegativeStockAllowed: false
                    });
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].isSellingPriceTaxInclusive = Boolean(Number(allItemsData[allItemsData.length - 1].isSellingPriceTaxInclusive));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].isPurchasePriceTaxInclusive = Boolean(Number(allItemsData[allItemsData.length - 1].isPurchasePriceTaxInclusive));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].isMaintainStock = Boolean(Number(allItemsData[allItemsData.length - 1].isMaintainStock));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].mainStock = Boolean(Number(allItemsData[allItemsData.length - 1].mainStock));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].customQuantityFlag = Boolean(Number((allItemsData[allItemsData.length - 1].customQuantityFlag)));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].AllowNegativeStock = Boolean(Number(allItemsData[allItemsData.length - 1].AllowNegativeStock));
                    // tslint:disable-next-line:max-line-length
                    allItemsData[allItemsData.length - 1].tax = allItemsData[allItemsData.length - 1].TaxSlabValue1 + allItemsData[allItemsData.length - 1].TaxSlabValue2 + allItemsData[allItemsData.length - 1].TaxSlabValue3 + allItemsData[allItemsData.length - 1].TaxSlabValue4;
                    // tslint:disable-next-line:max-line-length
                    if (!allItemsData[allItemsData.length - 1].sellingPrice) { allItemsData[allItemsData.length - 1].sellingPrice = allItemsData[allItemsData.length - 1].maximumRetailPrice; }
                    // tslint:disable-next-line:max-line-length
                    await allItemsData[allItemsData.length - 1].tax,
                    // tslint:disable-next-line:no-unused-expression
                    allItemsData[allItemsData.length - 1].mainStock, allItemsData[allItemsData.length - 1].isSellingPriceTaxInclusive,
                     // tslint:disable-next-line:no-unused-expression
                     allItemsData[allItemsData.length - 1].isMaintainStock, allItemsData[allItemsData.length - 1].AllowNegativeStock,
                      // tslint:disable-next-line:no-unused-expression
                      allItemsData[allItemsData.length - 1].isPurchasePriceTaxInclusive, allItemsData[allItemsData.length - 1].sellingPrice;
                }
            }
            console.log('Item Table Get Data Query Response Time: ', Date.now() - begin, ' ms');
            return await allItemsData;
        }, err => {
            // tslint:disable-next-line:max-line-length
            return err;
        });
    }

    // To update the item data for the item provided to method to the Item Table in DB
    async updateProductData(product: IProductItemsData) {
        if (null == product.isMaintainStockNumber || undefined === product.isMaintainStockNumber) {
            product.isMaintainStockNumber = Number(product.isMaintainStock);
        }
        if (null == product.isSellingPriceTaxInclusiveNumber || undefined === product.isSellingPriceTaxInclusiveNumber) {
            product.isSellingPriceTaxInclusiveNumber = Number(product.isSellingPriceTaxInclusive);
        }
        if (null == product.isPurchasePriceTaxInclusiveNumber || undefined === product.isPurchasePriceTaxInclusiveNumber) {
            if (product.isPurchasePriceTaxInclusive) {
                product.isPurchasePriceTaxInclusiveNumber = Number(product.isPurchasePriceTaxInclusive);
            } else {
                product.isPurchasePriceTaxInclusiveNumber = 0;
            }
        }
        // tslint:disable-next-line:max-line-length
        const query = 'UPDATE Item SET ItemCategory_ID=?, ItemName = ?, Item_ImagePath = ?,ItemImageString = ?,ItemImageCss = ?, HSN_SAC = ?, barcode = ?, Item_Desc = ?, Item_Weight = ?, PurchasePrice = ?, SellingPrice = ?, CurrentStock = ?, MinStockNotification = ?, Brand = ?, ItemMeasurementMasterID = ?, isSellingPriceTaxInclusive = ?,isPurchasePriceTaxInclusive = ?, IsMaintainStock = ?, TaxSlabID1 = ?, TaxSlabID2 = ?, TaxSlabID3 = ?, TaxSlabID4 = ?, TaxSlab1Amt = ?, TaxSlab2Amt = ?, TaxSlab3Amt = ?, TaxSlab4Amt = ?, CreatedDate = DATETIME("now", "localtime"), DiscountedPrice = ?,itemUpdated ="1", customQuantityFlag = ? WHERE Item_ID = ?';
        // tslint:disable-next-line:max-line-length
        const data = [product.categoryId, product.name, product.imagePath, product.ItemImageString, product.ItemImageCss, product.HSN_SAC, product.barCode, product.description, product.weight, product.purchasePrice, product.maximumRetailPrice, product.currentStock.toFixed(2), product.MinStockNotification, product.brand, product.ItemMeasurementMasterID, product.isSellingPriceTaxInclusiveNumber, product.isPurchasePriceTaxInclusiveNumber, product.isMaintainStockNumber, product.TaxSlabID1, product.TaxSlabID2, product.TaxSlabID3, product.TaxSlabID4, product.TaxSlabValue1, product.TaxSlabValue2, product.TaxSlabValue3, product.TaxSlabValue4, product.sellingPrice, Number(product.customQuantityFlag), product.id];
        return await this.dbProvider.executeSql(query, data).then(dataRow => {
            return dataRow;
        }, (err) => {
            return err;
        });
    }

    async updateProductLevelInventory(itemID, name, Qty, Reason, TransactionType, isNewItem, InsertDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO ProductInventory (ItemID, name, Date, QtyChanged, Reason, TransactionType, BusinessID) VALUES (?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        const data = [itemID, name, InsertDate, Qty, Reason, TransactionType];
        return await this.dbProvider.executeSql(query, data).then(dataInProductInventory => {
            console.log('dataInProductInventory ====>', dataInProductInventory);
            return dataInProductInventory;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    async getProductLevelInventory(itemID) {
        const query = 'SELECT ItemID,Date,QtyChanged,Reason,name,TransactionType FROM ProductInventory where ItemID = ?';
        const data = [itemID];
        return await this.dbProvider.executeSql(query, data).then(
            async (dataset: any) => {
                const invData = [];
                if (dataset && dataset.length > 0) {
                    for (const dataRow of dataset) {
                        invData.push({
                            ItemID: dataRow.ItemID,
                            Date: dataRow.Date,
                            Qty: dataRow.QtyChanged,
                            Reason: dataRow.Reason,
                            name: dataRow.name,
                            TransactionType: dataRow.TransactionType
                        });
                    }
                }
                for (const data1 of invData) {
                    if (0 > Number(data1.Qty)) { data1.Qty *= -1; }
                } // Changing the -ve value for Quantity
                return await invData;
            }, (err) => {
                console.log('Error: ', err);
                return err;
            });
    }

    /** To update the item data for the item provided in Item Table in DB once the sale process is completed or sale invoice is edited */
    async updateProductDataAfterSaleProcess(product: IProductItemsData) {
        if (product.count === undefined || product.count == null) {
            product.count = 0;
        }
        // Add the count to the item sold value and update it in database
        product.ItemSold += product.count;
        const query = 'UPDATE Item SET CurrentStock = ?, ItemSold = ?, itemUpdated = "1" WHERE Item_ID = ?';
        const data = [product.currentStock.toFixed(2), product.ItemSold, product.id];
        return await this.dbProvider.executeSql(query, data).then(dataRow => {
            return dataRow;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To get the item from the Items Table in DB by Item ID
    async getItemById(id) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice, I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2, I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag, I.DiscountedPrice FROM Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID WHERE I.Item_ID = ? LIMIT 1', [id]).then(async (data: any) => {
            let updatedItem: IProductItemsData;
            if (data && data.length > 0) {
                updatedItem = {
                    id: data.Item_ID,
                    categoryId: data.ItemCategory_ID,
                    name: data.ItemName,
                    description: data.Item_Desc,
                    HSN_SAC: data.HSN_SAC,
                    barCode: data.barcode,
                    imagePath: data.Item_ImagePath,
                    ItemImageString: data.ItemImageString,
                    ItemImageCss: data.ItemImageCss,
                    purchasePrice: data.PurchasePrice,
                    weight: data.Item_Weight,
                    weightUnit: data.MeasurementCode,
                    discount: 0,
                    discountedPrice: data.DiscountedPrice,
                    sellingPrice: data.DiscountedPrice,
                    count: 0,
                    isMaintainStock: data.IsMaintainStock,
                    MinStockNotification: data.MinStockNotification,
                    AllowNegativeStock: data.AllowNegativeStock,
                    brand: data.Brand,
                    tax: 0,
                    viewCount: false,
                    addToCart: false,
                    mainStock: data.IsMaintainStock,
                    currentStock: data.CurrentStock,
                    isSellingPriceTaxInclusive: data.isSellingPriceTaxInclusive,
                    isPurchasePriceTaxInclusive: data.isPurchasePriceTaxInclusive,
                    CreatedDate: data.CreatedDate,
                    TaxSlabID1: data.TaxSlabID1,
                    TaxSlabID2: data.TaxSlabID2,
                    TaxSlabID3: data.TaxSlabID3,
                    TaxSlabID4: data.TaxSlabID4,
                    TaxSlabValue1: data.TaxSlab1Amt,
                    TaxSlabValue2: data.TaxSlab2Amt,
                    TaxSlabValue3: data.TaxSlab3Amt,
                    TaxSlabValue4: data.TaxSlab4Amt,
                    ItemMeasurementMasterID: data.ItemMeasurementMasterID,
                    ItemMeasurementMasterIDDuplicate: data.ItemMeasurementMasterID,
                    isActive: data.IsActivate,
                    maximumRetailPrice: data.SellingPrice,
                    maximumRetailPriceDuplicate: data.SellingPrice,
                    discountedPriceDuplicate: data.DiscountedPrice,
                    ItemSold: data.ItemSold,
                    customQuantityFlag: data.customQuantityFlag,
                    sellingPriceDuplicate: data.DiscountedPrice,
                    sellingPriceTax: 0,
                    isNegativeStockAllowed: false
                };
                updatedItem.isSellingPriceTaxInclusive = Boolean(Number(updatedItem.isSellingPriceTaxInclusive));
                updatedItem.isPurchasePriceTaxInclusive = Boolean(Number(updatedItem.isPurchasePriceTaxInclusive));
                updatedItem.isMaintainStock = Boolean(Number(updatedItem.isMaintainStock));
                updatedItem.mainStock = Boolean(Number(updatedItem.mainStock));
                updatedItem.customQuantityFlag = Boolean(Number(updatedItem.customQuantityFlag));
                updatedItem.AllowNegativeStock = Boolean(Number(updatedItem.AllowNegativeStock));
                // tslint:disable-next-line:max-line-length
                updatedItem.tax = updatedItem.TaxSlabValue1 + updatedItem.TaxSlabValue2 + updatedItem.TaxSlabValue3 + updatedItem.TaxSlabValue4;
                if (!updatedItem.sellingPrice) { updatedItem.sellingPrice = updatedItem.maximumRetailPrice; }
                await updatedItem.sellingPrice;
            }
            return await updatedItem;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    async addNewProduct(product: IProductItemsData) {
        // tslint:disable-next-line:max-line-length
        const row = [product.categoryId, product.name, product.HSN_SAC, product.barCode, product.description, product.weight, product.imagePath, product.ItemImageString, product.ItemImageCss, product.purchasePrice, product.maximumRetailPrice, product.isSellingPriceTaxInclusiveNumber, product.isPurchasePriceTaxInclusiveNumber, product.isMaintainStockNumber, product.ItemMeasurementMasterID, product.currentStock.toFixed(2), product.MinStockNotification, product.brand, product.TaxSlabID1, product.TaxSlabID2, product.TaxSlabID3, product.TaxSlabID4, product.TaxSlabValue1, product.TaxSlabValue2, product.TaxSlabValue3, product.TaxSlabValue4, product.sellingPrice, Number(product.customQuantityFlag)];
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO Item (ItemCategory_ID, ItemName, HSN_SAC, barcode, Item_Desc, Item_Weight, Item_ImagePath,ItemImageString,ItemImageCss, PurchasePrice, SellingPrice, isSellingPriceTaxInclusive,isPurchasePriceTaxInclusive, IsMaintainStock, ItemMeasurementMasterID, CurrentStock, MinStockNotification, Brand, TaxSlabID1, TaxSlabID2, TaxSlabID3, TaxSlabID4, TaxSlab1Amt,TaxSlab2Amt,TaxSlab3Amt, TaxSlab4Amt, CreatedDate, \'IsActivate\', \'DiscountedPrice\', \'customQuantityFlag\', \'BusinessID\') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,DATETIME(\'now\', \'localtime\'),\'1\',?,?, (SELECT BusinessID FROM Business WHERE IsActive = \'1\'))';
        return await this.dbProvider.executeSql(query, row).then((data: any) => {
            console.log('data inserted in Item table .'); console.log(data);
            const TodaysDate = new Date().getTime();
            this.TransactionData.UpdateAnalyticsData(TodaysDate, ConstantMessages.TransactionDateAnalytics.ITEM, false);
            this.TransactionData.UpdateAnalyticsDataForDay(ConstantMessages.TransactionDateAnalyticsForDay.ITEMS, 1);
            return data;

        }, (err) => {
            console.log('Error: ', err);
            return err;
        });

    }
    // To get the recently added item from the Item Table in DB
    getNewProduct() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('SELECT MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice, I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2, I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag, I.DiscountedPrice FROM  Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID where I.IsActivate=\'1\' AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY I.Item_ID DESC LIMIT 1', {}).then(async (data: any) => {
            let newItem: IProductItemsData;
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    //  this.weightUnit = this.getItemWeightUnitFromDB(data[index].ItemMeasurementMasterID);
                    newItem = {
                        id: dataRow.Item_ID,
                        categoryId: dataRow.ItemCategory_ID,
                        name: dataRow.ItemName,
                        description: dataRow.Item_Desc,
                        HSN_SAC: dataRow.HSN_SAC,
                        barCode: dataRow.barcode,
                        imagePath: dataRow.Item_ImagePath,
                        ItemImageString: dataRow.ItemImageString,
                        ItemImageCss: dataRow.ItemImageCss,
                        purchasePrice: dataRow.PurchasePrice,
                        weight: dataRow.Item_Weight,
                        weightUnit: dataRow.MeasurementCode,
                        discount: 0,
                        discountedPrice: dataRow.DiscountedPrice,
                        sellingPrice: dataRow.DiscountedPrice,
                        count: 0,
                        isMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        initialMinStock: dataRow.MinStockNotification,
                        AllowNegativeStock: dataRow.AllowNegativeStock,
                        brand: dataRow.Brand,
                        tax: 0,
                        viewCount: false,
                        addToCart: false,
                        mainStock: dataRow.IsMaintainStock,
                        currentStock: dataRow.CurrentStock,
                        initialStock: dataRow.CurrentStock,
                        isSellingPriceTaxInclusive: dataRow.isSellingPriceTaxInclusive,
                        isPurchasePriceTaxInclusive: dataRow.isPurchasePriceTaxInclusive,
                        TaxSlabID1: dataRow.TaxSlabID1,
                        TaxSlabID2: dataRow.TaxSlabID2,
                        TaxSlabID3: dataRow.TaxSlabID3,
                        TaxSlabID4: dataRow.TaxSlabID4,
                        TaxSlabValue1: dataRow.TaxSlab1Amt,
                        TaxSlabValue2: dataRow.TaxSlab2Amt,
                        TaxSlabValue3: dataRow.TaxSlab3Amt,
                        TaxSlabValue4: dataRow.TaxSlab4Amt,
                        ItemMeasurementMasterID: dataRow.ItemMeasurementMasterID,
                        ItemMeasurementMasterIDDuplicate: dataRow.ItemMeasurementMasterID,
                        CreatedDate: dataRow.CreatedDate,
                        isActive: dataRow.IsActivate,
                        maximumRetailPrice: dataRow.SellingPrice,
                        maximumRetailPriceDuplicate: dataRow.SellingPrice,
                        discountedPriceDuplicate: dataRow.DiscountedPrice,
                        ItemSold: dataRow.ItemSold,
                        customQuantityFlag: Boolean(Number(data.customQuantityFlag)),
                        sellingPriceDuplicate: dataRow.DiscountedPrice,
                        sellingPriceTax: 0,
                        isNegativeStockAllowed: false
                    };
                    newItem.isSellingPriceTaxInclusive = Boolean(Number(newItem.isSellingPriceTaxInclusive));
                    newItem.isPurchasePriceTaxInclusive = Boolean(Number(newItem.isPurchasePriceTaxInclusive));
                    newItem.isMaintainStock = Boolean(Number(newItem.isMaintainStock));
                    newItem.mainStock = Boolean(Number(newItem.mainStock));
                    newItem.customQuantityFlag = Boolean(newItem.customQuantityFlag);
                    newItem.AllowNegativeStock = Boolean(Number(newItem.AllowNegativeStock));
                    newItem.tax = newItem.TaxSlabValue1 + newItem.TaxSlabValue2 + newItem.TaxSlabValue3 + newItem.TaxSlabValue4;
                    // if (!newItem.sellingPrice) newItem.sellingPrice = newItem.maximumRetailPrice;
                    // tslint:disable-next-line:max-line-length
                    // await newItem.tax, newItem.isSellingPriceTaxInclusive, newItem.isMaintainStock, newItem.AllowNegativeStock, newItem.isPurchasePriceTaxInclusive, newItem.sellingPrice;
                }
            }
            return await newItem;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To get the all HSN/SAC Number Info from the HSN_SAC table in DB
    getHSN_SACData() {
        const query = 'SELECT HSNID, HSNCode, Description FROM HSN_SAC';
        return this.dbProvider.executeSql(query, []).then(
            async (data: any) => {
                const hsnData: IHSN_SAC[] = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        hsnData.push({
                            id: dataRow.HSNID,
                            hsn_sac: dataRow.HSNCode,
                            desc: dataRow.Description
                        });
                    }
                }
                return await hsnData;
            },
            (err) => {
                console.log('Error: ', err);
                return err;
            }
        );
    }
    // Delete all the category products
    async DeleteAllCategoryItems(CategoryId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update Item SET IsActivate="0", itemUpdated = "1" where ItemCategory_ID=?', [CategoryId]).then((data) => {
            console.log('Products Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Get all the category products
    async SelectAllCategoryItems(CategoryId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select * from Item where ItemCategory_ID=? and IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")', [CategoryId]).then((data: any) => {
            return data.length;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }
    // Delete product from the list
    async DeleteItem(ProductId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update Item SET IsActivate="0", itemUpdated = "1" where Item_ID=?', [ProductId]).then((data: any) => {
            console.log('Item Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    // Restore deleted product to the items list
    async restoreDeletedItem(ProductId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update Item SET IsActivate="1", itemUpdated = "1" where Item_ID=?', [ProductId]).then((data) => {
            console.log('Deleted Item Restored successfully');
            return data;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }


    // Restore all the Deleted category products once the category is restored
    async restoreDeletedCategoryItems(CategoryId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('Update Item SET IsActivate="1", itemUpdated = "1" where ItemCategory_ID=?', [CategoryId]).then((data) => {
            console.log('Products Restored successfully');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            console.log('Error: ', err);
            return err;
        });
    }

    // To get the number of items which are present in the database
    getProductCount() {
        const query = 'SELECT Count(*) AS seq FROM Item WHERE BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return this.dbProvider.executeSql(query, []).then(async (data: any) => {
            let Length = 0;
            if (data && data.rows.length) { Length = data.seq; }
            return await Length;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To get the items of a category by category id
    getDeletedCategoryItems(categoryId: number) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('SELECT MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice, I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2, I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag, I.DiscountedPrice FROM Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID where I.ItemCategory_ID = ? AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY I.Item_ID DESC', [categoryId]).then(async (data: any) => {
            const items: IProductItemsData[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    items.push({
                        id: dataRow.Item_ID,
                        categoryId: dataRow.ItemCategory_ID,
                        name: dataRow.ItemName,
                        description: dataRow.Item_Desc,
                        HSN_SAC: dataRow.HSN_SAC,
                        barCode: dataRow.barcode,
                        imagePath: dataRow.Item_ImagePath,
                        ItemImageString: dataRow.ItemImageString,
                        ItemImageCss: dataRow.ItemImageCss,
                        purchasePrice: dataRow.PurchasePrice,
                        weight: dataRow.Item_Weight,
                        weightUnit: dataRow.MeasurementCode,
                        discount: 0,
                        discountedPrice: dataRow.DiscountedPrice,
                        sellingPrice: dataRow.DiscountedPrice,
                        count: 0,
                        isMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        initialMinStock: dataRow.MinStockNotification,
                        AllowNegativeStock: dataRow.AllowNegativeStock,
                        brand: dataRow.Brand,
                        tax: 0,
                        viewCount: false,
                        addToCart: false,
                        mainStock: dataRow.IsMaintainStock,
                        currentStock: dataRow.CurrentStock,
                        initialStock: dataRow.CurrentStock,
                        isSellingPriceTaxInclusive: dataRow.isSellingPriceTaxInclusive,
                        isPurchasePriceTaxInclusive: dataRow.isPurchasePriceTaxInclusive,
                        TaxSlabID1: dataRow.TaxSlabID1,
                        TaxSlabID2: dataRow.TaxSlabID2,
                        TaxSlabID3: dataRow.TaxSlabID3,
                        TaxSlabID4: dataRow.TaxSlabID4,
                        TaxSlabValue1: dataRow.TaxSlab1Amt,
                        TaxSlabValue2: dataRow.TaxSlab2Amt,
                        TaxSlabValue3: dataRow.TaxSlab3Amt,
                        TaxSlabValue4: dataRow.TaxSlab4Amt,
                        ItemMeasurementMasterID: dataRow.ItemMeasurementMasterID,
                        ItemMeasurementMasterIDDuplicate: dataRow.ItemMeasurementMasterID,
                        CreatedDate: dataRow.CreatedDate,
                        isActive: dataRow.IsActivate,
                        maximumRetailPrice: dataRow.SellingPrice,
                        maximumRetailPriceDuplicate: dataRow.SellingPrice,
                        ItemSold: dataRow.ItemSold,
                        customQuantityFlag: dataRow.customQuantityFlag,
                        sellingPriceDuplicate: dataRow.DiscountedPrice,
                        discountedPriceDuplicate: dataRow.DiscountedPrice,
                        sellingPriceTax: 0,
                        isNegativeStockAllowed: false
                    });
                    // tslint:disable-next-line:max-line-length
                    items[items.length - 1].isSellingPriceTaxInclusive = Boolean(Number(items[items.length - 1].isSellingPriceTaxInclusive));
                    // tslint:disable-next-line:max-line-length
                    items[items.length - 1].isPurchasePriceTaxInclusive = Boolean(Number(items[items.length - 1].isPurchasePriceTaxInclusive));
                    items[items.length - 1].isMaintainStock = Boolean(Number(items[items.length - 1].isMaintainStock));
                    items[items.length - 1].mainStock = Boolean(Number(items[items.length - 1].mainStock));
                    items[items.length - 1].customQuantityFlag = Boolean(Number((items[items.length - 1].customQuantityFlag)));
                    items[items.length - 1].AllowNegativeStock = Boolean(Number(items[items.length - 1].AllowNegativeStock));
                    // tslint:disable-next-line:max-line-length
                    items[items.length - 1].tax = items[items.length - 1].TaxSlabValue1 + items[items.length - 1].TaxSlabValue2 + items[items.length - 1].TaxSlabValue3 + items[items.length - 1].TaxSlabValue4;
                    // tslint:disable-next-line:max-line-length
                    if (!items[items.length - 1].sellingPrice) { items[items.length - 1].sellingPrice = items[items.length - 1].maximumRetailPrice; }
                    // tslint:disable-next-line:max-line-length
                    await items[items.length - 1].sellingPrice;
                }
            }
            return await items;
        }, (err) => {
            console.log('Error: ', err);
            return err;
        });
    }

    isCategoryActive(categoryId: number) {
        const query = 'SELECT IsActivate FROM ItemCategory WHERE ItemCategoryID = ?';
        return this.dbProvider.executeSql(query, []).then(async (data: any) => {
            let isActive = 0;
            if (data.length && data) { isActive = data.IsActivate; }
            return Boolean(Number(isActive));
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }


    // Update Discounted Price for all product for database update
    async UpdateProductDiscountPrice() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('UPDATE Item SET DiscountedPrice = SellingPrice WHERE BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')', []).then((data) => {
            console.log('Products DiscountedPrice successfully Update');
            return data;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DELETE_FAILED, ' ;SRC - Service Class:ProductItemsData method:UpdateProductDiscountPrice', err); console.log('Error:', err);
            return err;
        });
    }

    // Selecting the Sale Draft Invoices invoice table data from DB in batches
    async getNumberOfSaleDraftTransaction() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT COUNT(*) AS SaleDraftInvoiceID FROM DraftSalesInvoices where IsActivate=\'1\' AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\')';
        return await this.dbProvider.executeSql(query, []).then((data: any) => {
            let SaleDraftInvoiceID = 0;
            if (data.length) { SaleDraftInvoiceID = data.SaleDraftInvoiceID; }
            return { value: Number(SaleDraftInvoiceID) };
        }, err => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PURCHASE_SALES_DATA_FAILED, ' ;SRC - Service Class:PurchaseReportService method:getNumberOfPurchaseTransaction', err);
            return null;
        });
    }

    // To get the items of a category by category id
    getCategoryItems(categoryId: number, receivedItemIDs: number[], key: number) {
        // let begin = Date.now();
        // // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        // let query = `SELECT  MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice,
        // tslint:disable-next-line:max-line-length
        // I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2,
        // tslint:disable-next-line:max-line-length
        // I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag,
        // tslint:disable-next-line:max-line-length
        // I.DiscountedPrice FROM Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID WHERE I.IsActivate='1' AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = '1')`;
        // if (receivedItemIDs && receivedItemIDs.length) {
        //     query += ` AND Item_ID NOT IN (`
        //     for (let index = 0; index < receivedItemIDs.length; index++) {
        //         if (index + 1 === receivedItemIDs.length) query += `${receivedItemIDs[index]})`;
        //         else query += `${receivedItemIDs[index]}, `;
        //     }
        // }
        // query += ` AND ItemCategory_ID = ${categoryId} ORDER BY ItemSold DESC`;
        // if (key) query += ` LIMIT ${key}`;
        // return this.dbProvider.executeSql(query, []).then(async (data) => {
        //     let items: IProductItemsData[] = [];
        //     if (data.rows.length > 0) {
        //         for (var index = 0; index < data.rows.length; index++) {
        //             items.push({
        //                 id: dataRow.Item_ID,
        //                 categoryId: dataRow.ItemCategory_ID,
        //                 name: dataRow.ItemName,
        //                 description: dataRow.Item_Desc,
        //                 HSN_SAC: dataRow.HSN_SAC,
        //                 barCode: dataRow.barcode,
        //                 imagePath: dataRow.Item_ImagePath,
        //                 ItemImageString: dataRow.ItemImageString,
        //                 ItemImageCss: dataRow.ItemImageCss,
        //                 purchasePrice: dataRow.PurchasePrice,
        //                 weight: dataRow.Item_Weight,
        //                 weightUnit: dataRow.MeasurementCode,
        //                 discount: 0,
        //                 discountedPrice: dataRow.DiscountedPrice,
        //                 sellingPrice: dataRow.DiscountedPrice,
        //                 count: 0,
        //                 isMaintainStock: dataRow.IsMaintainStock,
        //                 MinStockNotification: dataRow.MinStockNotification,
        //                 initialMinStock: dataRow.MinStockNotification,
        //                 AllowNegativeStock: dataRow.AllowNegativeStock,
        //                 brand: dataRow.Brand,
        //                 tax: 0,
        //                 viewCount: false,
        //                 addToCart: false,
        //                 mainStock: dataRow.IsMaintainStock,
        //                 currentStock: dataRow.CurrentStock,
        //                 initialStock: dataRow.CurrentStock,
        //                 isSellingPriceTaxInclusive: dataRow.isSellingPriceTaxInclusive,
        //                 isPurchasePriceTaxInclusive: dataRow.isPurchasePriceTaxInclusive,
        //                 TaxSlabID1: dataRow.TaxSlabID1,
        //                 TaxSlabID2: dataRow.TaxSlabID2,
        //                 TaxSlabID3: dataRow.TaxSlabID3,
        //                 TaxSlabID4: dataRow.TaxSlabID4,
        //                 TaxSlabValue1: dataRow.TaxSlab1Amt,
        //                 TaxSlabValue2: dataRow.TaxSlab2Amt,
        //                 TaxSlabValue3: dataRow.TaxSlab3Amt,
        //                 TaxSlabValue4: dataRow.TaxSlab4Amt,
        //                 ItemMeasurementMasterID: dataRow.ItemMeasurementMasterID,
        //                 ItemMeasurementMasterIDDuplicate: dataRow.ItemMeasurementMasterID,
        //                 CreatedDate: dataRow.CreatedDate,
        //                 isActive: dataRow.IsActivate,
        //                 maximumRetailPrice: dataRow.SellingPrice,
        //                 maximumRetailPriceDuplicate: dataRow.SellingPrice,
        //                 discountedPriceDuplicate: dataRow.DiscountedPrice,
        //                 ItemSold: dataRow.ItemSold,
        //                 customQuantityFlag: dataRow.customQuantityFlag,
        //                 sellingPriceDuplicate: dataRow.DiscountedPrice,
        //                 sellingPriceTax: 0,
        //                 isNegativeStockAllowed: false
        //             });
        //             items[index].isSellingPriceTaxInclusive = Boolean(Number(items[index].isSellingPriceTaxInclusive));
        //             items[index].isPurchasePriceTaxInclusive = Boolean(Number(items[index].isPurchasePriceTaxInclusive));
        //             items[index].isMaintainStock = Boolean(Number(items[index].isMaintainStock));
        //             items[index].mainStock = Boolean(Number(items[index].mainStock));
        //             items[index].customQuantityFlag = Boolean(Number((items[index].customQuantityFlag)));
        //             items[index].AllowNegativeStock = Boolean(Number(items[index].AllowNegativeStock));
        // tslint:disable-next-line:max-line-length
        //             items[index].tax = items[index].TaxSlabValue1 + items[index].TaxSlabValue2 + items[index].TaxSlabValue3 + items[index].TaxSlabValue4;
        //             if (!items[index].sellingPrice) items[index].sellingPrice = items[index].maximumRetailPrice;
        // tslint:disable-next-line:max-line-length
        //             await items[index].tax, items[index].isSellingPriceTaxInclusive, items[index].isMaintainStock, items[index].AllowNegativeStock, items[index].isPurchasePriceTaxInclusive, items[index].sellingPrice;
        //         }
        //     }
        //     console.log('Item Table Get Data By Category Query Response Time: ', Date.now() - begin, ' ms');
        //     return await items;
        // }, (err) => {
        // tslint:disable-next-line:max-line-length
        //     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_NOT_PRESENT, " ;SRC - Service Class:ProductItemsData method:getCategoryItems", err)
        //     return err;
        // });
        return null;
    }

    // To get the item from the Items Table in DB by Item ID
    async getItemForBarCode(barCode) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT MI.MeasurementCode,I.Item_ID, I.ItemCategory_ID, I.ItemName, I.Item_Desc, I.HSN_SAC, I.barcode, I.Item_ImagePath, I.ItemImageString, I.ItemImageCss, I.PurchasePrice, I.Item_Weight, I.DiscountedPrice, I.IsMaintainStock, I.MinStockNotification, I.Brand, I.AllowNegativeStock, I.CurrentStock, I.isSellingPriceTaxInclusive, I.isPurchasePriceTaxInclusive, I.CreatedDate, I.TaxSlabID1, I.TaxSlabID2, I.TaxSlabID3, I.TaxSlabID4, I.TaxSlab1Amt, I.TaxSlab1Amt, I.TaxSlab2Amt, I.TaxSlab3Amt, I.TaxSlab4Amt, I.ItemMeasurementMasterID, I.IsActivate, I.SellingPrice, I.ItemSold, I.customQuantityFlag, I.DiscountedPrice FROM Item I LEFT Join MeasurementUnit MI ON I.ItemMeasurementMasterID=MI.MeasurementID WHERE I.barcode = ? LIMIT 1', [barCode]).then(async (data: any) => {
            let updatedItem: IProductItemsData;
            if (data.length > 0) {
                // this.weightUnit = this.getItemWeightUnitFromDB(data.rows.item.ItemMeasurementMasterID);
                updatedItem = {
                    id: data.Item_ID,
                    categoryId: data.ItemCategory_ID,
                    name: data.ItemName,
                    description: data.Item_Desc,
                    HSN_SAC: data.HSN_SAC,
                    barCode: data.barcode,
                    imagePath: data.Item_ImagePath,
                    ItemImageString: data.ItemImageString,
                    ItemImageCss: data.ItemImageCss,
                    purchasePrice: data.PurchasePrice,
                    weight: data.Item_Weight,
                    weightUnit: data.MeasurementCode,
                    discount: 0,
                    discountedPrice: data.DiscountedPrice,
                    sellingPrice: data.DiscountedPrice,
                    count: 0,
                    isMaintainStock: data.IsMaintainStock,
                    MinStockNotification: data.MinStockNotification,
                    AllowNegativeStock: data.AllowNegativeStock,
                    brand: data.Brand,
                    tax: 0,
                    viewCount: false,
                    addToCart: false,
                    mainStock: data.IsMaintainStock,
                    currentStock: data.CurrentStock,
                    isSellingPriceTaxInclusive: data.isSellingPriceTaxInclusive,
                    isPurchasePriceTaxInclusive: data.isPurchasePriceTaxInclusive,
                    CreatedDate: data.CreatedDate,
                    TaxSlabID1: data.TaxSlabID1,
                    TaxSlabID2: data.TaxSlabID2,
                    TaxSlabID3: data.TaxSlabID3,
                    TaxSlabID4: data.TaxSlabID4,
                    TaxSlabValue1: data.TaxSlab1Amt,
                    TaxSlabValue2: data.TaxSlab2Amt,
                    TaxSlabValue3: data.TaxSlab3Amt,
                    TaxSlabValue4: data.TaxSlab4Amt,
                    ItemMeasurementMasterID: data.ItemMeasurementMasterID,
                    ItemMeasurementMasterIDDuplicate: data.ItemMeasurementMasterID,
                    isActive: data.IsActivate,
                    maximumRetailPrice: data.SellingPrice,
                    maximumRetailPriceDuplicate: data.SellingPrice,
                    ItemSold: data.ItemSold,
                    customQuantityFlag: data.customQuantityFlag,
                    sellingPriceDuplicate: data.DiscountedPrice,
                    discountedPriceDuplicate: data.DiscountedPrice,
                    sellingPriceTax: 0,
                    isNegativeStockAllowed: false
                };
                updatedItem.isSellingPriceTaxInclusive = Boolean(Number(updatedItem.isSellingPriceTaxInclusive));
                updatedItem.isPurchasePriceTaxInclusive = Boolean(Number(updatedItem.isPurchasePriceTaxInclusive));
                updatedItem.isMaintainStock = Boolean(Number(updatedItem.isMaintainStock));
                updatedItem.mainStock = Boolean(Number(updatedItem.mainStock));
                updatedItem.customQuantityFlag = Boolean(Number(updatedItem.customQuantityFlag));
                updatedItem.AllowNegativeStock = Boolean(Number(updatedItem.AllowNegativeStock));
                // tslint:disable-next-line:max-line-length
                updatedItem.tax = updatedItem.TaxSlabValue1 + updatedItem.TaxSlabValue2 + updatedItem.TaxSlabValue3 + updatedItem.TaxSlabValue4;
                if (!updatedItem.sellingPrice) { updatedItem.sellingPrice = updatedItem.maximumRetailPrice; }
                await updatedItem.sellingPrice;
            }
            return await updatedItem;
        }, (err) => {
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_NOT_PRESENT, ' ;SRC - Service Class:ProductItemsData method:getItemById', err);
            return err;
        });
    }

}
