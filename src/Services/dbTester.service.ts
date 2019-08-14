import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';

@Injectable()
// tslint:disable-next-line:class-name
export class dbTester {
    constructor(private dbProvider: DatabaseProvider) {
    }

    fetchData(tableName, idcolumn, rowcount) {
      //  let data = [tableName, id_column, row_count]
        const  query = 'select * from ? order by ? desc LIMIT ? '.replace('?', tableName).replace('?', idcolumn).replace('?', rowcount);
        console.log(query);
        return this.dbProvider.executeSql(query, []).then((data: any) => {
            console.log('Data fetched from ' + tableName);
            if (data && data.length > 0) {
             // tslint:disable-next-line:prefer-for-of
             for (let i = 0; i < data.length; i++) {
                    console.log(JSON.stringify(data[i]));
                }
            }
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }
}
