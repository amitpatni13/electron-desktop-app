const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

const Database = require('./database');
const db = new Database('DigiBillRetail.db');

// require('electron-reload')(path.join(__dirname, '../index.html'), {
//   electron: path.join(__dirname, '../node_modules/.bin/electron-rebuild')
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1096, height: 768, minWidth: 1096, minHeight: 768, show: false })

  // and load the index.html of the app
  mainWindow.loadFile('dist/digibill-desktop/index.html');

  mainWindow.once("ready-to-show", () => { mainWindow.show() })

  // Open the DevTools.
  if (process.env.NODE_ENV !== 'production') mainWindow.webContents.openDevTools();

  // console.log('__DirName:  ', path.join(__dirname, '../index.html'));
  ipcMain.on('DatabaseInstance', function (event, databaseName) {
    try {
      let database = db.getDatabaseInstance(databaseName);
      event.returnValue = database;
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('ExecuteDatabaseQuery', async (event, query, params) => { // To execute queries and return the result
    try {
      db.runQuery(query, params, (result) => { 
        event.returnValue = result;
      });
    } catch (err) {
      throw err;
    }
  });
  
  ipcMain.on('PopulateDatabase', async (event, databaseName,  queries) => { // To fill the db on app's first launch 
    try {
      db.fillDatabase(databaseName, queries, (result) => { 
        event.returnValue = result;
      });
    } catch (err) {
      throw err;
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    db.closeDatabase();
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})