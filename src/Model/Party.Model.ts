export interface IParty {
    partyId: number;
    name: string;
    email?: string;
    Phone?: number;
    address?: string;
    GSTIN?: string;
    city?: string;
    pinCode?: number;
    state?: string;
    outstandingBalance?: number;
    registrationType?: string;
    creditAmount?: number;
    CreditLimits?: number;
    TemporaryParty?: number;
    paymentTerms?: string;
    country?: string;
}

export class PartyModel implements IParty {
     partyId: number;
    name: string;
    email?: string;
    Phone?: number;
    address?: string;
    GSTIN?: string;
    city?: string;
    pinCode?: number;
    state?: string;
    outstandingBalance?: number;
    registrationType?: string;
    creditAmount?: number;
    CreditLimits?: number;
    TemporaryParty?: number;
    paymentTerms?: string;

   constructor() {
        this.partyId = null;
        this.name = null;
        this.email = null;
        this.Phone = null;
        this.address = null;
        this.GSTIN = null;
        this.city = null;
        this.pinCode = null;
        this.state = null;
        this.outstandingBalance = null;
        this.registrationType = null;
        this.creditAmount = null;
        this.CreditLimits = 0;
        this.TemporaryParty = 0;
        this.paymentTerms = null;
    }

}


export interface Iparty {
    partyId: number;
    name: string;
    email?: string;
    Phone?: number;
    address?: string;
    GSTIN?: string;
    city?: string;
    pinCode?: number;
    state?: string;
}
