import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IRecentActivity } from '../Model/recentActivity.model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class RecentActivities {

    constructor(private dbProvider: DatabaseProvider, public logService: ErrorLogService) { }

    // To Insert the activity into the DB
    async addRecentActivity(activity: IRecentActivity) {
        // Checking if any of the activity is undefined or null
        // tslint:disable-next-line:max-line-length
        if (undefined === activity.activityMessage || null === activity.activityMessage || undefined === activity.activityIcon || null === activity.activityIcon) {
            console.log('Activity data not received! Aborting activity record to Database');
            // tslint:disable-next-line:max-line-length
            this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ADD_RECENT_ACTIVITIES_FAILED, ' ;SRC - Service Class:RecentActivities method:addRecentActivity', 'Error: Incorrect Activity Data');
            return; // Returning from method since no data is received
        }
        if (undefined === activity.activityParam1 || null === activity.activityParam1) { activity.activityParam1 = ''; }
        if (undefined === activity.activityParamValue1 || null === activity.activityParamValue1) { activity.activityParamValue1 = ''; }
        if (undefined === activity.activityParam2 || null === activity.activityParam2) { activity.activityParam2 = ''; }
        if (undefined === activity.activityParamValue2 || null === activity.activityParamValue2) { activity.activityParamValue2 = ''; }
        if (undefined === activity.activityParam3 || null === activity.activityParam3) { activity.activityParam3 = ''; }
        if (undefined === activity.activityParamValue3 || null === activity.activityParamValue3) { activity.activityParamValue3 = ''; }
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO RecentActivity ("ActivityMessage", "ActivityComponentPage","ActivityIcon", "ActivityParam1", "ActivityParamValue1", "ActivityParam2", "ActivityParamValue2", "ActivityParam3", "ActivityParamValue3", "ActivityTimeStamp", "BusinessID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME("now", "localtime"), (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        // tslint:disable-next-line:max-line-length
        const data = [activity.activityMessage, activity.activityComponentPage, activity.activityIcon, activity.activityParam1, activity.activityParamValue1, activity.activityParam2, activity.activityParamValue2, activity.activityParam3, activity.activityParamValue3];
        return await this.dbProvider.executeSql(query, data).then(dataRow => {
            return dataRow;
        }, err => {
            // tslint:disable-next-line:max-line-length
            console.log('Error', err);
            return err;
        });
    }

    // To get the all recent activities for a particular duration
    getRecentActivitiesByDate(startDate, endDate) {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ActivityID, ActivityMessage, ActivityComponentPage, ActivityIcon, ActivityTimeStamp, ActivityParam1, ActivityParamValue1, ActivityParam2, ActivityParamValue2, ActivityParam3, ActivityParamValue3 FROM RecentActivity WHERE ActivityTimeStamp >= date(?) AND ActivityTimeStamp < date(?) AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = \'1\') ORDER BY ActivityTimeStamp DESC';
        return this.dbProvider.executeSql(query, [startDate, endDate]).then(async (data: any) => {
            const recentActivities: IRecentActivity[] = [];
            console.log('ActivityService: Activities Received from DB are... '); console.log(data);
            if (data && data.length > 0) {
                for (const dataRow of data) { // Index 0 represents Row 1 of the retrieved table
                    // Checking if any of the activity data is undefined or null
                    const message = dataRow.ActivityMessage;
                    const icon = dataRow.ActivityIcon;
                    if (undefined === message || null === message || undefined === icon || null === icon) {
                        console.log('Activity data not available! Not displaying the activity', dataRow);
                        continue; // Continuing to the next activity since no data is available for the present activity
                    }
                    recentActivities.push({
                        activityId: dataRow.ActivityID,
                        activityMessage: dataRow.ActivityMessage,
                        activityComponentPage: dataRow.ActivityComponentPage,
                        activityIcon: dataRow.ActivityIcon,
                        activityTimestamp: dataRow.ActivityTimeStamp,
                        activityParam1: dataRow.ActivityParam1,
                        activityParamValue1: dataRow.ActivityParamValue1,
                        activityParam2: dataRow.ActivityParam2,
                        activityParamValue2: dataRow.ActivityParamValue2,
                        activityParam3: dataRow.ActivityParam3,
                        activityParamValue3: dataRow.ActivityParamValue3
                    });
                }
            }
            await recentActivities;
            return recentActivities;
        }, (err) => {
        console.log('Error', err);
        return err;
        });
    }

    // To get the all recent activities for a particular duration
    getAllActivities() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT ActivityID, ActivityMessage, ActivityComponentPage, ActivityIcon, ActivityTimeStamp, ActivityParam1, ActivityParamValue1, ActivityParam2, ActivityParamValue2, ActivityParam3, ActivityParamValue3 FROM RecentActivity WHERE BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") ORDER BY ActivityTimeStamp DESC';
        return this.dbProvider.executeSql(query, []).then(async (data: any) => {
            const recentActivities: IRecentActivity[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) { // Index 0 represents Row 1 of the retrieved table
                    // Checking if any of the activity data is undefined or null
                    const message = dataRow.ActivityMessage;
                    const icon = dataRow.ActivityIcon;
                    if (undefined === message || null === message || undefined === icon || null === icon) {
                        console.log('Activity data not available! Not displaying the activity', dataRow);
                        continue; // Continuing to the next activity since no data is available for the present activity
                    }
                    recentActivities.push({
                        activityId: dataRow.ActivityID,
                        activityMessage: dataRow.ActivityMessage,
                        activityComponentPage: dataRow.ActivityComponentPage,
                        activityIcon: dataRow.ActivityIcon,
                        activityTimestamp: dataRow.ActivityTimeStamp,
                        activityParam1: dataRow.ActivityParam1,
                        activityParamValue1: dataRow.ActivityParamValue1,
                        activityParam2: dataRow.ActivityParam2,
                        activityParamValue2: dataRow.ActivityParamValue2,
                        activityParam3: dataRow.ActivityParam3,
                        activityParamValue3: dataRow.ActivityParamValue3
                    });
                }
            }
            await recentActivities;
            return recentActivities;
        }, (err) => {
            console.log('Error', err);
            return [];
        });
    }
 }
