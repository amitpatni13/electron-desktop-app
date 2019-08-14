import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantMessages } from 'src/Constants/constant';
import { AppSettings } from 'src/Services/appSetting.service';

@Component({
  selector: 'app-sales',
  templateUrl: 'sales.html',
  styleUrls: ['./sales.scss']
})
export class SalesMainComponent implements OnInit {
  transactionType = 'NEW TRANSACTION';
  currency: string;
  displayedColumns: string[] = ['select', 'invoiceDate', 'type', 'invoiceNumber', 'partyName', 'invoiceDueDate', 'ageing',
  'balance', 'taxableValue', 'tax', 'totalInvoiceAmount', 'attachments', 'invoiceStatus', 'Action'];
  ELEMENT_DATA = [{
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 1
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 2
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 3
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 4
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 5
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 6
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 7
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 8
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 9
  }, {
    invoiceDate: '2019-05-06', type: 'Invoice', invoiceNumber: 'INV-0001', partyName: 'Raj', invoiceDueDate: '2019-06-06', ageing: 30,
    balance: 27876, taxableValue: 23623.73, tax: 4252.28, totalInvoiceAmount: 27876.01, attachments: '', invoiceStatus: 'Open',
    Action: 'RECEIVE PAYMENT', id: 10
  }];

  constructor(private appSetting: AppSettings, private router: Router) { }

  ngOnInit() {
    this.appSetting.getAppSettingData('Currency').then((responseCurrency) => {
      for (const currency of ConstantMessages.CURRENCY) {
        if (currency.Name === responseCurrency.value) {
          this.currency = currency.CODE;
        }
      }
    });
  }

  selectTransactionType(ev: any) {
    console.log(ev);
    this.router.navigate(['/bill']);
  }
}
