import { Injectable } from '@angular/core';
import { PartyData } from '../Services/party.service';
import { IParty } from '../Model/Party.Model';
@Injectable()
export class CustomerData {
  public customerList: IParty[];
  constructor(public partyService: PartyData) {
    this.customerList = [];
    // get all party data from the database
    partyService.getAllParties().then(
      (response) => {
        this.customerList = response;
        console.log(this.customerList);
        console.log(response);
      }
    );
  }
  // get customer details
  getCustomers() {
    return this.customerList;
  }
}
