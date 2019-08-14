import { Injectable } from '@angular/core';
import { IProductItemsData } from '../Model/productItemsData.model';
import { AllItems } from './itemData';
import { TaxSlabs } from '../Services/taxSlabs.service';
import { ToasterService } from '../Services/toastMessage.service';
import { ITaxSlabs } from '../Model/taxSlabs.model';
import { ConstantMessages } from '../Constants/constant';
@Injectable()
export class PurchaseItems {
  purchaseItemList: IProductItemsData[] = [];
  purchaseItems: any;
  purchaseCartItems: IProductItemsData[];
  purchaseItemData: IProductItemsData;
  constructor(public _taxSlabs: TaxSlabs, private _itemData: AllItems, private _toasterService: ToasterService) {
  }
  //Add new item to purchase list
  async addItemToPurchaseList(id, Items: IProductItemsData[]) {
    for (let ProductItem in Items) {
      if (id === Items[ProductItem].id) {
        // this.purchaseItems = Items[ProductItem];
        this.purchaseItems = this.CalculateTaxForEachProduct(Items[ProductItem]);
        console.log("Product Added To List=" + Items[ProductItem]);
      }
    }
    return await this.purchaseItems;
  }
  //Cleaning the Updated Product value and ItemList of ItemData
  async CleanPurchaseProcess() {
    this._itemData.itemList = [];
    //cleaning the footer data when user enters the purchase flow or goes out of the purchase flow
    this._itemData.setFooterDataToDefault();
    this._itemData.itemList = [];
    this._itemData.cartItems = [];
    this._itemData.receivedItemIDs = [];
  }
  //get Updated Product value and ItemList of ItemData
  async UpdatedItemList(receivedItemIDs: number[], key: number) {
    let itemList: IProductItemsData[] = [];
    return await this._itemData.getItemsFromDB(receivedItemIDs, key).then((res) => {
      itemList = res;
      console.log("Item List in BizLogic at present..."); console.log(this._itemData.itemList);
      return itemList;
    });
  }
  //If product Values are updated on modal page then update it in the list
  UpdateToExistingProduct(PurchaseItemList, PurchaseItemData) {
    for (let ProductList in PurchaseItemList) {
      //if same item id exit then update only total quantity,selling price  and the tax value for the item
      if (PurchaseItemList[ProductList].id == PurchaseItemData.id) {
        PurchaseItemList[ProductList].TotalQuantity += PurchaseItemData.TotalQuantity;
        console.log("total quantity is" + PurchaseItemList[ProductList].TotalQuantity);
        PurchaseItemList[ProductList].discountedPrice = PurchaseItemData.discountedPrice;
        PurchaseItemList[ProductList].TaxSlabCGST = PurchaseItemData.TaxSlabCGST;
        PurchaseItemList[ProductList].TaxSlabSGST = PurchaseItemData.TaxSlabSGST;
        PurchaseItemList[ProductList].TaxSlabIGST = PurchaseItemData.TaxSlabIGST;
        PurchaseItemList[ProductList].TaxSlabCESS = PurchaseItemData.TaxSlabCESS;
        PurchaseItemList[ProductList].tax = PurchaseItemData.tax;
        return true;
      }
    }
    return false;
  }
  //Calculate Subtotal Value
  async subtotalValue(PurchaseItemList) {
    let subtotal = 0;
    for (let SubTotalProductList in PurchaseItemList) {
      subtotal += (PurchaseItemList[SubTotalProductList].TotalQuantity * PurchaseItemList[SubTotalProductList].discountedPrice)
    }
    return await subtotal
  }
  //Calculate TotalBalance
  async totalBalanceValue(PurchaseItemList,otherCosts) {
    let totalBalance = 0;
    if(otherCosts==undefined||otherCosts==null)otherCosts=0;
    for (let TotalProductList in PurchaseItemList) {
      totalBalance += (PurchaseItemList[TotalProductList].TotalQuantity * (PurchaseItemList[TotalProductList].discountedPrice + PurchaseItemList[TotalProductList].tax));
    }
    totalBalance+=otherCosts;
    return await totalBalance
  }
  //Calculate TotalBalanceDue
  async totalBalanceDue(TotalBalance, OutStandingBalance) {
    let TotalBalanceDue = 0;
    TotalBalanceDue = TotalBalance + OutStandingBalance;
    return await TotalBalanceDue;
  }

