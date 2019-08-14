import { Injectable } from '@angular/core';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ErrorLogService } from './errorLog.service';
import { LogIntoFirebase } from './logIntoFirebase.service';
declare var cordova: any;  // global
@Injectable()

export class HTMLToPDF {
    Customer = {
        Name: '',
        Address: '',
        state: '',
        GSTIN: '',
        Email: '',
        TaxableValue: ''
    };
    ItemData = {
        NAMELabel: '',
        NAMEData: '',
        PRICELabel: '',
        PRICEData: '',
        CGSTLabel: '',
        CGSTData: '',
        SGSTLabel: '',
        SGSTData: '',
        IGSTLabel: '',
        IGSTData: '',
        Email: '',
        TaxableValueName: '',
        TaxableValueData: ''
    };
    TotalData = {
        TotalTaxableValue1: '',
        TotalTaxableValue2: '',
        TotalTax1: '',
        TotalTax2: '',
        InvoiceTotal1: '',
        InvoiceTotal2: '',
        PlaceOfSupply: '',

    };
    totalTaxPrice = 0;
    // tslint:disable-next-line:max-line-length
    BusinessImage = `data:image/png;base64,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`;

    constructor(public logIntoFirebase: LogIntoFirebase, public logService: ErrorLogService) { }


    // To generate the Bill Page as an PDF...
    generatePDF(HTMLDATA, FileName, callback) {
        const before = Date.now();
        // Triggered when print PDF event is called
        document.addEventListener('DeviceReady', () => {
            console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');
            // Generating the pdf here
            cordova.plugins.pdf.fromData(HTMLDATA, {
                // Passing the HTML + CSS Template
                documentSize: 'A4',
                landscape: 'portrait',
                type: 'share', // We need to keep type to share for PDF to be shown on Android Native PDF Viewer
                fileName: FileName // Setting the file name when save button is clicked
            }).then((success) => {
                console.log('Success Message: ' + success);
                this.savePDF(HTMLDATA, FileName, (FileSaved) => {
                    if (FileSaved) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }).catch((err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_FETCH_FAILED, ' ;SRC - Page :htmltopdf method:generatePDF', err);

            });
        });
    }

    // To set the path of the PDF Saved to file...
    savePDF(HTMLDATA, FileName, callback) {
        // cordova.plugins.pdf.fromData(HTMLDATA, {
        //     // Passing the HTML + CSS Template
        //     documentSize: 'A4',
        //     type: 'base64' // We need to keep type to save the pdf to file
        // }).then((base64PDF) => {
        //     // We can set the file path here to store the PDF at the desired location
        //     const filePath: string = cordova.file.externalRootDirectory + 'DigiBill/Invoices';
        //     // Decoding the base64 PDF Data into a res object and passing it to blob() to be decoded
        //     this.file.checkDir(cordova.file.externalRootDirectory, 'DigiBill/Invoices').then(DirectoryExist => {
        //         if (DirectoryExist) {
        //             fetch('data:application/pdf;base64,' + base64PDF, { method: 'GET' }).then(res => res.blob()).then(async (blob) => {
        //                 // Saving the PDF at the desired file path
        //                 this.file.writeFile(filePath, FileName, blob, { replace: true }).then(res => {
        //                     console.log('pdf saved: '); console.log(res);
        //                     callback(true)
        //                 }).catch(err => {
        //                     console.log('Error Creating PDF: ' + err);
                               // tslint:disable-next-line:max-line-length
        //                     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_GENERATE_FAILED, ' ;SRC - Page :htmltopdf method:savePDF', err);
        //                 });
        //             }).catch(err => {
        //                 console.log('Error Fetching Base64 PDF Data' + err);
        //                 callback(false);
                         // tslint:disable-next-line:max-line-length
                        //  this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_FETCH_FAILED, ' ;SRC - Page :htmltopdf method:savePDF', err);
        //             });
        //         } else {
        //             callback(false)
        //             console.log('File Does Not Exist');
        //         }
        //     }).catch((exception) => { console.log(exception); callback(false) });
        // }).catch((err) => {
        // tslint:disable-next-line:max-line-length
        //     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_FETCH_FAILED, ' ;SRC - Page :htmltopdf method:generatePDF', err);
        // });
    }

    // To set the path of the PDF Saved to file...
    GetBase64Data(HTMLDATA, FileName, callback) {
        // cordova.plugins.pdf.fromData(HTMLDATA, {
        //     // Passing the HTML + CSS Template
        //     documentSize: 'A4',
        //     type: 'base64' // We need to keep type to save the pdf to file
        // }).then((base64PDF) => {
        //     // We can set the file path here to store the PDF at the desired location
        //     const filePath: string = cordova.file.externalRootDirectory + 'DigiBill/Invoices';
        //     // Decoding the base64 PDF Data into a res object and passing it to blob() to be decoded
        //     this.file.checkDir(cordova.file.externalRootDirectory, 'DigiBill/Invoices').then(DirectoryExist => {
        //         if (DirectoryExist) {
        //             fetch('data:application/pdf;base64,' + base64PDF, { method: 'GET' }).then(res => res.blob()).then(async (blob) => {
        //                 // Saving the PDF at the desired file path
        //                 this.file.writeFile(filePath, FileName, blob, { replace: true }).then(res => {
        //                     console.log('pdf saved: '); console.log(res);
        //                     this.file.readAsDataURL(filePath, FileName).then(base64String => {
        //                         callback(base64String);
        //                     });

        //                 }).catch(err => {
        //                     console.log('Error Creating PDF: ' + err);
                             // tslint:disable-next-line:max-line-length
        //                     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_GENERATE_FAILED, ' ;SRC - Page :htmltopdf method:savePDF', err);
        //                 });
        //             }).catch(err => {
        //                 console.log('Error Fetching Base64 PDF Data' + err);
        //                 callback(false)
                         // tslint:disable-next-line:max-line-length
        //                 this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_FETCH_FAILED, ' ;SRC - Page :htmltopdf method:savePDF', err);
        //             });
        //         } else {
        //             callback(false)
        //             console.log('File Does Not Exist');
        //         }
        //     }).catch((exception) => { console.log(exception); callback(false) });
        // }).catch((err) => {
        // tslint:disable-next-line:max-line-length
        //     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_PDF_FETCH_FAILED, ' ;SRC - Page :htmltopdf method:generatePDF', err);
        // });
        callback(false);
    }
    // To set the path of the PDF Saved to file...
    GetHTMLDATA(CustomerData, ProductData, CGST, SGST, IGST, TaxableValue, invoiceNumber, DateValue) {
        this.CheckCustomerData(CustomerData);
        this.CheckProductData(ProductData, CGST, SGST, IGST, TaxableValue);
        this.totalTaxPrice = (CGST + SGST + IGST).toFixed(2);
        const HTMLData = `<div class="PDFmainClass">
        <div class="HeaderRowClass">
          <div class="HeaderBillData">
            <div class="HeaderImage">
              <div>
                <img src="` + this.BusinessImage + `" class="ImageAlignemnt">
              </div>
            </div>
            <div class="HeaderInfo">
              <div class="businessTile">
                DigiPlusIT Software Pvt Ltd
              </div>
              <div class="BusinessAddressClass">
                DigiPlus IT, Office #7, 1st Floor SPIT Incubation Center Bhavan's Campus Near Azad Nagar Metro Station,
                Andheri West Mumbai, India - 400053
              </div>
              <div class="BusinessContactDetailsClass"><span><span class="labelClass">website: </span>www.digibillapp.com</span>
              </div>
              <div class="BusinessContactDetailsClass">
                <span><span class="labelClass">Email: </span>digibillapp@digiplusit.com</span>
              </div>
            </div>
          </div>
        </div>
        <div class="InvoiceTitle">TAX INVOICE</div>
        <table class="invoiceBusinessDetails">
          <tr>
            <td class="labelClass">CIN</td>
            <td class="labelDataClass">U93090MH2017PTC289444</td>
            <td class="labelClass">Invoice Serial Number</td>
            <td class="labelDataClass">` + invoiceNumber + `</td>
          </tr>
          <tr>
            <td class="labelClass">PAN No</td>
            <td class="labelDataClass">AAFCD9720J</td>
            <td class="labelClass">Invoice Date</td>
            <td class="labelDataClass">` + DateValue + `</td>
          </tr>
          <tr>
            <td class="labelClass">GSTIN</td>
            <td class="labelDataClass">27AAFCD9720J1ZE</td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <table class="invoiceBusinessDetails">
          <tr>
            <td colspan="2" class="CustomerDetailsHeader">Details of Receiver(Billed To)</td>
            <td colspan="2" class="CustomerDetailsHeader">Details of Consignee(Shipped To)</td>
          </tr>
          <tr>` + this.Customer.Name + this.Customer.Name + `
          </tr>
          <tr>` + this.Customer.Address + this.Customer.Address + `
          </tr>
          <tr>` + this.Customer.state + this.Customer.state + `
          </tr>
          <tr>` + this.Customer.GSTIN + this.Customer.GSTIN + `
          </tr>
          <tr>` + this.Customer.Email + this.Customer.Email + `
          </tr>
        </table>
        <table class="invoiceItemDetails">
          <tr>
          ` + this.ItemData.NAMELabel + `
            <td class="labelClass">HSN</td>
            <td class="labelClass">Quantity</td>
            ` + this.ItemData.PRICELabel + `
            <td class="labelClass">Discount</td>` + this.ItemData.TaxableValueName + `
            ` + this.ItemData.CGSTLabel + `
            ` + this.ItemData.SGSTLabel + `
            ` + this.ItemData.IGSTLabel + `
            <td class="labelClass">Amount(₹)</td>
          </tr>
          <tr>
          ` + this.ItemData.NAMEData + `
            <td>997331</td>
            <td>1</td>
            ` + this.ItemData.PRICEData + `
            <td>0</td>
            ` + this.ItemData.TaxableValueData + `
            ` + this.ItemData.CGSTData + `
            ` + this.ItemData.SGSTData + `
            ` + this.ItemData.IGSTData + `
            ` + this.ItemData.PRICEData + `
          </tr>
          <tr>
            <td class="labelClass">Total</td>
            <td class="labelClass"></td>
            <td>1</td>
            ` + this.ItemData.PRICEData + `
            <td> 0</td>
            ` + this.ItemData.TaxableValueData + `
            ` + this.ItemData.CGSTData + `
            ` + this.ItemData.SGSTData + `
            ` + this.ItemData.IGSTData + `
            ` + this.ItemData.PRICEData + `
          </tr>
          <tr>
            <td class="labelClass" colspan="5"></td>
            ` + this.TotalData.TotalTaxableValue1 + `
            ` + this.TotalData.TotalTaxableValue2 + `
            ` + this.ItemData.TaxableValueData + `
          </tr>
          <tr>
          ` + this.TotalData.PlaceOfSupply + `
          ` + this.TotalData.TotalTax1 + `
          ` + this.TotalData.TotalTax2 + `
            <td> ` + this.totalTaxPrice + `</td>
          </tr>
          <tr>
            <td class="labelClass" colspan="5"></td>
            ` + this.TotalData.InvoiceTotal1 + `
          ` + this.TotalData.InvoiceTotal2 + `
          ` + this.ItemData.PRICEData + `
          </tr>
        </table>
      </div>`;
        return HTMLData;
    }

    // check which tags needed to be added for customers
    CheckCustomerData(CustomerData) {

        if (CustomerData.customerName.length) {
            this.Customer.Name += `<td class="labelClass"> Name</td>`;
            this.Customer.Name += `<td class="labelDataClass">` + CustomerData.customerName + `</td>`;

        }
        if (CustomerData.BillingAddress.length) {
            this.Customer.Address += `<td class="labelClass"> Address < /td>`;
            this.Customer.Address += ` <td class="labelDataClass"> ` + CustomerData.BillingAddress + `</td>`;
        }
        if (CustomerData.State.length) {
            this.Customer.state += `<td class="labelClass"> State </td>`;
            this.Customer.state += ` <td class="labelDataClass"> ` + CustomerData.State + `</td>`;
        }
        if (CustomerData.GSTIN.length) {
            this.Customer.GSTIN += `<td class="labelClass"> GSTIN </td>`;
            this.Customer.GSTIN += ` <td class="labelDataClass"> ` + CustomerData.GSTIN + `</td>`;
        }
        if (CustomerData.Email.length) {
            this.Customer.Email += `<td class="labelClass">Email Address </td>`;
            this.Customer.Email += ` <td class="labelDataClass"> ` + CustomerData.Email + `</td>`;
        }
        this.TotalData.PlaceOfSupply += `<td class="labelClass" colspan="5">`;
        if (CustomerData.State) {
            this.TotalData.PlaceOfSupply += `<span>Place of Supply -
            ` + CustomerData.State + `</span>`;
        }
        this.TotalData.PlaceOfSupply += `</td>`;
    }

    // check which product tag need to be added
    CheckProductData(ProductData, CGST, SGST, IGST, TaxableValue) {

        if (CGST > 0) {
            this.ItemData.CGSTLabel = `<td class="labelClass">CGST(9%)</td>`;
            this.ItemData.CGSTData = `<td>` + CGST.toFixed(2) + `</td>`;
            this.TotalData.TotalTaxableValue2 = `<td class="labelClass" colspan="3">Total Taxable Value</td>`;
            this.TotalData.TotalTax2 = `<td class="labelClass" colspan="3">Total Tax</td>`;
            this.TotalData.InvoiceTotal2 = `<td class="labelClass"colspan="3">Invoice Total</td>`;
        }
        if (SGST > 0) {
            this.ItemData.SGSTLabel = `<td class="labelClass">SGST(9%)</td>`;
            this.ItemData.SGSTData = `<td>` + SGST.toFixed(2) + `</td>`;
        }
        if (IGST > 0) {
            this.ItemData.IGSTLabel = `<td class="labelClass">IGST(18%)</td>`;
            this.ItemData.IGSTData = `<td>` + IGST.toFixed(2) + `</td>`;
            this.TotalData.TotalTaxableValue1 = `<td class="labelClass" colspan="2">Total Taxable Value</td>`;
            this.TotalData.TotalTax1 = `<td class="labelClass" colspan="2">Total Tax</td>`;
            this.TotalData.InvoiceTotal1 = `<td class="labelClass"colspan="2">Invoice Total</td>`;
        }
        if (Number(ProductData.PRICE) > 0) {
            this.ItemData.PRICEData = `<td>` + Number(ProductData.PRICE).toFixed(2) + `</td>`;
            this.ItemData.PRICELabel = `<td class="labelClass">Price(₹)</td>`;
        }
        if (TaxableValue > 0) {
            this.ItemData.TaxableValueName = `<td class="labelClass">Taxable Value(₹)</td>`;
            this.ItemData.TaxableValueData = `<td>` + TaxableValue.toFixed(2) + `</td>`;
        }
        if (ProductData.NAME) {
            this.ItemData.NAMELabel = `<td class="labelClass">Description of Service</td>`;
            this.ItemData.NAMEData = `<td>` + ProductData.NAME + `</td>`;
        }

    }

}
