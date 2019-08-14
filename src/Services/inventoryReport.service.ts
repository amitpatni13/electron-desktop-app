import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
@Injectable()
export class InventoryReportService {
    private allCategoryID = [];
    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) {
    }
    // get the category Details From the Database
    async  getCategoryData() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ItemCategoryID, ItemCategory_Name  from ItemCategory where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then(
            (data: any) => {
                const categoryData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        categoryData.push({
                            ItemCategoryID: dataRow.ItemCategoryID,
                            ItemCategory_Name: dataRow.ItemCategory_Name
                        });
                      // filling allCategoryID wit values from ItemCategoryID of ItemCategory Table
                        this.allCategoryID.push(dataRow.ItemCategoryID);
                    }
                }
                return categoryData;
            }, err => {
                console.log('Error: ', err);
                return err;
            });
    }
    // Item Details from the database
    async  getItemData(CategoryId) {
        if (0 === CategoryId) {
            CategoryId = this.allCategoryID.join(',');
        }
        console.log(CategoryId);
        // tslint:disable-next-line:max-line-length
        let query = 'SELECT Item_ID,Item_ImagePath,ItemCategory_ID,ItemName,PurchasePrice,SellingPrice,CurrentStock,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item  Where ItemCategory_ID In (?) AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        query = query.replace('?', CategoryId);
        console.log('Query:' + query);
        return await this.dbProvider.executeSql(query, []).then(
            (data: any) => {
                const itemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        itemData.push({
                            Item_ID: dataRow.Item_ID,
                            Item_ImagePath: dataRow.Item_ImagePath,
                            ItemCategory_ID: dataRow.ItemCategory_ID,
                            ItemName: dataRow.ItemName,
                            PurchasePrice: dataRow.PurchasePrice,
                            SellingPrice: dataRow.SellingPrice,
                            CurrentStock: dataRow.CurrentStock,
                            TaxAmount: dataRow.TaxAmount
                        });
                    }
                }
                return itemData;
            }, err => {
                console.log('Error: ', err);
                return err;
            });
    }
    // Get all the items details from the database
    async  getAllItemData() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT Item_ID,Item_ImagePath,ItemCategory_ID,ItemName,PurchasePrice,SellingPrice,CurrentStock,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item  where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
        return await this.dbProvider.executeSql(query, []).then(
            (data: any) => {
                const itemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        itemData.push({
                            Item_ID: dataRow.Item_ID,
                            Item_ImagePath: dataRow.Item_ImagePath,
                            ItemCategory_ID: dataRow.ItemCategory_ID,
                            ItemName: dataRow.ItemName,
                            PurchasePrice: dataRow.PurchasePrice,
                            SellingPrice: dataRow.SellingPrice,
                            CurrentStock: dataRow.CurrentStock,
                            TaxAmount: dataRow.TaxAmount
                        });
                    }
                }
                return itemData;
            }, err => {
                console.log('Error: ', err);
                return err;
            });
    }

    async  getInventoryReportSortByColumn(sortColumn, sortDirection) {
        // tslint:disable-next-line:max-line-length
        const  query = 'SELECT ItemName,PurchasePrice,SellingPrice,CurrentStock,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item  where IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection}';
        return await this.dbProvider.executeSql(query, []).then(
            (data: any ) => {
                const itemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        itemData.push({
                            ItemName: dataRow.ItemName,
                            PurchasePrice: dataRow.PurchasePrice,
                            SellingPrice: dataRow.SellingPrice,
                            CurrentStock: dataRow.CurrentStock,
                            TaxAmount: dataRow.TaxAmount
                        });
                    }
                }
                return itemData;
            }, err => {
                console.log('Error: ', err);
                return err;
            });
        }

    async   getInventoryReportSortColumnWithCategory(CategoryId, sortColumn, sortDirection) {
       // tslint:disable-next-line:max-line-length
            const query = 'SELECT ItemName,PurchasePrice,SellingPrice,CurrentStock,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item  where ItemCategory_ID In (?) AND IsActivate="1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection}';
            return await this.dbProvider.executeSql(query, [CategoryId]).then(
                (data: any) => {
                    const  itemData = [];
                    if (data && data.length > 0) {
                        for (const dataRow of data) {
                            itemData.push({
                                ItemName: dataRow.ItemName,
                                PurchasePrice: dataRow.PurchasePrice,
                                SellingPrice: dataRow.SellingPrice,
                                CurrentStock: dataRow.CurrentStock,
                                TaxAmount: dataRow.TaxAmount
                            });
                        }
                    }
                    return itemData;
                }, err => {
                    console.log('Error: ', err);
                    return err;
                });
            }

    // Get all the items details from the database
    async  getAllItemDataForLowStockSummaryReport() {
    // tslint:disable-next-line:max-line-length
    const query = 'SELECT I.Item_ID,I.Item_ImagePath,I.ItemCategory_ID, IC.ItemCategory_Name,I.ItemName,I.PurchasePrice,I.SellingPrice,I.CurrentStock,I.IsMaintainStock,I.MinStockNotification,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item I LEFT JOIN ItemCategory IC ON I.ItemCategory_ID = IC.ItemCategoryID  where I.IsMaintainStock="1" AND I.CurrentStock <= I.MinStockNotification AND I.IsActivate="1" AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
    return await this.dbProvider.executeSql(query, []).then(
        (data: any) => {
            const itemData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    itemData.push({
                        Item_ID: dataRow.Item_ID,
                        Item_ImagePath: dataRow.Item_ImagePath,
                        ItemCategory_ID: dataRow.ItemCategory_ID,
                        ItemName: dataRow.ItemName,
                        PurchasePrice: dataRow.PurchasePrice,
                        SellingPrice: dataRow.SellingPrice,
                        CurrentStock: dataRow.CurrentStock,
                        TaxAmount: dataRow.TaxAmount,
                        IsMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        ItemCategory_Name: dataRow.ItemCategory_Name
                    });
                }
            }
            return itemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
}

    // Item Details from the database
    async  getItemDataForLowStockSummaryReport(CategoryId) {
     if (0 === CategoryId) {
         CategoryId = this.allCategoryID.join(',');
      }
     console.log(CategoryId);
    // tslint:disable-next-line:max-line-length
     let query = 'SELECT I.Item_ID,I.Item_ImagePath,I.ItemCategory_ID, IC.ItemCategory_Name,I.ItemName,I.PurchasePrice,I.SellingPrice,I.CurrentStock,I.IsMaintainStock,I.MinStockNotification,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item I LEFT JOIN ItemCategory IC ON I.ItemCategory_ID = IC.ItemCategoryID  Where I.ItemCategory_ID In (?) AND I.IsMaintainStock="1" AND I.CurrentStock <= I.MinStockNotification AND I.IsActivate="1" AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")';
     query = query.replace('?', CategoryId);
     console.log('Query:' + query);
     return await this.dbProvider.executeSql(query, []).then(
        (data: any) => {
            const itemData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    itemData.push({
                        Item_ID: dataRow.Item_ID,
                        Item_ImagePath: dataRow.Item_ImagePath,
                        ItemCategory_ID: dataRow.ItemCategory_ID,
                        ItemName: dataRow.ItemName,
                        PurchasePrice: dataRow.PurchasePrice,
                        SellingPrice: dataRow.SellingPrice,
                        CurrentStock: dataRow.CurrentStock,
                        TaxAmount: dataRow.TaxAmount,
                        IsMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        ItemCategory_Name: dataRow.ItemCategory_Name
                    });
                }
            }
            return itemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
}
// FOR Sorting  Low Stock Summary report with given Sort Column And Sort Direction
async  getLowStockSummaryReportSortByColumn(sortColumn, sortDirection) {
    // tslint:disable-next-line:max-line-length
    const query = 'SELECT I.Item_ID,I.Item_ImagePath,I.ItemCategory_ID, IC.ItemCategory_Name,I.ItemName,I.PurchasePrice,I.SellingPrice,I.CurrentStock,I.IsMaintainStock,I.MinStockNotification,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)  ) as TaxAmount from Item I LEFT JOIN ItemCategory IC ON I.ItemCategory_ID = IC.ItemCategoryID where I.IsMaintainStock="1" AND I.CurrentStock <= I.MinStockNotification AND I.IsActivate="1" AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection}';
    return await this.dbProvider.executeSql(query, []).then(
        (data: any) => {
            const  itemData = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    itemData.push({
                        Item_ID: dataRow.Item_ID,
                        Item_ImagePath: dataRow.Item_ImagePath,
                        ItemCategory_ID: dataRow.ItemCategory_ID,
                        ItemName: dataRow.ItemName,
                        PurchasePrice: dataRow.PurchasePrice,
                        SellingPrice: dataRow.SellingPrice,
                        CurrentStock: dataRow.CurrentStock,
                        TaxAmount: dataRow.TaxAmount,
                        IsMaintainStock: dataRow.IsMaintainStock,
                        MinStockNotification: dataRow.MinStockNotification,
                        ItemCategory_Name: dataRow.ItemCategory_Name
                    });
                }
            }
            return itemData;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
   // For Sorting Column with the Given Category
   async getLowStockSummaryReportSortColumnWithCategory(CategoryId, sortColumn, sortDirection) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT I.Item_ID,I.Item_ImagePath,I.ItemCategory_ID, IC.ItemCategory_Name,I.ItemName,I.PurchasePrice,I.SellingPrice,I.CurrentStock,I.IsMaintainStock,I.MinStockNotification,(coalesce(TaxSlab1Amt,0) + coalesce(TaxSlab2Amt,0)+coalesce(TaxSlab3Amt,0) + coalesce(TaxSlab4Amt,0)) as TaxAmount from Item I LEFT JOIN ItemCategory IC ON I.ItemCategory_ID = IC.ItemCategoryID  WHERE I.ItemCategory_ID In (?) AND I.IsMaintainStock="1" AND I.CurrentStock <= I.MinStockNotification AND I.IsActivate="1" AND I.BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ${sortColumn} ${sortDirection}';
        return await this.dbProvider.executeSql(query, [CategoryId]).then(
            (data: any ) => {
                const itemData = [];
                if (data && data.length > 0) {
                    for (const dataRow of data) {
                        itemData.push({
                            Item_ID: dataRow.Item_ID,
                            Item_ImagePath: dataRow.Item_ImagePath,
                            ItemCategory_ID: dataRow.ItemCategory_ID,
                            ItemName: dataRow.ItemName,
                            PurchasePrice: dataRow.PurchasePrice,
                            SellingPrice: dataRow.SellingPrice,
                            CurrentStock: dataRow.CurrentStock,
                            TaxAmount: dataRow.TaxAmount,
                            IsMaintainStock: dataRow.IsMaintainStock,
                            MinStockNotification: dataRow.MinStockNotification,
                            ItemCategory_Name: dataRow.ItemCategory_Name
                        });
                    }
                }
                return itemData;
            }, err => {
                console.log('Error: ', err);
                return err;
            });
        }

}
