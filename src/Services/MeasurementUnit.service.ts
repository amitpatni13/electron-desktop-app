import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { IMeasurementUnit } from '../Model/measurementUnit.model';

@Injectable()
export class MeasurementUnitService {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) {}

    // To add a new Measurement Unit into the database
    addMeasurementUnit(MeasurementModelData) {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('INSERT INTO MeasurementUnit ("MeasurementName","MeasurementCode", "Ratio","RatioID",GroupID, "CreatedOn", "BusinessID") VALUES (?,?, ?,?,?, DATETIME("now", "localtime"), (SELECT BusinessID FROM Business WHERE IsActive = "1"))', [MeasurementModelData.MeasurementName, MeasurementModelData.MeasurementCode, MeasurementModelData.Ratio, MeasurementModelData.RatioID, MeasurementModelData.GroupID]).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

     // To delete a new Measurement Unit into the database
     DeleteMeasurementUnit(MeasurementID) {
        return this.dbProvider.executeSql('delete from MeasurementUnit WHERE MeasurementID = ?', [MeasurementID]).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    // To get all the MeasurementUnit from the measurement unit Table
    getMeasurementUnit() {
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('SELECT MeasurementID,MeasurementCode,Ratio,RatioID, MeasurementName, GroupID, CreatedOn FROM MeasurementUnit WHERE  BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") order by RatioID DESC', []).then(async (data: any) => {
            const taxSlabs: IMeasurementUnit[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    taxSlabs.push({
                        MeasurementID: dataRow.MeasurementID,
                        MeasurementName: dataRow.MeasurementName,
                        MeasurementCode: dataRow.MeasurementCode,
                        GroupID: dataRow.GroupID,
                        CreatedOn: dataRow.CreatedOn,
                        Ratio: dataRow.Ratio,
                        RatioID: dataRow.RatioID
                    });
                }
            }
            return await taxSlabs;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
