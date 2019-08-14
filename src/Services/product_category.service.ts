import { Injectable } from '@angular/core';
import { IItemCategory } from '../Model/item.Model';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ConstantMessages } from '../Constants/constant';
import { TransactionDataService } from './transactionDataService';

@Injectable()
export class ProductCategory {

    // tslint:disable-next-line:max-line-length
    constructor(private dbProvider: DatabaseProvider, public TransactionData: TransactionDataService, public logService: ErrorLogService) { }

    // To add a new Category to Item Category Table in DB
    async addItemCategory(category: IItemCategory) {
        // tslint:disable-next-line:max-line-length
        const data = [category.ItemCategory_Name, category.ItemCategory_Desc, category.ItemCategory_ImagePath, category.ItemCategory_ImageString, category.ItemCategory_ImageCss];
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('INSERT INTO ItemCategory ("ItemCategory_Name", "ItemCategory_Desc", "ItemCategory_ImagePath","ItemCategory_ImageString","ItemCategory_ImageCss","IsActivate","BusinessID") VALUES (?, ?, ?, ?, ?, "1", (SELECT BusinessID FROM Business WHERE IsActive = "1"))', data).then(dataRow => {
            const TodaysDate = new Date().getTime();
            this.TransactionData.UpdateAnalyticsData(TodaysDate, ConstantMessages.TransactionDateAnalytics.CATEGORY, false);
            this.TransactionData.UpdateAnalyticsDataForDay(ConstantMessages.TransactionDateAnalyticsForDay.CATEGORY, 1);
            return dataRow;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To update the specific item category by id while editing the Category...
    async setItemCategoriesById(category: IItemCategory) {
        // tslint:disable-next-line:max-line-length
        const query = 'Update  ItemCategory Set ItemCategory_Name= ?, ItemCategory_Desc = ?, ItemCategory_ImagePath = ?,ItemCategory_ImageString = ?, categoryUpdated="1" WHERE ItemCategoryID = ? ';
        // tslint:disable-next-line:max-line-length
        const data = [category.ItemCategory_Name, category.ItemCategory_Desc, category.ItemCategory_ImagePath, category.ItemCategory_ImageString, category.ItemCategoryID];
        return await this.dbProvider.executeSql(query, data).then(dataRow => {
            return dataRow;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To fetch all the category details from Item Category Table in DB
    async getItemCategories() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT ItemCategoryID,ItemCategory_Name,ItemCategory_Desc,ItemCategory_ImagePath,ItemCategory_ImageString,ItemCategory_ImageCss FROM ItemCategory where IsActivate="1" AND (ItemCategoryID = "1" OR BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1"))', []).then((data: any) => {
            const itemCategories: IItemCategory[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    itemCategories.push({
                        ItemCategoryID: dataRow.ItemCategoryID,
                        ItemCategory_Name: dataRow.ItemCategory_Name,
                        ItemCategory_Desc: dataRow.ItemCategory_Desc,
                        ItemCategory_ImagePath: dataRow.ItemCategory_ImagePath,
                        ItemCategory_ImageString: dataRow.ItemCategory_ImageString,
                        ItemCategory_ImageCss: dataRow.ItemCategory_ImageCss
                    });
                }
            }
            return itemCategories;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To fetch the category details by referring its id ...
    async getItemCategoriesById(id) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT ItemCategory_Name,ItemCategory_ImagePath,ItemCategory_Desc,ItemCategory_ImageString,ItemCategory_ImageCss,IsActivate FROM ItemCategory WHERE ItemCategoryID=?', [id]).then((data: any) => {
            const itemCategory = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    itemCategory.push({
                        ItemCategory_Name: dataRow.ItemCategory_Name,
                        ItemCategory_ImagePath: dataRow.ItemCategory_ImagePath,
                        ItemCategory_Desc: dataRow.ItemCategory_Desc,
                        ItemCategory_ImageString: dataRow.ItemCategory_ImageString,
                        ItemCategory_ImageCss: dataRow.ItemCategory_ImageCss,
                        isActive: dataRow.IsActivate
                    });
                }
            }
            return itemCategory;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
     // To delete the Category from database by passing the category id.
     async DeleteCategory(CategoryId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('update ItemCategory SET IsActivate="0", categoryUpdated = "1" where ItemCategoryID=?', [CategoryId]).then((data) => {
            console.log('Category Deleted successfully');
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

     // To restore the deleted category from database by passing the category id.
     async restoreDeletedCategory(CategoryId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('update ItemCategory SET IsActivate=\'1\', categoryUpdated = \'1\' where ItemCategoryID=?', [CategoryId]).then((data) => {
            console.log('Category restored successfully');
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }
}