  // To get the data from DB for tax rates drop down menu in the form
  async getTaxRatesDataFromDB() {
    let taxRate;
    return await this._taxSlabs.getTaxSlabs().then(res => {
      taxRate = res;
      return taxRate;
    });
  }

  //Assigning TaxSlabValueId With Name
  async ReplaceTaxSlabId(PurchaseItemList) {
    //Getting the taxSlab Values from the database
    this.getTaxRatesDataFromDB().then(TaxResponse => {
      //Assigning to the global variable
      let TaxRatesId;
      TaxRatesId = TaxResponse;
      console.log("PurchaseItemList is" + PurchaseItemList);
      console.log("TaxRates Array is" + TaxRatesId);
      for (let ProductList in PurchaseItemList) {
        //If Product Tab slab Id1 is undefined or null then set tax slab name1 to null
        if (undefined === PurchaseItemList[ProductList].TaxSlabID1 || null === PurchaseItemList[ProductList].TaxSlabID1) {
          PurchaseItemList[ProductList].TaxSlabName1 = null
          console.log(PurchaseItemList[ProductList].TaxSlabName1);
        }
        //If Product Tab slab Id2 is undefined or null then set tax slab name2 to null
        if (undefined === PurchaseItemList[ProductList].TaxSlabID2 || null === PurchaseItemList[ProductList].TaxSlabID2) {
          PurchaseItemList[ProductList].TaxSlabName2 = null
        }
        //If Product Tab slab Id3 is undefined or null then set tax slab name3 to null
        if (undefined === PurchaseItemList[ProductList].TaxSlabID3 || null === PurchaseItemList[ProductList].TaxSlabID3) {
          PurchaseItemList[ProductList].TaxSlabName3 = null
        }
        //If Product Tab slab Id4 is undefined or null then set tax slab name4 to null
        if (undefined === PurchaseItemList[ProductList].TaxSlabID4 || null === PurchaseItemList[ProductList].TaxSlabID4) {
          PurchaseItemList[ProductList].TaxSlabName4 = null
        }
        //get the tax Rate Name from GSTTax Slab
        for (let taxRatesData in ConstantMessages.GSTTaxRate) {
          if (PurchaseItemList[ProductList].TaxSlabID1 == ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID) {
            PurchaseItemList[ProductList].TaxSlabName1 = ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabName;
            PurchaseItemList[ProductList].TaxSlabName1 = PurchaseItemList[ProductList].TaxSlabName1.replace("@", "-");
          }
        }
        //get the tax Rate Name from IGSTTax Slab
        for (let taxRatesData in ConstantMessages.IGSTTaxRate) {
          if (PurchaseItemList[ProductList].TaxSlabID1 == ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID) {
            PurchaseItemList[ProductList].TaxSlabName1 = ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabName;
            PurchaseItemList[ProductList].TaxSlabName1 = PurchaseItemList[ProductList].TaxSlabName1.replace("@", "-");
          }
        }
        //get other tax tax from database
        for (let TaxSlabRates in TaxRatesId) {
          //checking each product with all taxRated id 
          //if id matches then for that product store the name from the taxRates array
          if (PurchaseItemList[ProductList].TaxSlabName1 == null) {
            if (PurchaseItemList[ProductList].TaxSlabID1 == TaxRatesId[TaxSlabRates].TaxSlabID) {
              PurchaseItemList[ProductList].TaxSlabName1 = TaxRatesId[TaxSlabRates].TaxSlabName;
              //replace @ with - 
              PurchaseItemList[ProductList].TaxSlabName1 = PurchaseItemList[ProductList].TaxSlabName1.replace("@", "-");
            }
          }
          if (PurchaseItemList[ProductList].TaxSlabID1 != PurchaseItemList[ProductList].TaxSlabID2) {
            //if id matches then for that product store the name from the taxRates array
            if (PurchaseItemList[ProductList].TaxSlabID2 == TaxRatesId[TaxSlabRates].TaxSlabID) {
              PurchaseItemList[ProductList].TaxSlabName2 = TaxRatesId[TaxSlabRates].TaxSlabName;
              //replace @ with -
              PurchaseItemList[ProductList].TaxSlabName2 = PurchaseItemList[ProductList].TaxSlabName2.replace("@", "-");
            }
          }
          //if id matches then for that product store the name from the taxRates array
          if (PurchaseItemList[ProductList].TaxSlabID3 == TaxRatesId[TaxSlabRates].TaxSlabID) {
            PurchaseItemList[ProductList].TaxSlabName3 = TaxRatesId[TaxSlabRates].TaxSlabName;
            //replace @ with -
            PurchaseItemList[ProductList].TaxSlabName3 = PurchaseItemList[ProductList].TaxSlabName3.replace("@", "-");
          }
          //if id matches then for that product store the name from the taxRates array
          if (PurchaseItemList[ProductList].TaxSlabID4 == TaxRatesId[TaxSlabRates].TaxSlabID) {
            PurchaseItemList[ProductList].TaxSlabName4 = TaxRatesId[TaxSlabRates].TaxSlabName;
            //replace @ with -
            PurchaseItemList[ProductList].TaxSlabName4 = PurchaseItemList[ProductList].TaxSlabName4.replace("@", "-");
          }
        }
      }
    });
    return await PurchaseItemList;
  }

