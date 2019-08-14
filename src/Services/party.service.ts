import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../providers/database/database';
import { IParty } from '../Model/Party.Model';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';
import { TransactionDataService } from './transactionDataService';
@Injectable()
export class PartyData {
    public party: IParty;
    partyData: IParty;
    public Parties = [];
    constructor(private dbProvider: DatabaseProvider, public TransactionData: TransactionDataService, public logService: ErrorLogService) {
    }

    // Add new Party to the Database
    addParty(partyData: IParty) {
        if (partyData.outstandingBalance === undefined || partyData.outstandingBalance === null) {
            partyData.outstandingBalance = 0;
        }
        // tslint:disable-next-line:max-line-length
        const data = [partyData.name, partyData.email, partyData.Phone, partyData.address, partyData.GSTIN, partyData.city, partyData.state, partyData.pinCode, partyData.address, partyData.city, partyData.state, partyData.pinCode, partyData.outstandingBalance, partyData.registrationType, partyData.CreditLimits, partyData.TemporaryParty, partyData.paymentTerms];
        console.log(data);
        // tslint:disable-next-line:max-line-length
        return this.dbProvider.executeSql('INSERT INTO Party ("PartyName", "Email", "ContactNumber", "BillingAddress", "GSTIN", "BillingCity","BillingState","BillingPincode","ShippingAddress","ShippingCity","ShippingState","ShippingPincode", "OutstandingBalance", "RegistrationType", "CreditLimits", "TemporaryParty","PaymentTerms", "BusinessID") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT BusinessID FROM Business WHERE IsActive = "1"))', data).then(dataRow => {
            return dataRow;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // Get all Party Details from the database
    async getAllParties() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select ContactNumber,OutstandingBalance, PartyName, PartyID, CreditPoints,PaymentTerms from Party WHERE TemporaryParty = "0" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")', []).then(async (data: any) => {
            const partyList: IParty[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    partyList.push({
                        partyId: dataRow.PartyID,
                        name: dataRow.PartyName,
                        outstandingBalance: dataRow.OutstandingBalance,
                        Phone: dataRow.ContactNumber,
                        creditAmount: dataRow.CreditPoints,
                        paymentTerms: dataRow.PaymentTerms

                    });
                }
            }
            return partyList;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
    // get all party details with outstanding balance,name,ID,Number from the database
    async getAllPartiesList() {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('select OutstandingBalance, CreditLimits,PartyName, PartyID,ContactNumber, CreditPoints from Party WHERE TemporaryParty != "1" AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1")', []).then(async (data: any) => {
            const  partyList: IParty[] = [];
            if (data && data.length > 0) {
                for (const dataRow of data) {
                    partyList.push({
                        partyId: dataRow.PartyID,
                        name: dataRow.PartyName,
                        outstandingBalance: dataRow.OutstandingBalance,
                        Phone: dataRow.ContactNumber,
                        creditAmount: dataRow.CreditPoints,
                        CreditLimits: dataRow.CreditLimits
                    });
                }
            }
            return partyList;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }
    // Get the Party Info from DB if we have the partyName or ID, to be inserted in the Sales Invoice Table
    async getPartyDataFromDB(partyId) {
        // tslint:disable-next-line:max-line-length
        return await this.dbProvider.executeSql('SELECT PartyID,PartyName,Email,GSTIN,ContactNumber,ShippingAddress,ShippingCity,ShippingState,ShippingPincode,OutstandingBalance,RegistrationType,CreditPoints,CreditLimits,PaymentTerms FROM Party WHERE PartyID = ? LIMIT 1', [partyId]).then((data: any) => {
            let partyInfo: IParty;
            if (data && data.length > 0) {
                partyInfo = {
                    partyId: data[0].PartyID,
                    name: data[0].PartyName,
                    email: data[0].Email,
                    GSTIN: data[0].GSTIN,
                    Phone: data[0].ContactNumber,
                    address: data[0].ShippingAddress,
                    city: data[0].ShippingCity,
                    state: data[0].ShippingState,
                    pinCode: data[0].ShippingPincode,
                    outstandingBalance: data[0].OutstandingBalance,
                    registrationType: data[0].RegistrationType,
                    creditAmount: data[0].CreditPoints,
                    CreditLimits: data[0].CreditLimits,
                    paymentTerms: data[0].PaymentTerms

                };
            }
            return partyInfo;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }
    UpdatePartyInfo(partyData: IParty) {
        if (0 !== partyData.name.length) {
            // tslint:disable-next-line:max-line-length
            const data = [partyData.name, partyData.email, partyData.Phone, partyData.address, partyData.GSTIN, partyData.city, partyData.state, partyData.pinCode, partyData.address, partyData.city, partyData.state, partyData.pinCode, partyData.registrationType, partyData.CreditLimits, partyData.paymentTerms, partyData.partyId];
            console.log(data);
            // tslint:disable-next-line:max-line-length
            return this.dbProvider.executeSql('UPDATE Party SET PartyName=?, Email=?, ContactNumber=?, BillingAddress=?, GSTIN=?, BillingCity=?, BillingState=?,BillingPincode=?,ShippingAddress=?,ShippingCity=?,ShippingState=?,ShippingPincode=?,RegistrationType=?,CreditLimits=?,PaymentTerms=?,partyUpdated="1" WHERE PartyID = ?', data).then(res => {
                console.log('updated successfully ' + res);
                return res;
            }, err => {
                console.log('Error  ', err);
                return err;
            });
        }
    }
    // To Update the outstanding balance of the party once the Sale Process is completed and Bill is Generated...
    UpdatePartyOutstandingBalance(partyId: number, outstandingBalance: number) {
        if (undefined === outstandingBalance || null === outstandingBalance) { return; }
        outstandingBalance = Math.round(outstandingBalance);
        const query = 'UPDATE Party SET  OutstandingBalance = ?, partyUpdated = "1" WHERE PartyID = ?';
        const inputs = [outstandingBalance, partyId];
        return this.dbProvider.executeSql(query, inputs).then((data) => {
            console.log('updated successfully'); console.log(data);
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    /** To return the party data for Petty Cash from Party Table in DB */
    async getPettyCashPartyData() {
        // tslint:disable-next-line:max-line-length
        const query = 'SELECT PartyID, PartyName, ContactNumber, RegistrationType, OutstandingBalance, CreditPoints FROM Party WHERE ContactNumber = ? AND BusinessID = (SELECT BusinessID FROM Business WHERE IsActive = "1") LIMIT 1';
        return await this.dbProvider.executeSql(query, ['-1']).then((data: any) => {
            let partyInfo: IParty = null;
            if (data && data.length > 0) {
                partyInfo = {
                    partyId: data[0].PartyID,
                    name: data[0].PartyName,
                    Phone: data[0].ContactNumber,
                    outstandingBalance: data[0].OutstandingBalance,
                    registrationType: data[0].RegistrationType,
                    creditAmount: data[0].CreditPoints
                };
            }
            return partyInfo;
        }, err => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To manually insert the Petty Cash party in DB if it does not exists, verified after DB restore */
    insertPettyCashPartyInDB() {
        // tslint:disable-next-line:max-line-length
        const query = 'INSERT INTO Party ("PartyName", "ContactNumber", "OutstandingBalance", "CreatedOn", "RegistrationType", "CreditPoints", "BusinessID") VALUES ("Petty Cash", "-1", "0", DATETIME("now", "localtime"), "Unregistered", "0", (SELECT BusinessID FROM Business WHERE IsActive = "1"))';
        return this.dbProvider.executeSql(query, []).then((data) => {
            console.log('Updated successfully: ', data);
            return data;
        }, (err) => {
            console.log('Error  ', err);
            return err;
        });
    }

    // To Delete the Party from PartyList Page
    deleteParty(partyId) {
        return this.dbProvider.executeSql('Update Party SET TemporaryParty = "1" WHERE PartyID= ?', [partyId]).then(
            (data) => {
                console.log('deleted successfully');
                return data;
            }, (err) => {
                console.log('Error fetching partyDeleted data:' + err);
                return err;
            }
        );
    }

     // To restore the deleted the PartyData from database by passing the party id for that transaction.
     restoreDeletedParty(partyId) {
        return this.dbProvider.executeSql('Update Party SET TemporaryParty = "0" WHERE PartyID= ?', [partyId]).then(
            (data) => {
                console.log('Restored deleted Party successfully');
                return data;
            }, (err) => {
                console.log('Error fetching Party data: ' + err);
                return err;
            }
        );
    }
   // Select the Temporary Party by passing the party Id for that Transaction
    isPartyActive(partyId) {
        return this.dbProvider.executeSql('SELECT TemporaryParty FROM Party WHERE PartyID = ?', [partyId]).then(
            (data: any) => {
                let TemporaryParty;
                if (data && data.length) {
                    TemporaryParty = data[0].TemporaryParty;
                    }
                return Boolean(Number(TemporaryParty));
            }, (err) => {
                console.log('Error fetching Temporary Party  data: ' + err);
                return err;
            }
        );
    }
}
