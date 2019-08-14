import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DBManager } from '../../DBManager/dbmanager';
import { map } from 'rxjs/operators';
import { ConstMessages } from '../../Constants/ErrorMessages';
import { ErrorLogService } from '../../Services/errorLog.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { ConstantMessages } from 'src/Constants/constant';

@Injectable()
export class DatabaseProvider {
  private database;
  // tslint:disable-next-line:variable-name
  private sqlScriptPath = 'assets/dbInitialize.sql';
  // tslint:disable-next-line:variable-name
  private sqlScript: string;
  // Global Variables

  // tslint:disable-next-line:max-line-length
  constructor(private dbManager: DBManager, private http: Http, public logService: ErrorLogService, private httpClient: HttpClient) {
    dbManager.getDatabaseContext().then((response) => {
      console.log('Database.ts: Response Rcvd is...'); console.log(response);
      this.database = response;
      if (this.database.open) { this.fillDatabase(ConstantMessages.DEFAULT_DATABASE.NAME); }
    });
  }

  /** Populate the database with tables and default data */
  async fillDatabase(dbName: string) {
    let isFilled = false;
    await this.verifyTables((result: string) => {
      if ('filled' === result) { isFilled = true; }
      if (!isFilled) { // If DB is not populated...
        console.log('calling fill database');
        this.http.get(this.sqlScriptPath).pipe(map((responseScript: Response) => responseScript.text())).subscribe((sqlScript) => {
          this.sqlScript = sqlScript;
          const sqlQueriesCopy = this.sqlScript.split(');');
          const sqlQueries: string[] = [];
          let hsnQuery = '';
          for (const query of sqlQueriesCopy) {
            const searchQuery = query.replace(/[\r\n]+/g, '');
            if (searchQuery && searchQuery.length) {
              if ('INSERT INTO HSN_SAC' === searchQuery.substring(0, 19) || ('insert' !== searchQuery.substring(0, 6).toLowerCase()
                && 'update' !== searchQuery.substring(0, 6).toLowerCase() && 'delete' !== searchQuery.substring(0, 6).toLowerCase() &&
                'alter' !== searchQuery.substring(0, 5).toLowerCase() && 'create' !== searchQuery.substring(0, 6).toLowerCase() &&
                'drop' !== searchQuery.substring(0, 4).toLowerCase() && 'select' !== searchQuery.substring(0, 6).toLowerCase())) {
                hsnQuery += query.replace(/[\r\n]+/g, ' ') + '); ';
              } else {
                sqlQueries.push(query.replace(/[\r\n]+/g, ' ') + ')');
              }
            }
          }
          if (hsnQuery.length) {
            sqlQueries.push(hsnQuery.substring(0, hsnQuery.lastIndexOf(';')));
          }
          console.log('HSN Query: ', hsnQuery.substring(0, hsnQuery.lastIndexOf(';')));
          this.dbManager.fillDatabase(dbName, sqlQueries, () => {
            console.log('Database filled successfully');
          });
        });
      }
    });
  }

  /** Execute the query from the DBManager */
  executeSql(query, dataParam) {
    // return new Promise((resolve, reject) => {
    //   return this.dbManager.executeQuery(query, dataParam).then((data) => {
    //     console.log('DBProvider: Data Received from Query: ', data);
    //     return resolve(data);
    //   });
    // });
    return this.dbManager.executeQuery(query, dataParam);
  }

  // To restore the existing copy of the database from the SQL file
  async convertSQLToDB(dbName: string, sql: string, callback) {
    this.emptyDatabaseTables(dbName, (result) => {
      if ('success' === String(result)) {
        this.importSQLScriptToDB(dbName, sql, (response) => { callback(response); }); // Returning the response
      } else { callback(null); }
    });
  }

  async convertDBToSQL() {
    return await null;
  }

  // To update over the already filled database of previous version
  async updateDatabase(dbName: string, responseFromServer) {
    console.log('calling update database');
    for (const data of responseFromServer) {
      const sqlScriptPath = data.fileURL;
      await this.http.get(sqlScriptPath).pipe(map((responseScript: Response) => responseScript.text())).subscribe(sqlScript => {
        const sqlScripts = sqlScript;
        console.log(sqlScripts);
        this.dbManager.fillDatabase(dbName, sqlScripts.split('\n'), (dataRow) => {
          console.log('Database updated successfully ', dataRow);
        });
      });
    }
  }


  // get all the inserted tables from the database
  getDataBaseTables() {
    return this.executeSql('SELECT * FROM sqlite_master WHERE type="table"', []).then((data: any) => {
      const tables = [];
      if (data && data.length > 0) {
        for (const dataRow of data) {
          tables.push({
            type: dataRow.type,
            name: dataRow.name,
            tbl_name: dataRow.tbl_name,
            rootpage: dataRow.rootpage,
            sql: dataRow.sql,

          });
        }
      }
      return tables;
    }, err => {
      console.log('error ', err);
      return [];

    });
  }

  // get table scheme from the database
  getDataBaseTableSchema(tableName) {
    return this.executeSql(`PRAGMA table_info(${tableName})`, []).then((data: any) => {
      const columns = [];
      if (data && data.length > 0) {
        for (const dataRow of data) {
          columns.push(dataRow.name);
        }
      }
      return columns;
    }, err => {
      console.log('error ', err);
      return [];
    });
  }

