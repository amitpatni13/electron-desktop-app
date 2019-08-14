import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ITaxSlabs } from 'src/Model/taxSlabs.model';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { TaxSlabs } from 'src/Services/taxSlabs.service';

@Component({
    selector: 'app-tax-rates-modal',
    templateUrl: './taxRatesModal.html',
    styleUrls: ['./taxRatesModal.css']
})
export class TaxRatesModalComponent implements OnInit, OnChanges, OnDestroy {
    @Input() selectedTaxRates: ITaxSlabs[];
    @Output() taxRateAdded = new EventEmitter<ITaxSlabs[]>();
    TaxRatesForm: FormGroup;
    taxRates: ITaxSlabs[] = [];
    applyTaxToAllItems: boolean;
    billThemeColor = '#183185';
    @Input() taxRatePopover;

    constructor(private formBuilder: FormBuilder, private taxSlabService: TaxSlabs) { }

    /** Called whenever the data changes in the parent component */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedTaxRates) { // Only run when property "selectedTaxRates" changed
            this.selectedTaxRates = changes.selectedTaxRates.currentValue;
            if (this.selectedTaxRates && this.selectedTaxRates.length) {
                for (const selectedTax of this.selectedTaxRates) {
                    for (let tax of this.taxRates) {
                        if (tax.TaxSlabID === selectedTax.TaxSlabID) {
                            tax = selectedTax;
                            break;
                        }
                    }
                }
            }
            this.patchTaxSlabsData(this.taxRates);
        }
        console.log(changes);
    }

    ngOnInit() {
        this.Validation();
        this.getTaxRates();
    }

    ngOnDestroy(): void {
        this.taxRateAdded.unsubscribe();
    }

    /** Validation for each form field */
    Validation() {
        this.TaxRatesForm = this.formBuilder.group({
            taxRates: this.formBuilder.array([]),
            applyTaxToAllItems: [false, []]
        });
        // Called each time a value is updated in the Child Component Form field
        this.TaxRatesForm.valueChanges.subscribe((formData) => { // Setting the values received from the Child Component into the form
            this.applyTaxToAllItems = formData.applyTaxToAllItems;
            this.taxRates = formData.taxRates;
        });
    }

    /** Get the value of Tax Rates Array from the Form */
    get taxRatesArray(): FormArray {
        return this.TaxRatesForm.get('taxRates') as FormArray;
    }

    /** Adding new tax rate in the Form Array */
    addTaxRates() {
        console.log('Adding new tax slab to form');
        this.taxRatesArray.push(this.createFormTaxRates());
    }

    /** Removing an tax rate from Form Array */
    removeTaxRate(index: number) {
        console.log('Removing TaxRate at position ' + index + ' from form');
        this.taxRatesArray.removeAt(Number(index));
        // this.taxRates.splice(Number(index), 1);
    }

    /** Creating new tax rate in the Form */
    createFormTaxRates() {
        return this.formBuilder.group({
            TaxSlabID: ['', []],
            TaxSlabName: ['', []],
            TaxSlabValue: [0, []],
            isSelected: [false, []],
            isApplied: [false, []]
        });
    }

    /** Creating new tax rate in the Form with the data */
    addTaxRatesToForm(taxSlab: ITaxSlabs) {
        this.taxRatesArray.push(
            this.formBuilder.group({
                TaxSlabID: [taxSlab.TaxSlabID, []],
                TaxSlabName: [taxSlab.TaxSlabName, []],
                TaxSlabValue: [taxSlab.TaxSlabValue, []],
                isSelected: [taxSlab.isSelected, []],
                isApplied: [taxSlab.isApplied, []]
            })
        );
    }

    /** Get the tax rates from the DB */
    getTaxRates() {
        this.taxSlabService.getTaxSlabs().then((taxSlabs: ITaxSlabs[]) => {
            if (taxSlabs && taxSlabs.length) {
                for (const tax of taxSlabs) {
                    this.addTaxRatesToForm({
                        TaxSlabID: tax.TaxSlabID,
                        TaxSlabName: tax.TaxSlabName,
                        TaxSlabValue: Number((Number(tax.TaxSlabValue) * 100).toFixed(2)),
                        isSelected: false,
                        isApplied: true
                    });
                }
            }
        }).catch((err) => {
            console.log('Error getting tax slabs from DB: ', err);
        });
    }

    /** Setting the data in the form array */
    patchTaxSlabsData(taxSlabs: ITaxSlabs[]) {
        if (taxSlabs && taxSlabs.length) {
            for (const tax of taxSlabs) {
                const position = taxSlabs.indexOf(tax);
                this.taxRatesArray.at(position).patchValue({
                    TaxSlabID: tax.TaxSlabID,
                    TaxSlabName: tax.TaxSlabName,
                    TaxSlabValue: tax.TaxSlabValue,
                    isSelected: tax.isSelected,
                    isApplied: tax.isApplied
                });
            }
        }
    }

    /** Sending the tax rates selected to the parent to apply the tax to the Bill */
    selectTaxRate(taxRates: ITaxSlabs[]) {
        this.taxRateAdded.next(taxRates);
        this.taxRatePopover.close(); // Closing the popover after the tax slabs have been added
    }

    /** Applying the tax rates  */
    applyTaxRates() {
        const selectedTaxRates: ITaxSlabs[] = [];
        for (const tax of this.taxRates) {
            const position = this.taxRates.indexOf(tax);
            this.taxRatesArray.at(position).patchValue({
                isApplied: true
            });
            if (tax.isSelected) {
                selectedTaxRates.push(tax);
            }
        }
        if (selectedTaxRates && selectedTaxRates.length) {
            this.selectTaxRate(selectedTaxRates);
        }
    }
}