  //purchase item left swipe for updating the total quantity of the item
  onPurchaseItemSwipe(id, PurchaseItemList: IProductItemsData[]) {
    for (let i in PurchaseItemList) {
      //check whether item id is there in the list
      if (id === PurchaseItemList[i].id) {
        //if the quantity is greater than remove item from it 
        if (PurchaseItemList[i].TotalQuantity > 1) {
          PurchaseItemList[i].TotalQuantity--;
          this._toasterService.warning('One Item Removed ' + PurchaseItemList[i].name);
        } else {
          //if the quantity is equal to 1 or less than delete the item from the list
          this.removeItemFromPurchase(id, PurchaseItemList);
        }
      }
    }
    //update the local array
    this.purchaseItemList = PurchaseItemList;
  }

  //remove the item if the total quantity is equal to 1 or less than.
  removeItemFromPurchase(id, PurchaseItemList: IProductItemsData[]) {
    for (let i in PurchaseItemList) {
      //check whether item id is there in the list
      if (PurchaseItemList[i].id == id) {
        //get the index number of the item for splice the item from the array
        let index: number = PurchaseItemList.indexOf(PurchaseItemList[i]);
        this._toasterService.warning(PurchaseItemList[i].name + ' Removed from Purchase!');
        //remove the item from the list
        PurchaseItemList.splice(index, 1);
      }
    }
    //update the local array
    this.purchaseItemList = PurchaseItemList;
  }

