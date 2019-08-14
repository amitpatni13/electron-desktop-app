const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DigiBillDatabase {
  constructor(databaseName) {
    this.database = this.getDatabaseInstance(databaseName);
  }

  /** Getting the instance of the DB by thr Database name provided */
  getDatabaseInstance(databaseName) {
    let databasePath = path.join(__dirname, '../DB/', databaseName); // Generating the path to the database in the project directory
    console.log('Database File Path: ', databasePath);
    return new sqlite3.Database(databasePath, function (err) { // Getting the DB instance by passing the Database file path 
      if (err) console.log('Error Connecting to Database: ' + err);
      else console.log('Database connection successful!');
    });
  }

  /** To execute the database query on the active database and return the result */
  runQuery(query, params, callback) {
    if (undefined === query || null === query) return 'No Query to Execute';
    if (undefined === params || null === params) params = [];
    if (query && query.length) {
      let queryType = query.substring(0, 6).toLowerCase();
      if ('create' === queryType || 'alter' === queryType) {
        this.database.run(query); // No result is returned in case of create or alter query
        callback(true);
      } else if ('select' === queryType) {
        this.database.all(query, params, (err, rows) => {
          if (err) {
            console.log("Unable to get Data from Table. Error: ", err);
            callback(err.message);
          } else {
            callback(rows); // An JSON array of rows is returned
          }
        });
      } else if ('insert' === queryType || 'update' === queryType || 'delete' === queryType) {
        this.database.run(query, params, (err, result) => {
          if (err) {
            console.log("Unable to Modify Table Row. Error: ", err);
            callback(err.message);
          } else {
            callback(result);
          };
        });
      } else {
        let data = [];
        console.log('Incorrect Query');
        callback(data);
      }
    }
  }

  /** To execute the database query on the database name provided and return the result */
  runMasterDBQuery(databaseName, query, params, callback) {
    let database = this.getDatabaseInstance(databaseName);
    if (undefined === query || null === query) return 'No Query to Execute';
    if (undefined === params || null === params) params = [];
    if (query && query.length) {
      let queryType = query.substring(0, 6).toLowerCase();
      if ('create' === queryType || 'alter' === queryType || 'drop' === queryType) {
        database.run(query); // No result is returned in case of create or alter query
        callback(true);
      } else if ('select' === queryType) {
        database.all(query, params, (err, rows) => {
          if (err) {
            console.log("Unable to get Data from Table. Error: ", err);
            callback(err.message);
          } else {
            callback(rows); // An JSON array of rows is returned
          }
        });
      } else if ('insert' === queryType || 'update' === queryType || 'delete' === queryType) {
        database.run(query, params, (err, result) => {
          if (err) {
            console.log("Unable to Modify Table Row. Error: ", err);
            callback(err.message);
          } else {
            callback(result);
          };
        });
      } else {
        let data = [];
        console.log('Incorrect Query');
        callback(data);
      }
    }
  }

  /** To populate the database or execute queries in bulk and return the callback once completed */
  fillDatabase(databaseName, queries, callback) {
    let database = this.getDatabaseInstance(databaseName);
    database.serialize(() => {
      for (let query of queries) {
        query = query.trim();
        if (query && query.length) {
          if ('insert' === query.substring(0, 6).toLowerCase() || 'update' === query.substring(0, 6).toLowerCase() || 'delete' === query.substring(0, 6).toLowerCase()) {
            database.run(query, [], (err) => {
              if (err) {
                console.log("Unable to Insert Row into Table. Error: " + err);
                if (queries.length - 1 === queries.indexOf(query)) callback(err.message);
              } else {
                if (queries.length - 1 === queries.indexOf(query)) callback("success");
              };
            });
          } else {
            database.run(query);
            if (queries.length - 1 === queries.indexOf(query)) callback("success");
          }
        } else {
          console.log(`Empty Data`);
          if (queries.length - 1 === queries.indexOf(query)) callback("success");
        }
      }
    });
  }

  /** To close the current active database before exiting the app */
  closeDatabase() {
    this.database.close(function (err) {
      if (err) console.log('Error closing Database: ' + err);
      else console.log('Database closed successfully!');
    });
  }

  /** To close the database for the DB Name provided before exiting the app */
  closeMasterDatabase(databaseName) {
    let database = this.getDatabaseInstance(databaseName);
    database.close(function (err) {
      if (err) console.log('Error closing Database: ' + err);
      else console.log('Database closed successfully!');
    });
  }
}
module.exports = DigiBillDatabase
