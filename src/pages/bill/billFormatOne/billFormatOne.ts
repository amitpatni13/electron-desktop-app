import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IProductItemsFooterData } from 'src/Model/productItemsData.model';
import { FormGroup, FormArray } from '@angular/forms';
import { ITaxSlabs } from 'src/Model/taxSlabs.model';

@Component({
    selector: 'app-bill-format-one',
    templateUrl: './billFormatOne.html',
    styleUrls: ['./billFormatOne.scss']
})
export class BillFormatOneComponent implements OnInit, OnChanges, OnDestroy {
    @Input() InvoiceForm: FormGroup;
    @Input() currency: string;
    @Input() footerData: IProductItemsFooterData;
    @Input() selectedTaxRates: ITaxSlabs[] = [];
    @Output() addItem = new EventEmitter<string>();
    @Output() removeItem = new EventEmitter<number>();
    @Output() dragDrop = new EventEmitter<FormGroup[]>();
    @Output() taxRateAdded = new EventEmitter<ITaxSlabs[]>();
    addNewParty = false;

    constructor() { }

    /** Called whenever the data changes in the parent component */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.currency) { // Only run when property "currency" changed
            this.currency = changes.currency.currentValue;
        }
        if (changes.footerData) { // Only run when property "footerData" changed
            this.footerData = changes.footerData.currentValue;
            if (this.footerData) {
                this.footerData.balance = 0;
            }
        }
        if (changes.InvoiceForm) { // Only run when property "InvoiceForm" changed, when adding items
            this.InvoiceForm = changes.InvoiceForm.currentValue;
        }
        if (changes.selectedTaxRates) { // Only run when property "selectedTaxRates" changed
            this.selectedTaxRates = changes.selectedTaxRates.currentValue;
        }
        console.log(changes);
    }

    ngOnInit() { }

    ngOnDestroy(): void {
        this.addItem.unsubscribe();
        this.removeItem.unsubscribe();
        this.dragDrop.unsubscribe();
        this.taxRateAdded.unsubscribe();
    }

    /** To set the size of input fields in the form using id */
    resizeElement(id: string, factor: number, placeholderChars: number) {
        const element: any = document.getElementById(id);
        this.setElementWidth(element, factor, placeholderChars);
    }

    /** To set the size of input fields in the form using class */
    resizeClassElement(id: string, factor: number, placeholderChars: number, index: number) {
        const element: any = document.getElementsByClassName(id)[index];
        this.setElementWidth(element, factor, placeholderChars);
    }

    /** To set the width of the input element */
    setElementWidth(element: any, factor: number, placeholderChars: number) {
        console.log('Input Element Data: ', element);
        const size = Number(factor) || 7.7;
        if (element) {
            if (element.value && element.value.length) {
                element.style.width = String((element.value.length + 1) * size) + 'px';
            } else {
                element.style.width = String((Number(placeholderChars)) * size) + 'px';
            }
        }
    }

    /** To toggle if the party is to be added to form */
    addNewPartyToggle() {
        this.addNewParty = !this.addNewParty;
    }

    /** To generate an event to parent to add new item in the form array */
    addFormItem() {
        this.addItem.next('item'); // Calling Parent to add form Item
    }

    /** To generate an event to parent to remove an item from the form array */
    removeFormItem(index: number) {
        this.removeItem.next(index); // Calling Parent to remove form Item
    }

    /** To generate an event to parent to drag drop an item in the form array */
    drop(event: FormGroup[]) {
        this.dragDrop.next(event); // Calling Parent to execute the drag drop event for the form Item
    }

    /** To generate an event to parent to update/add the tax rates selected in the form */
    updateTaxRateSelected(taxRates: ITaxSlabs[]) {
        this.taxRateAdded.next(taxRates);
    }
}
