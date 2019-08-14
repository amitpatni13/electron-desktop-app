import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/Services/appSetting.service';
import { Router } from '@angular/router';
import { ConstantMessages } from 'src/Constants/constant';
import { IBusinessProfile } from 'src/Model/BusinessProfile.model';
import { BusinessProfileData } from 'src/Services/business_profile.service';
import { IParty } from 'src/Model/Party.Model';
import { PartyData } from 'src/Services/party.service';
import { IProductItemsFooterData, IProductItemsData } from 'src/Model/productItemsData.model';
import { AllItems } from 'src/BizLogic/itemData';
import { FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ValidationHelper } from 'src/Utilities/Validator';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ITaxSlabs } from 'src/Model/taxSlabs.model';

@Component({
    selector: 'app-bill',
    templateUrl: './bill.html',
    styleUrls: ['./bill.scss']
})
export class BillComponent implements OnInit {
    InvoiceForm: FormGroup;
    validator = new ValidationHelper();
    currency: string;
    billFormatSelected = '1';
    businessUser: IBusinessProfile = {
        Name: '',
        ContactNumber: null,
        Address: '',
        City: '',
        State: '',
        Country: '',
        BusinessID: 0,
        PinCode: null
    };
    partyData: IParty = {
        name: '',
        Phone: null,
        address: '',
        city: '',
        state: '',
        country: '',
        partyId: 0,
        pinCode: null
    };
    allPartyData: IParty[] = [];
    footerData: IProductItemsFooterData;
    public InvoiceItemsForm: FormGroup;
    InvoiceItems: IProductItemsData[] = [];
    selectedTaxRates: ITaxSlabs[] = [];

    constructor(private appSetting: AppSettings, private router: Router, private businessProfileService: BusinessProfileData,
                private partyService: PartyData, private itemsDataService: AllItems, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.appSetting.getAppSettingData('Currency').then((responseCurrency) => {
            for (const currency of ConstantMessages.CURRENCY) {
                if (currency.Name === responseCurrency.value) {
                    this.currency = currency.CODE;
                }
            }
        });
        this.getBusinessProfileData();
        this.partyService.getAllParties().then((partyData) => {
            this.allPartyData = partyData;
        });
        this.footerData = this.itemsDataService.getFooterData();
        this.GetNoteDetails();
        this.Validation();
    }

    /** Getting the business profile data from DB and setting it in form */
    getBusinessProfileData() {
        this.businessProfileService.getProfileData().then((businessData) => {
            console.log('Business Data received: ', businessData);
            this.businessUser = businessData[0];
            this.InvoiceForm.patchValue({
                businessName: this.businessUser.Name,
                businessContactNumber: this.businessUser.ContactNumber,
                businessAddress: this.businessUser.Address,
                businessCity: this.businessUser.City,
                businessState: this.businessUser.State,
                businessPinCode: this.businessUser.PinCode
            });
        });
    }

    /** Getting the party info selected by user and setting it in form */
    selectParty(id: number) {
        this.partyService.getPartyDataFromDB(id).then((party) => {
            this.partyData = party;
            this.InvoiceForm.patchValue({
                partyName: this.partyData.name,
                partyContactNumber: this.partyData.Phone,
                partyAddress: this.partyData.address,
                partyCity: this.partyData.city,
                partyState: this.partyData.state,
                partyPinCode: this.partyData.pinCode
            });
        });
    }

