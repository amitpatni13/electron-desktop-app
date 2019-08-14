import { Component, Input } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { ValidationHelper } from '../Utilities/Validator';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})

// export class for validation
export class ControlMessagesComponent {
    @Input() control: FormControl;
    constructor() { }
  get errorMessage() {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return ValidationHelper.getValidationErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }
      return null;
    }
  }
