import { Injectable } from '@angular/core';
// import * as XLSX from 'ts-xlsx';

@Injectable()
export class ExcelService {
  sheetNames: string[] = [];
  sheets: any;

  constructor() {
    // this.checkDirectoryPath(); // To create DigiBill & Reports folder if deleted
  }

  // Getting the data and creating XLSX sheet
  createXLSX(data: any, worksheetNames: string[]): Promise<any> {
    return new Promise((resolve) => {
      // const workbook: XLSX.IWorkBook = {
      //   SheetNames: [],
      //   Sheets: {},
      //   Props: {}
      // };
      // const worksheet = [];
      // // tslint:disable-next-line:forin
      // for (const i in data) {
      //   const worksheetData = this.sheet_from_array_of_arrays(data[i], {});
      //   worksheet.push(worksheetData);
      // }
      // /* add worksheet to workbook */
      // // tslint:disable-next-line:forin
      // for (const i in worksheetNames) {
      //   workbook.SheetNames.push(worksheetNames[i]);
      //   workbook.Sheets[worksheetNames[i]] = worksheet[i];
      // }
      // const  workbookOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
      // const xslXBlob = new Blob([this.sheetToArrayBuffer(workbookOutput)], { type: 'application/octet-stream' });
      // resolve(xslXBlob);
      return null;
    });
  }
  // get the Data Sheet Number
  dateNum(v, date1904): any {
    if (date1904) { v += 1462; }
    const epoch: any = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000);
  }
  // Number of rows and columns can be added to the excel sheet
  sheet_from_array_of_arrays(data, opts) {
    // const worksheet = {};
    // const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }; // s: start, e: end, c: column, r: row
    // for (let R = 0; R !== data.length; ++R) { // R: ROW
    //   for (let C = 0; C !== data[R].length; ++C) { // C: COL
    //     if (range.s.r > R) { range.s.r = R; }
    //     if (range.s.c > C) { range.s.c = C; }
    //     if (range.e.r < R) { range.e.r = R; }
    //     if (range.e.c < C) { range.e.c = C; }
    //     const cell: any = { v: data[R][C] };
    //     if (cell.v == null) { continue; }
    //     const cellref = XLSX.utils.encode_cell({ c: C, r: R });
           // tslint:disable-next-line:max-line-length
    //     if (typeof cell.v === 'number') { cell.t = 'n'; } else if (typeof cell.v === 'boolean') { cell.t = 'b'; } else if (cell.v instanceof Date) {
    //       cell.t = 'n';
    //       cell.v = this.dateNum(cell.v, null);
    //     } else { cell.t = 's'; }
    //     worksheet[cellref] = cell;
    //   }
    // }
    // if (range.s.c < 10000000) { worksheet['!ref'] = XLSX.utils.encode_range(range.s, range.e); }
    // return worksheet;
  }
  // convert excel to array buffer
  sheetToArrayBuffer(base64sheet) {
    const buffer = new ArrayBuffer(base64sheet.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i !== base64sheet.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = base64sheet.charCodeAt(i) & 0xFF;
    }
    return buffer;
  }

  // Create the Reports directory if it does not exists
  // checkDirectoryPath() {
  //   this.file.checkDir(this.file.externalRootDirectory, 'DigiBill').then(success => {
  //     if (success) {
  //       this.file.checkDir(this.file.externalRootDirectory + 'DigiBill', 'Reports').then(exists => {
  //         if (exists) return; // All Folders required already exists
  //         else { // Reports Folder is deleted or not exists
  //           // Adding the DigiBill/Reports folder to user's device if not exists
  //           this.file.createDir(this.file.externalRootDirectory + "DigiBill", "Reports", false).then((result) => {
  //             console.log("Reports folder created successfully!", result);
  //           });
  //         }
  //       })
  //     } else { // DigiBill Folder is deleted or not exists
  //       // Adding the DigiBill folder to user's device if it is deleted
  //       this.file.createDir(this.file.externalRootDirectory, "DigiBill", false).then(async (result) => {
  //         // Adding the Invoices and Reports Folders after the DigiBill folder is created successfully
  //         if (await result) {
  //           console.log("DigiBill folder created successfully!", result);
  //           // Adding the DigiBill/Invoices folder to user's device if not exists
  //           this.file.createDir(this.file.externalRootDirectory + "DigiBill", "Invoices", false).then((result) => {
  //             console.log("Invoices folder created successfully!", result);
  //           });
  //           // Adding the DigiBill/Reports folder to user's device if not exists
  //           this.file.createDir(this.file.externalRootDirectory + "DigiBill", "Reports", false).then((result) => {
  //             console.log("Reports folder created successfully!", result);
  //           });
  //           // Creating a logger file to store the log messages
  //           let FileStoragePath = this.file.externalRootDirectory + "DigiBill";
  //           // Creating a file with the name FILE LOGGER DATA
  //           this.file.createFile(FileStoragePath, "FileLoggerData.txt", false).then((FileRes) => {
  //             console.log("FileLoggerData File Created");
  //           }).catch(err => {
  //             console.log("FileLoggerData File Exists");
  //           });
  //         } else console.log("Unable to create DigiBill folder or the folder already exists", result);
  //       });
  //     }
  //   });
  // }
}