    /** Validation for each form field */
    Validation() {
        this.InvoiceForm = this.formBuilder.group({
            businessName: ['', [Validators.required]],
            businessContactNumber: ['', []],
            businessAddress: ['', []],
            businessCity: ['', []],
            businessState: ['', []],
            businessPinCode: ['', []],
            businessCountry: ['None', []],
            partyName: ['', []],
            partyContactNumber: ['', []],
            partyAddress: ['', []],
            partyCity: ['', []],
            partyState: ['', []],
            partyPinCode: ['', []],
            partyCountry: ['None', []],
            InvoiceDate: [this.footerData.invoiceDate || '', []],
            InvoiceDueDate: [this.footerData.invoiceDueDate || '', []],
            InvoiceNumber: [this.footerData.invoiceNumber || '', [Validators.required]],
            PaymentReference: [this.footerData.paymentRefNo || '', []],
            InvoiceNote: ['', []],
            InvoiceTerms: ['', []],
            items: this.formBuilder.array([])
        });
        // Called each time a value is updated in the Child Component Form field
        this.InvoiceForm.valueChanges.subscribe((formData) => { // Setting the values received from the Child Component into the form
            this.businessUser.Name = formData.businessName;
            this.businessUser.ContactNumber = formData.businessContactNumber;
            this.businessUser.Address = formData.businessAddress;
            this.businessUser.City = formData.businessCity;
            this.businessUser.State = formData.businessState;
            this.businessUser.PinCode = formData.businessPinCode;
            this.businessUser.Country = formData.businessCountry;
            this.partyData.name = formData.partyName;
            this.partyData.Phone = formData.partyContactNumber;
            this.partyData.address = formData.partyAddress;
            this.partyData.city = formData.partyCity;
            this.partyData.state = formData.partyState;
            this.partyData.pinCode = formData.partyPinCode;
            this.partyData.country = formData.partyCountry;
            this.footerData.invoiceDate = formData.InvoiceDate;
            this.footerData.invoiceDueDate = formData.InvoiceDueDate;
            this.footerData.invoiceNumber = formData.InvoiceNumber;
            this.footerData.paymentRefNo = formData.PaymentReference;
            this.footerData.invoiceNote = formData.InvoiceNote;
            this.footerData.invoiceTerms = formData.InvoiceTerms;
            this.InvoiceItems = [];
            for (const item of formData.items) {
                this.InvoiceItems.push({
                    id: this.InvoiceItems.length + 1,
                    name: item.itemName,
                    purchasePrice: 0,
                    discount: 0, // Actual discount value, difference in selling price and discounted price
                    discountedPrice: item.itemPrice, // For Item History, to be used in transactions
                    sellingPrice: item.itemTotal,
                    count: item.itemQuantity,
                    TaxSlabID1: 0,
                    TaxSlabID2: 0,
                    TaxSlabID3: 0,
                    TaxSlabID4: 0,
                    TaxSlabValue1: 0,
                    TaxSlabValue2: 0,
                    TaxSlabValue3: 0,
                    TaxSlabValue4: 0,
                    maximumRetailPrice: item.itemPrice,
                    description: item.itemDescription
                });
            }
        });
    }

    /** Creating a getter for Array Part of Form */
    get formArray(): FormArray {
        return this.InvoiceForm.get('items') as FormArray;
    }

    /** Adding new item in the Form Array */
    addItems(ev: any) {
        console.log('Adding new ' + ev + ' to form');
        this.formArray.push(this.createFormItems());
    }

    /** Removing an item from Form Array */
    removeItem(index: number) {
        console.log('Removing item at position ' + index + ' from form');
        this.formArray.removeAt(Number(index));
    }

    /** Creating new item in the Form */
    createFormItems() {
        return this.formBuilder.group({
            itemName: ['', [Validators.required]],
            itemDescription: ['', []],
            itemPrice: [0, [Validators.required]],
            itemQuantity: [1, [Validators.required]],
            itemTotal: [0, []]
        });
    }

    /** For Drag and Drop items to change index in Items Table */
    drop(event: CdkDragDrop<FormGroup>) {
        console.log('Drag Drop Event: ', event);
        const dir = event.currentIndex > event.previousIndex ? 1 : -1; // Move in Array Left to Right or Right to Left
        const temp = this.formArray.at(event.previousIndex);
        for (let index = event.previousIndex; index * dir < event.currentIndex * dir; index = index + dir) {
            const current = this.formArray.at(index + dir);
            this.formArray.setControl(index, current);
        }
        this.formArray.setControl(event.currentIndex, temp);
    }

    /** Get the Note Details From the database */
    GetNoteDetails() {
        this.appSetting.getAppSettingData('InvoiceNote').then(InvoiceData => {
            if (InvoiceData && InvoiceData.value && InvoiceData.value.length) {
                this.footerData.invoiceNote = InvoiceData.value;
                this.InvoiceForm.get('invoiceNote').setValue(InvoiceData.value);
            }
        });
    }

    /** To update/add the tax rates selected in the form */
    updateTaxRateSelected(taxRates: ITaxSlabs[]) {
        this.selectedTaxRates = taxRates;
    }
}
