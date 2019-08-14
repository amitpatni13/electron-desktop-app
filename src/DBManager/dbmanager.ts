import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConstantMessages } from 'src/Constants/constant';

@Injectable()
export class DBManager {
    private database; // To store an instance of the DB
    ipcRenderer: any;

    constructor(private electron: ElectronService) { }

    /** Execute SQL queries on the database */
    async getDatabaseInstance(databaseName: string) {
        return await of(
            this.electron.ipcRenderer.sendSync('DatabaseInstance', databaseName)
        ).pipe(catchError((error: any) => Observable.throw(error.json)));
    }

    /** Execute SQL query on the database */
    async executeQueryInJs(query: string, params: (number | string)[]) {
        return await of(
            this.electron.ipcRenderer.sendSync('ExecuteDatabaseQuery', query, params)
        ).pipe(catchError((error: any) => Observable.throw(error.json)));
    }

    /** Populate the database by performing the SQL queries serially on the database */
    async fillDatabaseInJs(databaseName: string, queries: string[]) {
        return await of(
            this.electron.ipcRenderer.sendSync('PopulateDatabase', databaseName, queries)
        ).pipe(catchError((error: any) => Observable.throw(error.json)));
    }

    /** Get Database Context */
    getDatabaseContext() {
        return new Promise((resolve, reject) => {
            this.getDatabaseInstance(ConstantMessages.DEFAULT_DATABASE.NAME).then((result) => {
                const res: any = result.source;
                this.database = JSON.parse(JSON.stringify(res.value));
                console.log('DB Instance: ', this.database);
                return resolve(this.database);
            }).catch((error) => { console.log('Error connecting to DB: ', error); });
        });
    }

    /** Execute SQL queries on the database */
    executeQuery(sqlScript: string, paramData: (string | number)[]) {
        return new Promise((resolve, reject) => {
            let data = null;
            if (!this.database) {
                this.getDatabaseContext().then(() => {
                    this.executeQueryInJs(sqlScript, paramData).then((result) => {
                        console.log('Response from query: ', result);
                        const res: any = result.source;
                        data = JSON.parse(JSON.stringify(res.value));
                        console.log('Data received: ', data);
                        return resolve(data);
                    }).catch((error) => {
                        console.log('Error connecting to DB: ', error);
                        reject(error);
                    });
                });
            } else {
                console.log('Database is Open. Executing the query...');
                this.executeQueryInJs(sqlScript, paramData).then((result) => {
                    console.log('Response from query: ', result);
                    const res: any = result.source;
                    data = JSON.parse(JSON.stringify(res.value));
                    console.log('Data received: ', data);
                    return resolve(data);
                }).catch((error) => {
                    console.log('Error connecting to DB: ', error);
                    reject(error);
                });
            }
        });
    }

    /** To populate the database or execute queries in bulk */
    fillDatabase(databaseName: string, queries: string[], callback) {
        let data = null;
        if (!this.database) {
            this.getDatabaseContext().then(() => {
                this.fillDatabaseInJs(databaseName, queries).then((result) => {
                    console.log('Response from fill database: ', result);
                    const res: any = result.source;
                    data = JSON.parse(JSON.stringify(res.value));
                    console.log('Database filled result: ', data);
                    callback(data);
                }).catch((error) => {
                    console.log('Error connecting to DB: ', error);
                    callback(error);
                });
            });
        } else {
            console.log('Database is Open. Executing the query...');
            this.fillDatabaseInJs(databaseName, queries).then((result) => {
                console.log('Response from fill database: ', result);
                const res: any = result.source;
                data = JSON.parse(JSON.stringify(res.value));
                console.log('Database filled result: ', data);
                callback(data);
            }).catch((error) => {
                console.log('Error connecting to DB: ', error);
                callback(error);
            });
        }
    }
}