  //calculate the tax and GST,IGST and CESS for each Product
  CalculateTaxForEachProduct(purchaseItems) {
    let taxRates: ITaxSlabs[] = [];
    return this._taxSlabs.getTaxSlabs().then(async (res) => {
      taxRates = res;
      if (purchaseItems.TaxSlabID1 == 0 && purchaseItems.TaxSlabID2 == 0 && purchaseItems.TaxSlabID3 == 0 && purchaseItems.TaxSlabID4 == 0) {
        purchaseItems.TaxSlabID1 = 15; // For exempted item
      }
      purchaseItems.TaxSlabData = 0; purchaseItems.TaxSlabIGSTData = 0;
      let taxSlabColumns = [purchaseItems.TaxSlabID1, purchaseItems.TaxSlabID2, purchaseItems.TaxSlabID3, purchaseItems.TaxSlabID4]
      purchaseItems.tax = 0; purchaseItems.TaxSlabCGST = 0; purchaseItems.TaxSlabSGST = 0; purchaseItems.TaxSlabPurchase = 0; purchaseItems.TaxSlabIGST = 0; purchaseItems.TaxSlabCESS = 0;
      //let taxSlabItemData = [purchaseItems.TaxSlabValue1, purchaseItems.TaxSlabValue2, purchaseItems.TaxSlabValue3, purchaseItems.TaxSlabValue4]
      //switch case for setting the highest item tax slab ID
      for (let TaxNumber = 0; TaxNumber < 5; TaxNumber++) {
        //calculate the GSTTax rate if that item is having GSTTaxRate
        for (let taxRatesData in ConstantMessages.GSTTaxRate) { // if item price is 100 and gst tax applied to it is 5% then the CGST and SGST will be (100*0.05)/2 and if tax inclusive is on the the tax calculation will be (100*5)/(100+5)/2 
          if (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID == taxSlabColumns[TaxNumber]) {
            purchaseItems.TaxSlabData = ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID;
            if (purchaseItems.isPurchasePriceTaxInclusive) {
              purchaseItems.TaxSlabCGST = purchaseItems.TaxSlabCGST + (((purchaseItems.purchasePrice * (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100)) / (100 + (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100))) / 2);
              purchaseItems.TaxSlabSGST = purchaseItems.TaxSlabSGST + purchaseItems.TaxSlabCGST;
              purchaseItems.tax += (2 * purchaseItems.TaxSlabCGST);
            } else {
              purchaseItems.TaxSlabCGST = purchaseItems.TaxSlabCGST + ((purchaseItems.purchasePrice * ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue) / 2);
              purchaseItems.TaxSlabSGST = purchaseItems.TaxSlabSGST + purchaseItems.TaxSlabCGST;
              purchaseItems.tax += (2 * purchaseItems.TaxSlabCGST);
            }
          }
        }
        //calculate the IGSTTax rate if that item is having IGSTTaxRate
        for (let taxRatesData in ConstantMessages.IGSTTaxRate) { // if item price is 100 and gst tax applied to it is 5% then the CGST and SGST will be (100*0.05)/2 and if tax inclusive is on the the tax calculation will be (100*5)/(100+5) 
          if (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID == taxSlabColumns[TaxNumber]) {
            purchaseItems.TaxSlabIGSTData = ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID;
            if (purchaseItems.isPurchasePriceTaxInclusive) {
              purchaseItems.TaxSlabIGST = purchaseItems.TaxSlabIGST + (((purchaseItems.purchasePrice * (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100)) / (100 + (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100))));
              purchaseItems.tax += (purchaseItems.TaxSlabIGST)
            } else {
              purchaseItems.TaxSlabIGST = purchaseItems.TaxSlabIGST + (purchaseItems.purchasePrice * ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue);
              purchaseItems.tax += (purchaseItems.TaxSlabIGST)
            }
          }
        }
        //calculate the OTHER rate if that item is having OTHERTaxRate
        if (taxSlabColumns[TaxNumber] > 16) {
          purchaseItems.TaxSlabCESSData = taxSlabColumns[TaxNumber];
          purchaseItems.TaxSlabOtherData = 10000;
        }
      }
      //calculate the OTHER rate if that item is having OTHERTaxRate
      if (purchaseItems.TaxSlabOtherData == 10000) {
        if (purchaseItems.isPurchasePriceTaxInclusive) {
          purchaseItems.TaxSlabCESS = purchaseItems.TaxSlabCESS + (((purchaseItems.purchasePrice * (taxRates[purchaseItems.TaxSlabCESSData - 1].TaxSlabValue * 100)) / (100 + (taxRates[purchaseItems.TaxSlabCESSData - 1].TaxSlabValue * 100))));
          purchaseItems.tax += (purchaseItems.TaxSlabCESS);
        } else {
          purchaseItems.TaxSlabCESS = purchaseItems.TaxSlabCESS + (purchaseItems.purchasePrice * taxRates[purchaseItems.TaxSlabCESSData - 1].TaxSlabValue);
          purchaseItems.tax += (purchaseItems.TaxSlabCESS);
        }
      }

      return purchaseItems;
    })
  }

}
