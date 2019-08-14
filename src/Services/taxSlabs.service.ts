import { Injectable } from '@angular/core';
import { ITaxSlabs } from '../Model/taxSlabs.model';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class TaxSlabs {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) {}

    // To add a new Tax Slab into the TaxSlabs Table in DB
    addTaxSlabs(taxSlabName, taxSlabValue) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('INSERT INTO TaxSlabs ("TaxSlabName", "TaxSlabValue", "CreatedOn", "BusinessID") VALUES (?, ?, DATETIME("now", "localtime"), (SELECT BusinessID FROM Business WHERE IsActive = "1"))', [taxSlabName, taxSlabValue]).then(data => {
            return data;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To get all the Tax Slabs from the TaxSlabs Table in DB
    getTaxSlabs() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('SELECT TaxSlabID, TaxSlabName, TaxSlabValue, CreatedOn FROM TaxSlabs WHERE TaxSlabID <= 16 OR BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")', []).then(async (data: any) => {
            const taxSlabs: ITaxSlabs[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    taxSlabs.push({
                        TaxSlabID: dataRow.TaxSlabID,
                        TaxSlabName: dataRow.TaxSlabName,
                        TaxSlabValue: dataRow.TaxSlabValue,
                        CreatedOn: dataRow.CreatedOn
                    });
                }
            }
            return await taxSlabs;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
}
