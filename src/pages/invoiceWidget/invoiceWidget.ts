import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-invoice-widget',
    templateUrl: './invoiceWidget.html',
    styleUrls: ['./invoiceWidget.scss']
})
export class InvoiceWidgetComponent implements OnInit, OnChanges {
    @Input() currency: string;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currency) { // Only run when property "currency" changed
            this.currency = changes.currency.currentValue;
        }
        console.log(changes);
    }

    ngOnInit() { }
}
