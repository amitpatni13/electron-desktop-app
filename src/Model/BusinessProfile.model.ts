export interface IBusinessProfile {
    BusinessID: number;
    Name: string;
    ContactNumber: number;
    Address?: string;
    City?: string;
    State?: string;
    PinCode?: number;
    GSTIN?: string;
    PAN?: string;
    CIN?: string;
    Email?: string;
    Password?: string;
    LogoImagePath?: string;
    TypeOfBiz?: string;
    ProductType?: string;
    RegisterDate?: string;
    ExpiryDate?: string;
    GSTRegistrationType?: string;
    isActive?: number;
    CampaignID?: number;
    Country?: string;
}