  // alter the table if the columns are not matched
  async AlterTable(tableName, ColumneName, DataType) {
    return await this.executeSql(`ALTER TABLE ${tableName} ADD COLUMN ${ColumneName} ${DataType}`, []).then((AlterUpdated) => {
      console.log(AlterUpdated);
      return AlterUpdated;
    }, err => {
      console.log('error ', err);
      return [];
    });
  }

  // update the table if the columns are not matched
  async UpdateTable(tableName, ColumneName, ColumnValue, ConditionalColumn, ConditionalValue, Condition) {
    let sql = `Update ${tableName} set ${ColumneName} = ${ColumnValue}`;
    // tslint:disable-next-line:max-line-length
    if (ConditionalColumn.length > 0) { sql = `Update ${tableName} set ${ColumneName} = ${ColumnValue} where  ${ConditionalColumn} ${Condition} ${ConditionalValue} `; }
    return await this.executeSql(sql, []).then((UpdateTable) => {
      console.log(UpdateTable);
      return UpdateTable;
    }, err => {
      console.log('error ', err);
      return [];
    });
  }

  // insert the new table if it is not present in the database
  InsertNewTable(tableName, Columns) {
    let data: any = ' (';
    let query = '';
    for (const item in Columns) {
      if (Number(item) !== Columns.length - 1) {
        // if it is not the last column then  add the semi column after each column name
        data += '\'' + Columns[item].ColumnName + '\'' + ' ' + Columns[item].type + ',';
      } else {
        // if it is the last column then do not add the semi column
        data += '\'' + Columns[item].ColumnName + '\'' + ' ' + Columns[item].type + ')';
      }

    }
    // create the query for new table to be inserted in the database
    query = 'create table ' + tableName + data;
    console.log('create table ' + tableName + data);
    return this.executeSql(query, []).then((TableInserted) => {
      console.log(TableInserted);
      return TableInserted;
    }, err => {
      console.log(err);
      console.log('error ', err);
      return [];
    });
  }

  // To get the Business Response from the server
  async getUpdatedDataBaseVersion(AppVersion) {
    let url = ''; // The url where the request will be send and the callback respond will get
    if (isDevMode()) { url = ConstMessages.DB_INCREMENTAL.API_URL_DEV; } else { url = ConstMessages.DB_INCREMENTAL.API_URL; }
    let httpParams = new HttpParams();
    // parameter to be passed with the URL
    httpParams = httpParams.append('AppVersion', AppVersion);
    return await this.httpClient.get(url, { params: httpParams }).toPromise().then((response) => {
      // check for the response from the server
      console.log('Response received form Server: ', response);
      return response;
    }, (err) => {
      console.log('Error in getting Data from Server: ', err);
      console.log('error ', err);
      return [];
    });
  }

  // To check whether the tables exists in the DB or not
  verifyTables(callback) {
    const query = 'SELECT * FROM sqlite_master WHERE type="table"';
    this.executeSql(query, []).then((data: any) => {
      console.log('verify the tables', data.rows);
      if (data && data.length > 0) { callback('filled'); } else { callback('empty'); }
    }, err => {
      console.log('error ', err);
      callback('error');
    });
  }

  // To clean all the database tables before restore
  emptyDatabaseTables(dbName: string, callback) {
    this.getDataBaseTables().then((tables) => { // To get all the table names
      let sqlScript = '';
      for (const table of tables) {
        // tslint:disable-next-line:max-line-length
        if ('Business' === table.tbl_name || 'InvoiceConfiguration' === table.tbl_name || 'HSN_SAC' === table.tbl_name || 'BackupRestore' === table.tbl_name) { continue; } else {
          sqlScript += `DELETE FROM ${table.tbl_name};` + ' ';
          sqlScript += `DELETE FROM sqlite_sequence WHERE name = '${table.tbl_name}';` + ' ';
        }
      }
      this.dbManager.getDatabaseContext().then((response) => {
        this.database = response;
        this.dbManager.fillDatabase(dbName, sqlScript.split('\n'), (success) => { // Calling all queries at once
          if (success) {
            callback('success');
          } else {
            callback('failed');
          }
        });
      }, (error) => {
        console.log('Error opening database:' + error);
        callback('failed');
      });
    }).catch((error) => {
      console.log('error ', error);
      callback('failed');
    });

  }


  // custom quantity column verify
  customQuantity(callback) {
    const query = 'PRAGMA table_info(Item)';
    this.executeSql(query, []).then((data: any) => {
      if (data && data.length > 0) {
        for (const dataRow of data) {
          if (dataRow.name === 'customQuantityFlag') {
            callback(false);
            return;
          }
        }
      }
      callback(true);
    }, err => {
      console.log('error ', err);
      callback(true);
    });
  }


  // Database Changes
  async DatabaseChanges(dbName: string, Query) {
    return await this.dbManager.fillDatabase(dbName, Query.split('\n'), (data) => {
      console.log('Database Changes Updated ', data);
    });
  }

  importSQLScriptToDB(dbName: string, sql: string, callback) {
    this.dbManager.fillDatabase(dbName, sql.split('\n'), (response) => {
      if (response) { callback(response); } else { callback(null); }
    });
  }
}




















