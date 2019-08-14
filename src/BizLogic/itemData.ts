import { Injectable } from '@angular/core';
import { ProductItemsData } from '../Services/productItemsData.service';
import { ToasterService } from '../Services/toastMessage.service';
import { IProductItemsData, IProductItemsFooterData, IAnalyticsData } from '../Model/productItemsData.model';
import { ValidationHelper } from '../Utilities/Validator';
import { WindowRef } from '../Utilities/WindowRef';
import { ConstMessages } from '../Constants/ErrorMessages';
import { ErrorLogService } from '../Services/errorLog.service';
import { ITaxSlabs } from '../Model/taxSlabs.model';
import { TaxSlabs } from '../Services/taxSlabs.service';
import { ConstantMessages } from '../Constants/constant';
import { SalesInvoiceItems } from '../Services/salesInvoiceItems.service';
import { PartyData } from '../Services/party.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AllItems {
    updatedItem: any;
    itemList: IProductItemsData[] = [];
    itemData: IProductItemsData[] = [];
    footerData: IProductItemsFooterData = null;
    items: any;
    cartItems: IProductItemsData[];
    validator = new ValidationHelper();
    previousId = -1; // for out of stock item check
    previousTotalBillDiscount = -1;
    AnalyticsData: IAnalyticsData;
    receivedItemIDs: number[] = [];

    // tslint:disable-next-line:max-line-length
    constructor(private productItemsData: ProductItemsData, private toastr: ToasterService, private partyData: PartyData,
                private winRef: WindowRef, private salesInvoiceItems: SalesInvoiceItems,
                public logService: ErrorLogService, private taxSlabs: TaxSlabs, private translateService: TranslateService) {
        this.cartItems = [];
        this.setFooterDataToDefault();
        console.log('Footer Data in BizLogic...'); console.log(this.footerData);
    }

    ionViewDidEnter() {
        console.log('ionViewDidLoad AllItemsPage');
    }

    /* Methods used in both cart items page and product list page */
    // To Fetch the item list array form the service json
    async getItemsFromDB(receivedItemIDs: number[], key: number) {
        return await this.productItemsData.getProductItemsData(receivedItemIDs, key).then(
            (response) => {
                if (!receivedItemIDs.length && null === key) {
                    this.itemData = response;
                    console.log('Received All Items array from DB in BizLogic...');
                    console.log(this.itemData);
                    return this.itemData;
                } else {
                    console.log('Received response from DB in BizLogic...');
                    console.log(response);
                    return response;
                }
            }
        );
    }

    // To push all the items into all items array on Product List page if the categories are disabled in app settings
    async getAllItems(receivedItemIDs: number[], key: number) {
        if (0 === this.itemList.length || (!receivedItemIDs.length && null === key)) {
            await this.getItemsFromDB(receivedItemIDs, key).then((res) => {
                this.itemList = res;
                for (const item of this.itemList) { this.receivedItemIDs.push(item.id); }
                this.getFooterData(); // Resetting Footer to avoid previous session data
                console.log('Item List in BizLogic at present...'); console.log(this.itemList);
            });
        }
        return await this.itemList;
    }

    // To push items into all items array on Product List page based on the category selected
    async getItemsList(categoryID: number, receivedItemIDs: number[], key: number) {
        if (!receivedItemIDs.length && null === key) {
            if (0 === this.itemList.length) {
                await this.getItemsFromDB(receivedItemIDs, key).then((res) => {
                    this.itemList = res;
                    console.log('Item List in BizLogic at present...'); console.log(this.itemList);
                });
            }
            return await this.itemList.filter((item) => item.categoryId === categoryID);
        } else {
            return await this.productItemsData.getCategoryItems(categoryID, receivedItemIDs, key).then((response) => {
                console.log('Received response from DB in BizLogic...');
                console.log(response);
                return response;
            });
        }
    }

    // To add new item in product list
    async addNewItemToList() {
        // Getting newItem array from db added in last row
        return await this.productItemsData.getNewProduct().then((res) => {
            for (const item of this.itemList) { // Comparing id of initial value id's with newItem id to avoid duplications
                if (item.id === res.id) { return; }
            }
            this.itemList.push(res); // Pushing new item array object to itemList
            this.receivedItemIDs.push(res.id); // Adding the item id of the new item added to item list, to avoid duplication in list
            return this.itemList;
        });

    }

    // Get product item data by id to be sent to new item page
    async getItemToEdit(id, categoryId) {
        if (undefined === this.itemList) {
            this.itemList = [];
            await this.getItemsList(categoryId, [], null).then(res => console.log(res));
        }
        for (const i in this.itemList) {
            if (id === this.itemList[i].id) {
                return await this.itemList[i];
            }
        }
    }

    // To update the product item data received from new item page
    async updateItemInList(item: IProductItemsData) {
        if (null !== item && undefined !== item) {
            for (const i in this.itemList) {
                // Comparing id of initial value id's with newItem id to avoid duplications
                if (item.id === this.itemList[i].id) {
                    // Updating the required fields in itemList array so that current state of session is maintained
                    this.itemList[i].categoryId = item.categoryId;
                    this.itemList[i].name = item.name;
                    this.itemList[i].imagePath = item.imagePath;
                    this.itemList[i].ItemImageString = item.ItemImageString;
                    this.itemList[i].ItemImageCss = item.ItemImageCss;
                    this.itemList[i].purchasePrice = item.purchasePrice;
                    this.itemList[i].sellingPrice = item.sellingPrice;
                    this.itemList[i].discountedPrice = item.sellingPrice;
                    this.itemList[i].sellingPriceDuplicate = item.sellingPrice;
                    this.itemList[i].TaxSlabID1 = item.TaxSlabID1;
                    this.itemList[i].TaxSlabID2 = item.TaxSlabID2;
                    this.itemList[i].TaxSlabID3 = item.TaxSlabID3;
                    this.itemList[i].TaxSlabID4 = item.TaxSlabID4;
                    this.itemList[i].TaxSlabValue1 = item.TaxSlabValue1;
                    this.itemList[i].TaxSlabValue2 = item.TaxSlabValue2;
                    this.itemList[i].TaxSlabValue3 = item.TaxSlabValue3;
                    this.itemList[i].TaxSlabValue4 = item.TaxSlabValue4;
                    this.itemList[i].weight = item.weight;
                    this.itemList[i].weightUnit = item.weightUnit;
                    this.itemList[i].brand = item.brand;
                    this.itemList[i].HSN_SAC = item.HSN_SAC;
                    this.itemList[i].currentStock = item.currentStock;
                    this.itemList[i].MinStockNotification = item.MinStockNotification;
                    this.itemList[i].description = item.description;
                    this.itemList[i].ItemMeasurementMasterID = item.ItemMeasurementMasterID;
                    this.itemList[i].barCode = item.barCode;
                    this.itemList[i].isMaintainStock = item.isMaintainStock;
                    this.itemList[i].isSellingPriceTaxInclusive = item.isSellingPriceTaxInclusive;
                    this.itemList[i].isPurchasePriceTaxInclusive = item.isPurchasePriceTaxInclusive;
                    this.itemList[i].maximumRetailPrice = item.maximumRetailPrice;
                    this.itemList[i].customQuantityFlag = item.customQuantityFlag;
                    break;
                }
            }
            return item;
        }
    }

    // To push items into cart items array if there count is updated
    getCartItems() {
        for (const i in this.itemList) {
            if ((this.itemList[i].count > 0) && (!this.isItemAlreadyInCart(this.itemList[i].id))) {
                this.cartItems.push(this.itemList[i]);
            }
        }
        return this.cartItems;
    }

    // To check if the item is already in cart; if not then only we push the item to cart items array
    isItemAlreadyInCart(id): boolean {
        if (undefined === this.cartItems || null == this.cartItems) { this.cartItems = []; }
        for (const i in this.cartItems) {
            if (id === this.cartItems[i].id) {
                return true; // Item present in cart
            }
        }
        return false; // Item not in cart
    }

    // To check if the item is already in list; if not then only we push the item into the list
    isItemsAlreadyInList(id, item): boolean {
        for (const i in item) {
            if (id === item[i].id) {
                return true; // Item present in list
            }
        }
        return false; // Item not in list
    }

    // To fetch the footerData array from the service json
    getFooterData() {
        if (undefined === this.footerData || null === this.footerData) { this.setFooterDataToDefault(); }
        return this.footerData;
    }

    /* Implementing Search bar functionality on Product List and Cart Items Pages */

    // To get the search bar results to find items in product list and cart items page
    getItems(ev: any) {

        // set val to the value of the search bar
        const val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            this.items = this.items.filter((item) => {
                return (item.name.toLowerCase().indexOf(val.trim().toLowerCase()) >= 0);
            });
        }
    }

    /* Cart Items Page Methods */

    // Adds new item to cart once the item count is incremented
    addItemToCart(id) {
        for (const i in this.itemList) {
            // first time when user click on any product then to show toast message(added to cart
            if (this.itemList[i].count >= 0 && !this.itemList[i].addToCart && id === this.itemList[i].id && this.itemList[i].mainStock) {
                this.itemList[i].addToCart = true;
                this.translateService.get('added to cart!').subscribe(ItemaddedToCart => {
                    const msg = this.itemList[i].name + ItemaddedToCart;
                    this.toastr.success(msg);
                });
            }
        }
    }

    // Removes the item from cart if the count is zero again
    removeItemFromCart(id) {
        for (const i in this.itemList) {
            if (id === this.itemList[i].id && this.itemList[i].count < 1) {
                this.itemList[i].addToCart = false;
                this.removeItem(this.itemList[i].id, false);
                //  let msg = this.itemList[i].name + " removed from cart!";
                // this.toastr.warning(msg);
            }
        }
    }

    // To update the count for a particular item and update the Footer Values (Total Bill Data)
    updateItemValues(item: IProductItemsData, countToastMessage: number) {
        if (item.id !== this.previousId) {
            this.previousId = item.id;
        } else if (item.currentStock <= item.MinStockNotification) {
            countToastMessage = countToastMessage + 1;
        }
        if (item.currentStock > 0 && item.currentStock < 1 && item.isMaintainStock && item.mainStock) {
            item.count += item.currentStock;
            this.footerData.totalItemsAdded += item.currentStock;
            if (item.discountedPrice !== item.sellingPrice) {
                this.footerData.totalBillPrice += item.discountedPrice * item.currentStock;
            } else {
                this.footerData.totalBillPrice += item.sellingPrice * item.currentStock;
            }
            item.currentStock = 0;
        }
        if ((item.currentStock >= 1 || (item.isNegativeStockAllowed && item.currentStock <= 0)) && item.isMaintainStock && item.mainStock) {
            item.count += 1;
            item.currentStock -= 1;
            this.footerData.totalItemsAdded += 1;
            if (item.discountedPrice !== item.sellingPrice) {
                this.footerData.totalBillPrice += item.discountedPrice;
            } else {
                this.footerData.totalBillPrice += item.sellingPrice;
            }
            if (item.currentStock < 1 && !item.isNegativeStockAllowed) {
                const msg = item.name + ' is Out of Stock';
                this.toastr.warning(msg);
            } else if (item.currentStock <= item.MinStockNotification && item.isMaintainStock && !item.isNegativeStockAllowed) {
                const msg = 'Stock is low for ' + item.name;
                if (countToastMessage === 0) {
                    this.toastr.warning(msg);
                    countToastMessage += 1;
                }
            }
            item.count = Number(item.count.toFixed(2));
            item.currentStock = Number(item.currentStock.toFixed(2));
            this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            return;
        } else {
            if (!item.isMaintainStock) {
                item.mainStock = true;
                item.count += 1;
                this.footerData.totalItemsAdded += 1;
                if (item.discountedPrice !== item.sellingPrice) {
                    this.footerData.totalBillPrice += item.discountedPrice;
                } else {
                    this.footerData.totalBillPrice += item.sellingPrice;
                }
                item.count = Number(item.count.toFixed(2));
                this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
                return;
            }
        }
    }

    // To set the flag for mainStock to false in case the current stock of a item is zero
    async onItemOutOfStock(item: IProductItemsData, countToastMessage: number) {
        if (item.id !== this.previousId) { this.previousId = item.id; } else { countToastMessage = countToastMessage + 1; }
        // To show message if user click on any out of stock product
        if (undefined === countToastMessage || null == countToastMessage) {
            countToastMessage = 0;
        }
        if (item.currentStock <= 0 && item.isMaintainStock && !item.isNegativeStockAllowed) {
            console.log('Maintain stock value: ' + item.isMaintainStock);
            console.log('Maintain stock value: ' + item.currentStock);
            if (!item.mainStock || 0 >= item.count) {
                this.outOfStockItemAlert(item, 1, 'ItemClicked');
            } // Show alert message to user if stock for item is zero, and negative stock is not allowed for item
            item.mainStock = false;
            if (countToastMessage === 0) {
                const msg = item.name + ' is Out of Stock';
                countToastMessage = countToastMessage + 1;
                this.toastr.warning(msg);
            }
        } else if (item.currentStock > 0 && item.isMaintainStock) {
            item.mainStock = true;
        } else if (!item.isMaintainStock) {
            item.mainStock = true;
        }
    }

    // To show the count upon the item is clicked once
    showCount(item: IProductItemsData, countToastMessage: number) {
        this.updateItemValues(item, countToastMessage);
    }


    // when user update the count for the particular item
    onItemCountClickedSwipe(id, ItemPresent) {
        const countToastMessage = 0;
        // tslint:disable-next-line:forin
        for (const i in this.itemList) {
            if (id === this.itemList[i].id && this.itemList[i].isMaintainStock) {
                if (this.itemList[i].count < 1 && this.itemList[i].count > 0) {
                    this.itemList[i].currentStock += this.itemList[i].count;
                    this.footerData.totalItemsAdded -= this.itemList[i].count;
                    this.itemList[i].count = 0;
                } else {
                    this.itemList[i].count -= 1;
                    if (ItemPresent) {
                        if (this.itemList[i].RemainingCount > 0) {
                            this.itemList[i].RemainingCount -= 1;
                        } else {
                            this.itemList[i].currentStock += 1;
                        }
                    } else {
                        this.itemList[i].currentStock += 1;
                    }

                    this.footerData.totalItemsAdded -= 1;
                }
                if (!this.itemList[i].mainStock) {
                    this.onItemOutOfStock(this.itemList[i], countToastMessage);
                }
                if (this.itemList[i].discountedPrice !== this.itemList[i].sellingPrice) {
                    this.footerData.totalBillPrice -= this.itemList[i].discountedPrice;
                } else {
                    this.footerData.totalBillPrice -= this.itemList[i].sellingPrice;
                }
                // tslint:disable-next-line:max-line-length
                if (this.itemList[i].count === 0 && this.cartItems.length) { // if count is zero then reset the discounted price to the original price
                    for (const item of this.cartItems) {
                        if (item.id === this.itemList[i].id) {
                            // tslint:disable-next-line:max-line-length
                            if (item.sellingPriceDuplicate !== undefined && item.sellingPriceDuplicate != null && item.sellingPriceDuplicate >= 0) {
                                this.itemList[i].discountedPrice = this.itemList[i].sellingPriceDuplicate;
                                this.itemList[i].discount = this.itemList[i].maximumRetailPrice - this.itemList[i].discountedPrice;
                            }
                        }
                    }
                }
                return;
            } else {
                if (id === this.itemList[i].id) {
                    if (this.itemList[i].count < 1 && this.itemList[i].count > 0) {
                        this.footerData.totalItemsAdded -= this.itemList[i].count;
                        this.itemList[i].count = 0;
                    } else {
                        this.itemList[i].count -= 1;
                        this.footerData.totalItemsAdded -= 1;
                    }
                    if (this.itemList[i].discountedPrice !== this.itemList[i].sellingPrice) {
                        this.footerData.totalBillPrice -= this.itemList[i].discountedPrice;
                    } else {
                        this.footerData.totalBillPrice -= this.itemList[i].sellingPrice;
                    }
                    return;
                }
            }
            this.itemList[i].count = Number(this.itemList[i].count.toFixed(2));
        }
        this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
    }

    // Creating AlertControl Box for updating the count of an item in Cart Item page
    onItemCountClicked(id, itemCountPresent) {
        let index = 0;
        console.log('Item ID Received is: ' + id);
        for (const i in this.itemList) {
            if (this.itemList[i].id === id) {
                index = this.itemList.indexOf(this.itemList[i]);
                console.log('Alert Box created for ID: ' + this.itemList[i].id);
                break;
            }
        }

        this.translateService.get('countValue').subscribe(ConvertedData => {

            // const alert = this.alertCtrl.create({
            //     title: this.itemList[index].name,
            //     inputs: [
            //         {
            //             name: ConvertedData.countValue,
            //             type: 'number',
            //             value: this.countValue(id, this.itemList)
            //         }
            //     ],
            //     buttons: [
            //         {
            //             text: '+',
            //             role: 'increaseCountValue',
            //             handler: data => {
            //                 console.log('Item ID is: ' + this.itemList[index].id);
            // tslint:disable-next-line:max-line-length
            //                 if (this.itemList[index].currentStock <= 0 && !this.itemList[index].isNegativeStockAllowed && this.itemList[index].isMaintainStock) {
            // tslint:disable-next-line:max-line-length
            //                     if (this.itemList[index].currentStock < 0 || !this.itemList[index].mainStock) { this.outOfStockItemAlert(this.itemList[index], 1, 'ItemCountClicked'); } else {
            //                         this.itemList[index].mainStock = false;
            //                         const msg = 'Out of stock ' + this.itemList[index].name;
            //                         this.toastr.warning(msg);
            //                     }
            // tslint:disable-next-line:max-line-length
            //                 } else if (this.itemList[index].currentStock <= this.itemList[index].MinStockNotification && this.itemList[index].currentStock > 1 && this.itemList[index].isMaintainStock && !this.itemList[index].isNegativeStockAllowed) {
            //                     const msg = 'Stock is low for ' + this.itemList[index].name;
            //                     this.toastr.warning(msg);
            //                 }
            // tslint:disable-next-line:max-line-length
            //                 if (this.itemList[index].count > 0 && this.itemList[index].isMaintainStock && (this.itemList[index].currentStock > 0 || (this.itemList[index].isNegativeStockAllowed && this.itemList[index].currentStock <= 0))) {
            //                     this.itemList[index].count += 1;
            //                     this.event.publish('+');
            //                     this.itemList[index].currentStock -= 1;
            //                     data.countValue = this.countValue(id, this.itemList);
            //                     this.footerData.totalBillPrice += this.itemList[index].discountedPrice;
            //                     this.footerData.totalItemsAdded += 1;
            //                     if (this.itemList[index].currentStock <= 0 && !this.itemList[index].isNegativeStockAllowed) {
            // tslint:disable-next-line:max-line-length
            //                         if (this.itemList[index].currentStock < 0 || !this.itemList[index].mainStock) { this.outOfStockItemAlert(this.itemList[index], 1, 'ItemCountClicked'); } else {
            //                             this.itemList[index].mainStock = false;
            //                             const msg = 'Out of stock ' + this.itemList[index].name;
            //                             this.toastr.warning(msg);
            //                         }
            //                     }
            //                 }
            //                 if (this.itemList[index].count > 0 && !this.itemList[index].isMaintainStock) {
            //                     this.itemList[index].count += 1;
            //                     this.event.publish('+');
            //                     data.countValue = this.countValue(id, this.itemList);
            //                     this.footerData.totalBillPrice += this.itemList[index].discountedPrice;
            //                     this.footerData.totalItemsAdded += 1;
            //                 }
            //                 if (this.itemList[index].count === 0) {
            //                     this.itemList[index].count += 1;
            //                     this.event.publish('+');
            //                     this.itemList[index].currentStock -= 1;
            //                     this.addItemToCart(this.itemList[index].id);
            //                     data.countValue = this.countValue(id, this.itemList);
            //                     this.footerData.totalBillPrice += this.itemList[index].discountedPrice;
            //                     this.footerData.totalItemsAdded += 1;
            //                 }
            //                 this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                 this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                 return false;
            //             }
            //         },
            //         {
            //             text: '-',
            //             role: 'decreaseCountValue',
            //             handler: data => {
            //                 console.log('Item ID is: ' + this.itemList[index].id);
            //                 if (this.itemList[index].count > 0 && this.itemList[index].isMaintainStock) {
            //                     this.itemList[index].count -= 1;
            //                     this.event.publish('-');
            //                     if (itemCountPresent) {
            // tslint:disable-next-line:max-line-length
            //                         if (this.itemList[index].RemainingCount > 0) { this.itemList[index].RemainingCount -= 1; } else { this.itemList[index].currentStock += 1; }
            //                     } else {
            //                         this.itemList[index].currentStock += 1;
            //                     }
            //                     if (!this.itemList[index].mainStock) { this.itemList[index].mainStock = true; }
            //                     data.countValue = this.countValue(id, this.itemList);
            //                     if (this.footerData.totalItemsAdded > 0) {
            //                         this.footerData.totalBillPrice -= this.itemList[index].discountedPrice;
            //                         this.footerData.totalItemsAdded -= 1;
            //                     }
            //                 }
            //                 if (this.itemList[index].count > 0 && !this.itemList[index].isMaintainStock) {
            //                     this.itemList[index].count -= 1;
            //                     this.event.publish('-');
            //                     if (!this.itemList[index].mainStock) { this.itemList[index].mainStock = true; }
            //                     data.countValue = this.countValue(id, this.itemList);
            //                     if (this.footerData.totalItemsAdded > 0) {
            //                         this.footerData.totalBillPrice -= this.itemList[index].discountedPrice;
            //                         this.footerData.totalItemsAdded -= 1;
            //                     }
            //                 }
            //                 if (this.itemList[index].count === 0) {
            //                     this.removeItemFromCart(id);
            //                 }
            //                 this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                 this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                 return false;

            //             }
            //         },
            //         {
            //             text: 'Ok',
            //             role: 'setCountValue',
            //             handler: data => {
            //                 const alterControlValue = this.winRef.nativeWindow.document.getElementsByClassName('alert-input');
            //                 if (alterControlValue.length) {
            //                     if (data.countValue !== alterControlValue[0].value) { data.countValue = alterControlValue[0].value; }
            //                 }
            //                 console.log('Item ID is: ' + this.itemList[index].id);
            // tslint:disable-next-line:max-line-length
            //                 const isStockLimitExceeded: boolean = ((Number(data.countValue) - this.itemList[index].currentStock - this.itemList[index].count) > 0);
            // tslint:disable-next-line:max-line-length
            //                 const isStockLow: boolean = ((Number(data.countValue) - this.itemList[index].MinStockNotification - this.itemList[index].count) > 0);
            // tslint:disable-next-line:max-line-length
            //                 const isStockVerify: boolean = ((Number(data.countValue) - this.itemList[index].currentStock - this.itemList[index].count) === 0);
            // tslint:disable-next-line:max-line-length
            //                 const isNegativeStockAllowedForAlertBox: boolean = ((Number(data.countValue) - this.itemList[index].currentStock - this.itemList[index].count) >= 0);
            //                 if (data.countValue == null || data.countValue === '') {
            //                     // no value entered
            // tslint:disable-next-line:max-line-length
            //                     if (isStockLow && !isStockVerify && this.itemList[index].isMaintainStock && !this.itemList[index].isNegativeStockAllowed) {
            // tslint:disable-next-line:max-line-length
            //                         const msg = 'Stock is low for ' + this.itemList[index].name + '. You can only add ' + this.itemList[index].currentStock + ' more items..';
            //                         this.toastr.warning(msg);
            //                     }
            // tslint:disable-next-line:max-line-length
            //                     if (isStockLimitExceeded && this.itemList[index].isMaintainStock && !this.itemList[index].isNegativeStockAllowed) {
            // tslint:disable-next-line:max-line-length
            //                         const msg = 'Stock Limit Exceeded. You can only add ' + this.itemList[index].currentStock + ' more items..';
            //                         this.toastr.error(msg);
            // tslint:disable-next-line:max-line-length
            //                         this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_STOCK, '; SRC -BizLogic Class:AllItems method:onItemCountClicked', msg);
            //                         this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                         this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                         return false;
            //                     } else if (this.itemList[index].count >= 0) {
            //                         data.countValue = this.countValue(id, this.itemList);
            //                         this.toastr.info('Item Count updated');
            //                         this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                         this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                         return true;
            //                     } else if (this.itemList[index].count === 0) {
            //                         this.removeItemFromCart(id);
            //                         this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                         this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                         return true;
            //                     }

            // tslint:disable-next-line:max-line-length
            //                 } else if (this.validator.isValidNumericValue(data.countValue) && Number(data.countValue) >= 0 && this.itemList[index].isMaintainStock) {
            //                     // valid value entered
            //                     if (!Number.isInteger(Number(data.countValue))) {
            //                         this.translateService.get('Please enter the correct Quantity').subscribe(ToastMessage => {
            //                             this.toastr.warning(ToastMessage);
            //                         });
            //                         // suggested by akanksha
            //                         return false;
            //                     }
            //                     if (isNegativeStockAllowedForAlertBox && !this.itemList[index].isNegativeStockAllowed) {
            //                         this.outOfStockItemAlert(this.itemList[index], Number(data.countValue), 'ItemCountClicked');
            //                         return true;
            //                     }
            // tslint:disable-next-line:max-line-length
            //                     if (isStockLow && !isStockVerify && this.itemList[index].isMaintainStock && !this.itemList[index].isNegativeStockAllowed) {
            // tslint:disable-next-line:max-line-length
            //                         const msg = 'Stock is low for ' + this.itemList[index].name + '. You can only add ' + this.itemList[index].currentStock + ' more items..';
            //                         this.toastr.warning(msg);
            //                     }
            //                     if (isStockVerify && !this.itemList[index].isNegativeStockAllowed) {
            //                         const msg = 'Out of stock ' + this.itemList[index].name;
            //                         this.toastr.warning(msg);
            //                         this.itemList[index].mainStock = false;
            //                     }
            //                     if (this.itemList[index].count === 0) {
            //                         this.removeItemFromCart(id);
            //                         this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                         this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                         return true;
            //                     }
            // tslint:disable-next-line:max-line-length
            //                     if (isStockLimitExceeded && this.itemList[index].isMaintainStock && !this.itemList[index].isNegativeStockAllowed) {
            // tslint:disable-next-line:max-line-length
            //                         const msg = 'Stock Limit Exceeded. You can only add ' + this.itemList[index].currentStock + ' more items..';
            //                         this.toastr.error(msg);
            // tslint:disable-next-line:max-line-length
            //                         this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_STOCK, '; SRC -BizLogic Class:AllItems method:onItemCountClicked', msg);
            //                         this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                         this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                         return false;
            //                     } else {
            //                         if (isStockVerify && !this.itemList[index].isNegativeStockAllowed) {
            //                             this.itemList[index].mainStock = false;
            //                         } else {
            //                             this.itemList[index].mainStock = true;
            //                         }
            //                     }
            //                     data.countValue = Number(data.countValue);
            //                     if (Number(data.countValue) > this.itemList[index].count) {
            //                         if (isStockLimitExceeded && !this.itemList[index].isNegativeStockAllowed) {
            //                             console.log('count Value and Current Stock remains the same');
            //                         } else {
            // tslint:disable-next-line:max-line-length
            //                             this.footerData.totalBillPrice += (data.countValue - this.itemList[index].count) * this.itemList[index].discountedPrice;
            //                             this.footerData.totalItemsAdded += (data.countValue - this.itemList[index].count);
            //                             this.itemList[index].currentStock -= (Number(data.countValue) - this.itemList[index].count);
            //                             if (this.itemList[index].currentStock === 0 && !this.itemList[index].isNegativeStockAllowed) {
            //                                 this.itemList[index].mainStock = false;
            //                             }
            //                         }
            // tslint:disable-next-line:max-line-length
            //                     } else if (data.countValue === this.itemList[index].count) { this.itemList[index].currentStock += (this.itemList[index].count - Number(data.countValue)); } else {
            //                         if (this.footerData.totalItemsAdded >= 0) {
            //                             if (itemCountPresent) {
            // tslint:disable-next-line:max-line-length
            //                                 if (this.itemList[index].RemainingCount > 0 && this.itemList[index].RemainingCount > (this.itemList[index].count) - Number(data.countValue)) {
            // tslint:disable-next-line:max-line-length
            //                                     this.itemList[index].RemainingCount -= (this.itemList[index].count - Number(data.countValue));
            // tslint:disable-next-line:max-line-length
            //                                 } else if (this.itemList[index].RemainingCount > 0 && this.itemList[index].RemainingCount < (this.itemList[index].count) - Number(data.countValue)) {
            // tslint:disable-next-line:max-line-length
            //                                     this.itemList[index].currentStock += (this.itemList[index].count - Number(data.countValue) - this.itemList[index].RemainingCount);
            //                                     this.itemList[index].RemainingCount = 0;
            //                                 } else {
            // tslint:disable-next-line:max-line-length
            //                                     this.itemList[index].currentStock += (this.itemList[index].count - Number(data.countValue));
            //                                 }
            //                             } else {
            //                                 this.itemList[index].currentStock += (this.itemList[index].count - Number(data.countValue));
            //                             }
            // tslint:disable-next-line:max-line-length
            //                             this.footerData.totalBillPrice -= (this.itemList[index].count - data.countValue) * this.itemList[index].discountedPrice;
            //                             this.footerData.totalItemsAdded -= (this.itemList[index].count - data.countValue);
            //                             if (data.countValue === 0) {
            //                                 this.itemList[index].count = 0;
            //                                 this.removeItemFromCart(id);
            //                                 this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                                 this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                                 return true;
            //                             }
            //                         }
            //                     }
            //                     this.itemList[index].count = Number(data.countValue);
            //                     this.translateService.get('Item Count updated').subscribe(ToastMessage => {
            //                         this.toastr.info(ToastMessage);
            //                     });

            //                     this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                     this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                     return true;
            // tslint:disable-next-line:max-line-length
            //                 } else if (this.validator.isValidNumericValue(data.countValue) && Number(data.countValue) >= 0 && !this.itemList[index].isMaintainStock) {
            //                     data.countValue = Number(data.countValue);
            //                     if (!Number.isInteger(Number(data.countValue))) {
            //                         this.translateService.get('Please enter the correct Quantity').subscribe(ToastMessage => {
            //                             this.toastr.warning(ToastMessage); // suggested by akansha
            //                         });

            //                         return false;
            //                     }
            //                     if (data.countValue > this.itemList[index].count) {
            // tslint:disable-next-line:max-line-length
            //                         this.footerData.totalBillPrice += (data.countValue - this.itemList[index].count) * this.itemList[index].discountedPrice;
            //                         this.footerData.totalItemsAdded += (data.countValue - this.itemList[index].count);
            //                     } else if (data.countValue === this.itemList[index].count) { } else {
            //                         if (this.footerData.totalItemsAdded >= 0) {
            // tslint:disable-next-line:max-line-length
            //                             this.footerData.totalBillPrice -= (this.itemList[index].count - data.countValue) * this.itemList[index].discountedPrice;
            //                             this.footerData.totalItemsAdded -= (this.itemList[index].count - data.countValue);
            //                             if (data.countValue === 0) {
            //                                 this.itemList[index].count = 0;
            //                                 this.removeItemFromCart(id);
            //                                 this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                                 this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                                 return true;
            //                             }
            //                         }
            //                     }
            //                     this.itemList[index].count = Number(data.countValue);
            //                     this.translateService.get('Item Count updated').subscribe(ToastMessage => {
            //                         this.toastr.info(ToastMessage);
            //                     });

            //                     this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                     this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                     return true;
            //                 } else {
            //                     // invalid value entered
            //                     this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_COUNT_FAILED).subscribe(ToastMessage => {
            //                         this.toastr.error(ToastMessage);
            //                     });

            // tslint:disable-next-line:max-line-length
            //                     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_STOCK_COUNT, '; SRC -BizLogic Class:AllItems method:onItemCountClicked', ConstMessages.ErrorCode.ERROR_ITEM_COUNT_FAILED);
            //                     this.itemList[index].count = Number(this.itemList[index].count.toFixed(2));
            //                     this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
            //                     return false;
            //                 }
            //             }
            //         }
            //     ],
            //     cssClass: 'countAlertStyler'
            // });

            // alert.present();
        });
    }

    // Deleting the item from the cartItems array, presently used
    removeItem(id, ItemPresent) {
        // tslint:disable-next-line:forin
        for (const i in this.cartItems) {
            if (this.cartItems[i].id === id) {
                const index: number = this.cartItems.indexOf(this.cartItems[i]);
                // presenting toast for item removal
                const msg = this.cartItems[i].name + ' removed from cart!';
                this.toastr.warning(msg);
                // Updating footer
                if ((this.footerData.totalItemsAdded - this.cartItems[i].count) >= 0) {
                    this.footerData.totalBillPrice -= (this.cartItems[i].count * this.cartItems[i].discountedPrice);
                    this.footerData.totalItemsAdded -= this.cartItems[i].count;
                }
                if (ItemPresent) {
                    if (this.cartItems[i].RemainingCount > 0) {
                        if (this.cartItems[i].RemainingCount > this.cartItems[i].count) {
                            this.cartItems[i].RemainingCount -= this.cartItems[i].count;
                        } else {
                            // Setting the item count in products page to zero in case the item is to be re-added
                            this.cartItems[i].currentStock += this.cartItems[i].count - this.cartItems[i].RemainingCount;
                            this.cartItems[i].RemainingCount = 0;
                        }
                    } else {
                        // Setting the item count in products page to zero in case the item is to be re-added
                        this.cartItems[i].currentStock += this.cartItems[i].count;
                    }
                } else {
                    // Setting the item count in products page to zero in case the item is to be re-added
                    this.cartItems[i].currentStock += this.cartItems[i].count;
                }

                //  this.cartItems[i].MinStockNotification += this.cartItems[i].count;
                this.cartItems[i].count = 0;
                // Setting cart add to false in case the item is to be re-added
                if (this.cartItems[i].addToCart === true) {
                    this.cartItems[i].addToCart = false;
                }
                // tslint:disable-next-line:max-line-length
                if (this.cartItems.length && this.cartItems[i].sellingPriceDuplicate !== undefined && this.cartItems[i].sellingPriceDuplicate != null && this.cartItems[i].sellingPriceDuplicate >= 0) {
                    this.cartItems[i].discountedPrice = this.cartItems[i].sellingPriceDuplicate;
                    this.cartItems[i].discount = this.cartItems[i].maximumRetailPrice - this.cartItems[i].discountedPrice;
                }
                // Updating the item values to default on Groceries Page
                this.onCartItemRemoved(this.cartItems[i].id);

                // Removing item from cart
                // this.cartItems = this.cartItems.filter(item => {  console.log(this.cartItems[i]); return item.id != id});
                this.cartItems.splice(index, 1); console.log('After Splicing Cart Array...'); console.log(this.cartItems);
                // Cleaning Footer Data if Cart is Empty...
                if (0 === this.cartItems.length) {
                    // Emptying all the data on Total Bill Page and setting it to Default footer Values
                    this.setFooterDataToDefault();
                    // Creating an event to show footer in case an item is added to cart again...
                    // this.event.publish('refreshFooter');
                }
            }
            this.itemList[i].count = Number(this.itemList[i].count.toFixed(2));
        }
        this.footerData.totalBillPrice = Number(this.footerData.totalBillPrice.toFixed(2));
    }

    // Setting up the count of item to zero in case the item is deleted from cart
    onCartItemRemoved(id) {
        for (const i in this.cartItems) {
            if (this.itemList[i].id === id && this.itemList[i].mainStock) {
                this.itemList[i].currentStock += this.itemList[i].count;
                //   this.itemList[i].MinStockNotification += this.itemList[i].count;
                this.itemList[i].count = 0;
                this.itemList[i].discount = 0;
                this.itemList[i].discountedPrice = this.itemList[i].discountedPrice;
                if (this.itemList[i].addToCart === true) {
                    this.itemList[i].addToCart = false;
                }
            }
        }
    }

    // To show the Updated Count Value of an item in Alert Box
    countValue(id, item: IProductItemsData[]): string {
        for (const i in item) {
            if (item[i].id === id) {
                const count: number = item[i].count;
                // this.event.subscribe('+', () => {
                //     count += 1;
                // });
                // this.event.subscribe('-', () => {
                //     count -= 1;
                // });

                const alterControlInput = this.winRef.nativeWindow.document.getElementsByClassName('alert-input');
                if (alterControlInput.length) {
                    console.log('alterControlInput', alterControlInput);
                    alterControlInput[0].value = count;
                    alterControlInput[0].setAttribute('placeholder', count);
                }
                const str = count.toString();
                const res = str.split('.', 1);
                console.log(JSON.stringify(res));
                return res.toString();
            }
        }
    }

    // Remove Item if its Count is zero
    ifCartItemCountIsZero() {
        for (const i in this.cartItems) {
            if (this.cartItems[i].count === 0) {
                const index = this.cartItems.indexOf(this.cartItems[i]);
                this.cartItems.splice(index, 1);
            }
        }
    }

    // Provide Discount Options
    addDiscount(id) {
        // const selectDiscountType = this.alertCtrl.create({
        //     title: 'Discount Type',
        //     inputs: [
        //         {
        //             label: 'Rupees',
        //             value: 'currency',
        //             type: 'radio',
        //             checked: false
        //         },
        //         {
        //             label: 'Percentage',
        //             value: 'percent',
        //             type: 'radio',
        //             checked: false
        //         },
        //         {
        //             label: 'Remove Discount',
        //             value: 'remove',
        //             type: 'radio',
        //             checked: false
        //         }
        //     ],
        //     buttons: [
        //         {
        //             text: 'Ok',
        //             handler: data => {
        //                 console.log('Ok clicked');
        //                 console.log('Value is: ' + data);
        //                 if (data === 'percent') {
        //                     this.addPercentDiscount(id);
        //                     return true;
        //                 } else if (data === 'currency') {
        //                     this.addCurrencyDiscount(id);
        //                     return true;
        //                 } else if (data === 'remove') {
        //                     for (const i in this.cartItems) {
        //                         if (id === this.cartItems[i].id) {
        //                             this.cartItems[i].discountedPrice = this.cartItems[i].sellingPrice;
        //                         }
        //                     }
        //                     return true;
        //                 } else {
        //                     this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_FAILED).subscribe(ToastMessage => {
        //                         this.toastr.error(ToastMessage);
        //                     });

        // tslint:disable-next-line:max-line-length
        //                     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT, '; SRC -BizLogic Class:AllItems method:addDiscount', ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_FAILED);
        //                     return false;
        //                 }
        //             }
        //         },
        //         {
        //             text: 'Cancel',
        //             handler: data => {
        //                 console.log('Cancel clicked');
        //                 return true;
        //             }
        //         }
        //     ],
        //     cssClass: 'discountAlertStyler'
        // });
        // selectDiscountType.present();
    }

    // To update the discounted value of item if Absolute value in Rupees is provided
    addCurrencyDiscount(id) {
        // let index: number;
        // for (const i in this.cartItems) {
        //     if (this.cartItems[i].id === id) {
        //         index = this.cartItems.indexOf(this.cartItems[i]);
        //     }
        // }
        // if (index !== -1) {
        //     this.translateService.get(['Discount', 'discountValue', 'Update', 'Cancel']).subscribe(ConvertedData => {
        //         const alert = this.alertCtrl.create({
        //             title: ConvertedData.Discount,
        //             inputs: [
        //                 {
        //                     name: ConvertedData.discountValue,
        //                     placeholder: this.cartItems[index].discountedPrice.toString()
        //                 },
        //             ],
        //             buttons: [
        //                 {
        //                     text: ConvertedData.Update,
        //                     handler: data => {
        //                         if (data.discountValue == null || data.discountValue === '') {
        //                             // no value entered
        // tslint:disable-next-line:max-line-length
        //                             this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_VALUE_FAILED).subscribe(ToastMessage => {
        //                                 this.toastr.error(ToastMessage);
        //                             });

        // tslint:disable-next-line:max-line-length
        //                             this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT, '; SRC -BizLogic Class:AllItems method:addCurrencyDiscount', ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_VALUE_FAILED);
        //                             return false;
        // tslint:disable-next-line:max-line-length
        //                         } else if (this.validator.isValidNumericValue(data.discountValue) && Number(data.discountValue) >= 0 && Number(data.discountValue) < this.cartItems[index].discountedPrice) {
        //                             // valid value entered
        // tslint:disable-next-line:max-line-length
        //                             // Getting the previous Discount Value for reducing it from the current discount, value will be zero in case previous discount was not set by the user
        //                             const prevDifference = this.cartItems[index].discount * this.cartItems[index].count;
        //                             // Setting up the current discount value provided by the user
        //                             this.cartItems[index].discount = Number(data.discountValue);
        //                             // Calculating the discounted price to be shown on user screen
        // tslint:disable-next-line:max-line-length
        //                             this.cartItems[index].discountedPrice = this.cartItems[index].sellingPrice - this.cartItems[index].discount;
        //                             // Calculating the price difference wrt previous discount value to update the footer accordingly
        // tslint:disable-next-line:max-line-length
        //                             const priceDifference = this.cartItems[index].discount * this.cartItems[index].count - prevDifference;
        //                             // Updating the footer value wrt to the price difference calculated in previous step
        //                             this.footerData.totalBillPrice -= priceDifference;
        //                             return true;
        //                         } else {
        //                             // invalid value entered
        // tslint:disable-next-line:max-line-length
        //                             this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_PRICE_FAILED).subscribe(ToastMessage => {
        //                                 this.toastr.error(ToastMessage);
        //                             });

        // tslint:disable-next-line:max-line-length
        //                             this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_PRICE, '; SRC -BizLogic Class:AllItems method:addCurrencyDiscount', ConstMessages.ErrorCode.ERROR_ITEM_PRICE_FAILED);
        //                             return false;
        //                         }
        //                     }
        //                 },
        //                 {
        //                     text: ConvertedData.Cancel,
        //                     handler: data => {
        //                         this.translateService.get('Discount not provided').subscribe(ToastMessage => {
        //                             this.toastr.warning(ToastMessage);
        //                         });
        //                         return true;
        //                     }
        //                 }
        //             ],
        //             cssClass: 'discountAlertStyler'
        //         });
        //         alert.present();
        //     });
        // }

    }

    // To calculate the total tax on all the items present in the cart items array...
    calculateTotalTax(item: IProductItemsData[]) {
        let totalTax = 0;
        // tslint:disable-next-line:forin
        for (const i in item) {
            const tax = item[i].tax * item[i].count;
            totalTax += tax;
        }
        return totalTax;
    }

    // To update the discounted value of item if percentage value is provided
    addPercentDiscount(id) {
        // let index: number;
        // for (const i in this.cartItems) {
        //     if (this.cartItems[i].id === id) {
        //         index = this.cartItems.indexOf(this.cartItems[i]);
        //     }
        // }
        // if (index !== -1) {

        //     const alert = this.alertCtrl.create({
        //         title: 'Provide Discount Value',
        //         inputs: [
        //             {
        //                 name: 'discountPercent',
        //                 placeholder: '%'
        //             },
        //         ],
        //         buttons: [
        //             {
        //                 text: 'Update Item Cost',
        //                 handler: data => {
        //                     if (data.discountPercent == null || data.discountPercent === '') {
        //                         // No value entered
        // tslint:disable-next-line:max-line-length
        //                         this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_VALUE_FAILED).subscribe(ToastMessage => {
        //                             this.toastr.error(ToastMessage);
        //                         });

        // tslint:disable-next-line:max-line-length
        //                         this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT, '; SRC -BizLogic Class:AllItems method:addPercentDiscount', ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_VALUE_FAILED);
        //                         return false;
        //                     } else if (this.validator.isValidPercentValue(data.discountPercent)) {
        //                         // Valid value entered
        // tslint:disable-next-line:max-line-length
        //                         // Getting the previous Discount Value for reducing it from the current discount, value will be zero in case previous discount was not set by the user
        //                         const prevDifference = this.cartItems[index].discount * this.cartItems[index].count;
        //                         // Setting up the current discount value provided by the user in cart array
        // tslint:disable-next-line:max-line-length
        //                         this.cartItems[index].discount = this.cartItems[index].sellingPrice * Number(data.discountPercent) * 0.01;
        //                         // Calculating the discounted price to be shown on user screen
        // tslint:disable-next-line:max-line-length
        //                         this.cartItems[index].discountedPrice = this.cartItems[index].sellingPrice - this.cartItems[index].discount;
        //                         // Calculating the price difference wrt previous discount value to update the footer accordingly
        //                         const priceDifference = this.cartItems[index].discount * this.cartItems[index].count - prevDifference;
        //                         // Updating the footer value wrt to the price difference calculated in previous step
        //                         this.footerData.totalBillPrice -= priceDifference;
        //                         return true;
        //                     } else {
        //                         // Invalid value entered
        // tslint:disable-next-line:max-line-length
        //                         this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_PERCENT_FAILED).subscribe(ToastMessage => {
        //                             this.toastr.error(ToastMessage);
        //                         });

        // tslint:disable-next-line:max-line-length
        //                         this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT, '; SRC -BizLogic Class:AllItems method:addPercentDiscount', ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_PERCENT_FAILED);
        //                         return false;
        //                     }
        //                 }
        //             },
        //             {
        //                 text: 'Cancel',
        //                 handler: data => {
        //                     this.toastr.warning('Discount not provided');
        //                     return true;
        //                 }
        //             }
        //         ],
        //         cssClass: 'discountAlertStyler'
        //     });
        //     alert.present();
        // }
    }

    /* Total Bill Page Calculations */
    // Calculating the value for total payable amount after the form data is entered
    calculateTotalPayable() {
        if (null !== this.footerData.totalBillDiscount && undefined !== this.footerData.totalBillDiscount) {
            let countToastMessage = 0;
            let footerDiscountValue: number;
            // tslint:disable-next-line:max-line-length
            if ('percent' === this.footerData.discountIn) { footerDiscountValue = this.footerData.totalBillDiscount * this.footerData.totalBillPrice * 0.01; }
            if (0 <= Number(this.footerData.totalBillDiscount) && 0 <= Number(this.footerData.otherCosts)) {
                if ('percent' === this.footerData.discountIn && this.footerData.totalBillPrice >= footerDiscountValue) {
                    // tslint:disable-next-line:max-line-length
                    this.footerData.totalPayable = this.footerData.totalBillPrice * (1 - Number(this.footerData.totalBillDiscount) * 0.01) + Number(this.footerData.otherCosts) + this.footerData.totalTax;
                // tslint:disable-next-line:max-line-length
                } else if ('currency' === this.footerData.discountIn && (this.footerData.totalBillPrice >= this.footerData.totalBillDiscount)) {
                    // tslint:disable-next-line:max-line-length
                    this.footerData.totalPayable = this.footerData.totalBillPrice - Number(this.footerData.totalBillDiscount) + Number(this.footerData.otherCosts) + this.footerData.totalTax;
                     } else {
                    // tslint:disable-next-line:max-line-length
                    if (this.footerData.totalBillDiscount !== this.previousTotalBillDiscount) { this.previousTotalBillDiscount = this.footerData.totalBillDiscount; } else { countToastMessage = countToastMessage + 1; }
                    if (countToastMessage === 0) {
                        this.toastr.error(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_MORE);
                    }
                }
            } else {
                if (Number(this.footerData.otherCosts) <= 0) {
                    countToastMessage = countToastMessage + 1;
                }
                if (countToastMessage === 0) {
                    this.translateService.get(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_MORE).subscribe(ToastMessage => {
                        this.toastr.error(ToastMessage);
                    });

                    // tslint:disable-next-line:max-line-length
                    this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT, '; SRC -BizLogic Class:AllItems method:calculateTotalPayable', ConstMessages.ErrorCode.ERROR_ITEM_DISCOUNT_MORE);
                }
                return;
            }
        } else { return; } // Array is empty
    }

    // Calculating the value for total balance amount after the form data is entered
    calculateBalance(prevBalance: number) {
        if (null === this.footerData) {
            return; // Array is empty
        } else if (0 <= this.footerData.totalPayable) {
            this.footerData.balance = prevBalance + this.footerData.totalPayable;
            // prevBalance = this.footerData.balance - this.footerData.amtReceived;
        } else { return; }
    }

    // Getting the payment ID to store in the Database
    getPaymentIDData() {
        return this.footerData.paidIn;
    }

    /**
     * If any cart item's price  is marked as Tax Inclusive then...
     * The product cost already includes Tax Amount based on fields checked in Tax percent and no additional tax should be charged
     * On the total bill page the below method displays Total as (Selling Price - Tax Amount) if selling price was inclusive of tax
     * Show Total Tax as Tax Amount based on Tax Percent Selected
     */
    recalculateTotalBillPrice(cartItems: IProductItemsData[]) {
        let totalBillPrice = 0;
        for (const i in cartItems) {
            if (cartItems[i].isSellingPriceTaxInclusive) {
                totalBillPrice += (cartItems[i].discountedPrice - cartItems[i].tax) * cartItems[i].count;
            } else {
                totalBillPrice += cartItems[i].discountedPrice * cartItems[i].count;
            }
        }
        return totalBillPrice;
    }
    // calculate the totalBill price for tax disabled
    recalculateTotalBillPriceDisabledTax(cartItems: IProductItemsData[]) {
        let totalBillPrice = 0;
        // tslint:disable-next-line:forin
        for (const i in cartItems) {
            totalBillPrice += cartItems[i].discountedPrice * cartItems[i].count;
        }
        return totalBillPrice;
    }

    // Storing Default Footer Values in case the data is to be cleaned...
    setFooterDataToDefault() {
        this.footerData = {
            totalBillPrice: 0,
            totalBillDiscount: null,
            totalBillDiscountFinal: 0,
            totalItemsAdded: 0,
            totalTax: 0,
            discountIn: 'percent',
            otherCosts: null,
            totalPayable: null,
            totalPayableUpdate: 0,
            amtReceived: null,
            balance: null,
            paidIn: null,
            paidInValue: '',
            paymentRefNo: null,
            invoiceNote: '',
            invoiceNumber: null,
            invoiceDate: null,
            partyId: null,
            partyName: '',
            outStandingBalance: 0,
            creditAmount: 0,
            isCreditAmountUsed: false,
            creditAmountUsed: 0,
            config: {
                showGSTIN: null,
                showPAN: null,
                showTAN: null,
                showCIN: null,
                showHSN: null,
                ShowInvNote: null,
                ShowInvImage: null
            },
            categoryPageRedirectName: '',
            categoryPageRedirect: null,
            SaleDraftPage: '',
            totalBillDiscountPercent: 0,
            totalBillDiscountRupees: 0,
            isSaleQuotation: false,
            SaleQuotationStatus: '',
            Eway: ''
        };
    }

    SetAnalyticsDataToDefault() {
        this.AnalyticsData = {
            SaleTotalTransactions: 0,
            PurchaseTotalTransactions: 0,
            ItemData: 0,
            ItemCategoryData: 0,
            ExpenseData: 0,
            PartyData: 0,
            LastSaleDoneOn: 0,
            LastPurchaseDoneOn: 0,
            LastItemAddedOn: 0,
            LastCategoryCreatedOn: 0,
            LastAppUsedOn: 0,
            TotalTimeSpent: 0,
            MobileNumber: 0,
            LastAppStartedon: 0,
            TimeSpent: 0,
            DailyAccountsReport: 0,
            GSTR1Report: 0,
            GSTR2Report: 0,
            GSTR3BReport: 0,
            InventoryStockReport: 0,
            LowStockSummaryReport: 0,
            PartyStatementReport: 0,
            ProductLevelInventoryReport: 0,
            ProfitAndLostReport: 0,
            PurchaseDraftReport: 0,
            PurchaseReport: 0,
            SaleReport: 0,
            SalesDraftReport: 0,
            YearEndingReport: 0,
            InsertedDate: '',
            LastExpenseCreatedOn: 0,
            AppsubscriptionPage: 0,
            subscriptionContactInformation: 0,
            MonthlySubscriptionSuccess: 0,
            AnuallySubscriptionSucess: 0,
            FailurePayment: 0,
            SaleAppWalkThrough: '',
            InventoryAppWalkThrough: ''
        };
    }

    // To Empty out the arrays once the sale process is completed...//call the function here thats it for updating the table...one se
    async cleanServiceData() {
        // Updating the data in DB before the items are cleaned...
        // tslint:disable-next-line:forin
        for (const item in this.cartItems) {
            // tslint:disable-next-line:forin
            for (const list in this.itemList) {
                this.itemList[list].count = 0;
                if (this.itemList[list].id === this.cartItems[item].id) {
                    this.cartItems[item].ItemSold = this.itemList[list].ItemSold;
                    this.cartItems[item].currentStock = this.itemList[list].currentStock;
                }
            }
        }
        // Updating the data in DB before the items are cleaned...
        // tslint:disable-next-line:forin
        for (const i in this.cartItems) {
            await this.productItemsData.updateProductDataAfterSaleProcess(this.cartItems[i]).then((res) => {
                console.log('Cart item: ' + this.cartItems[i].name + ' is updated in DB Successfully...'); console.log(res);
                // tslint:disable-next-line:max-line-length
                this.productItemsData.updateProductLevelInventory(this.cartItems[i].id, this.cartItems[i].name, this.cartItems[i].count, 'Sale', 'Sale', false, this.footerData.invoiceDate).then(
                    (response) => {
                        console.log('updateProductLevelInventory Sale cart items ===>', response);
                    });
            }).catch((err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_SAVE_FAILED, '; SRC -BizLogic Class:AllItems method:cleanServiceData', err);
            });
        }
        this.cleanItemsArray();
        // Cleaning the items arrays for the next sale process
        console.log('Cleaned up the current Sale Process service data...');
    }

    // To Empty out the arrays once the sale process is completed...
    cleanServiceForSaleDraftData() {
        // Cleaning the items arrays for the next sale process
        this.itemList = [];
        this.cartItems = [];
        this.receivedItemIDs = [];
        this.setFooterDataToDefault();
        console.log('Cleaned up the current Sale Process service data...');
    }

    // To Empty out the arrays once the sale process is completed...
    async cleanServiceForNewSaleProcessData() {
        // Updating the data in DB before the items are cleaned...
        // tslint:disable-next-line:forin
        for (const list in this.itemList) {
            this.itemList[list].count = 0;
            if (this.itemList[list].oldCount > 0 && !this.itemList[list].addToCart) {
                if (this.itemList[list].isMaintainStock) {
                    this.cartItems.push(this.itemList[list]);
                }
            }
            for (const item in this.cartItems) {
                if (this.itemList[list].id === this.cartItems[item].id) {
                    this.cartItems[item].ItemSold = this.itemList[list].ItemSold;
                    this.cartItems[item].currentStock = this.itemList[list].currentStock;
                }
            }
        }
        // tslint:disable-next-line:forin
        for (const item in this.cartItems) {
            await this.productItemsData.updateProductDataAfterSaleProcess(this.cartItems[item]).then((res) => {
                if (Number(item) === (this.cartItems.length - 1)) {
                    console.log(res);
                    // Cleaning the items arrays for the next sale process
                    this.cleanItemsArray();
                }
            }).catch((err) => {
                // tslint:disable-next-line:max-line-length
                this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_ITEM_SAVE_FAILED, '; SRC -BizLogic Class:AllItems method:cleanServiceForNewSaleProcessData', err);
            });
        }
        console.log('Cleaned up the current Sale Process service data...');
    }

    // To empty the local arrays of the AllItems service
    cleanItemsArray() {
        this.itemList = [];
        this.cartItems = [];
        this.receivedItemIDs = [];
        this.setFooterDataToDefault();
    }

    // To scan the barcode and return the barcode number for the product category...
    scanBarCode() {
        const options = {
            showFlipCameraButton: true,
            showTorchButton: true,
            resultDisplayDuration: 0
        };
        // return this.barcode.scan(options).then((barcodeData) => {
        //     console.log(barcodeData); // Success! Barcode data is here
        //     return barcodeData.text;
        // }, (err) => {
        //     console.log(err); // An error occurred
        // tslint:disable-next-line:max-line-length
        //     this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_BAR_CODE_DATA_FAILED, '; SRC -BizLogic Class:AllItems method:scanBarCode', err);
        //     return err;
        // });
    }

    // getting the highest TaxSlabID of GST and I_GST for each item
    async cartItemsTaxSlab(cartItems: IProductItemsData[]) {
        // tslint:disable-next-line:forin
        for (const ItemData in cartItems) {
            // tslint:disable-next-line:max-line-length
            if (cartItems[ItemData].TaxSlabID1 === 0 && cartItems[ItemData].TaxSlabID2 === 0 && cartItems[ItemData].TaxSlabID3 === 0 && cartItems[ItemData].TaxSlabID4 === 0) {
                cartItems[ItemData].TaxSlabID1 = 15;
            }
            // tslint:disable-next-line:max-line-length
            const taxSlabColumns = [cartItems[ItemData].TaxSlabID1, cartItems[ItemData].TaxSlabID2, cartItems[ItemData].TaxSlabID3, cartItems[ItemData].TaxSlabID4];
            // switch case for setting the highest item tax slab ID
            // tslint:disable-next-line:max-line-length
            cartItems[ItemData].TaxSlabData = 0; cartItems[ItemData].TaxSlabIGSTData = 0; cartItems[ItemData].TaxSlabPurchase = 0; cartItems[ItemData].TaxSlabCGST = 0; cartItems[ItemData].TaxSlabSGST = 0; cartItems[ItemData].TaxSlabIGST = 0; cartItems[ItemData].TaxSlabCESS = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let TaxNumber = 0; TaxNumber < taxSlabColumns.length; TaxNumber++) {
                // calculate the GST tax rate if GST tax is applied on that item
                // tslint:disable-next-line:max-line-length
                for (const taxRatesData in ConstantMessages.GSTTaxRate) { // if item price is 100 and gst tax applied to it is 5% then the CGST and SGST will be (100*0.05)/2 if tax inclusive is on the the tax calculation will be (100*5)/(100+5)/2 since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                    if (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                        cartItems[ItemData].TaxSlabData = ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID;
                        cartItems[ItemData].TaxSlabCGST = (cartItems[ItemData].TaxSlabValue1 / 2);
                        cartItems[ItemData].TaxSlabSGST = (cartItems[ItemData].TaxSlabValue1 / 2);
                    }
                }
                // calculate the IGST tax rate if IGST tax is applied on that item
                // tslint:disable-next-line:max-line-length
                for (const taxRatesData in ConstantMessages.IGSTTaxRate) {// if item price is 100 and igst tax applied to it is 5% then the IGST will be (100*0.05) if tax inclusive is on the the tax calculation will be (100*5)/(100+5) since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                    if (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                        cartItems[ItemData].TaxSlabIGSTData = ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID;
                        cartItems[ItemData].TaxSlabIGST = cartItems[ItemData].TaxSlabValue1;
                    }
                }
                // if tax sab is greater than 16 then assign tax slab id as 10000
                if (taxSlabColumns[TaxNumber] > 16) {
                    cartItems[ItemData].TaxSlabCESSData = taxSlabColumns[TaxNumber];
                    cartItems[ItemData].TaxSlabOtherData = 10000;
                }
            }
            // other tax rate with tax slab id 10000 to differentiate with gst and igst
            if (cartItems[ItemData].TaxSlabOtherData === 10000) {
                cartItems[ItemData].TaxSlabCESS = cartItems[ItemData].TaxSlabValue2;
            }
        }
        return await cartItems;
    }


    // getting the highest TaxSlabID of GST and I_GST for each item
    async FinalBillCartItemsTaxCalculation(cartItems: IProductItemsData[], callback) {
        // tslint:disable-next-line:forin
        for (const ItemData in cartItems) {
            // tslint:disable-next-line:max-line-length
            if (cartItems[ItemData].TaxSlabID1 === 0 && cartItems[ItemData].TaxSlabID2 === 0 && cartItems[ItemData].TaxSlabID3 === 0 && cartItems[ItemData].TaxSlabID4 === 0) {
                cartItems[ItemData].TaxSlabID1 = 15; // For exempted item
            }
            // tslint:disable-next-line:max-line-length
            const taxSlabColumns = [cartItems[ItemData].TaxSlabID1, cartItems[ItemData].TaxSlabID2, cartItems[ItemData].TaxSlabID3, cartItems[ItemData].TaxSlabID4];
            // switch case for setting the highest item tax slab ID
            // tslint:disable-next-line:max-line-length
            cartItems[ItemData].TaxSlabData = 0; cartItems[ItemData].TaxSlabIGSTData = 0; cartItems[ItemData].TaxSlabPurchase = 0; cartItems[ItemData].TaxSlabCGST = 0; cartItems[ItemData].TaxSlabSGST = 0; cartItems[ItemData].TaxSlabIGST = 0; cartItems[ItemData].TaxSlabCESS = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let TaxNumber = 0; TaxNumber < taxSlabColumns.length; TaxNumber++) {
                // calculate the GST tax rate if GST tax is applied on that item
                // tslint:disable-next-line:max-line-length
                for (const taxRatesData in ConstantMessages.GSTTaxRate) { // if item price is 100 and gst tax applied to it is 5% then the CGST and SGST will be (100*0.05)/2 if tax inclusive is on the the tax calculation will be (100*5)/(100+5)/2 since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                    if (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                        cartItems[ItemData].TaxSlabData = ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID;
                        if (cartItems[ItemData].isSellingPriceTaxInclusive) {
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabCGST = ((((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100) * Number(cartItems[ItemData].discountedPrice)) / (100 + (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100))) / 2);
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabSGST = ((((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100) * Number(cartItems[ItemData].discountedPrice)) / (100 + (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100))) / 2);

                        } else {
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabCGST = ((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * Number(cartItems[ItemData].discountedPrice)) / 2);
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabSGST = ((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * Number(cartItems[ItemData].discountedPrice)) / 2);
                        }

                    }
                }
                // calculate the IGST tax rate if IGST tax is applied on that item
                // tslint:disable-next-line:max-line-length
                for (const taxRatesData in ConstantMessages.IGSTTaxRate) {// if item price is 100 and igst tax applied to it is 5% then the IGST will be (100*0.05) if tax inclusive is on the the tax calculation will be (100*5)/(100+5) since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                    if (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                        if (cartItems[ItemData].isSellingPriceTaxInclusive) {
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabIGST = (((ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100) * Number(cartItems[ItemData].discountedPrice)) / (100 + (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100)));
                        } else {
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabIGST = (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * Number(cartItems[ItemData].discountedPrice));

                        }
                        cartItems[ItemData].TaxSlabIGSTData = ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID;

                    }
                }
                // if tax sab is greater than 16 then assign tax slab id as 10000
                if (taxSlabColumns[TaxNumber] > 16) {
                    cartItems[ItemData].TaxSlabCESSData = taxSlabColumns[TaxNumber];
                    cartItems[ItemData].TaxSlabOtherData = 10000;
                }
            }
            // other tax rate with tax slab id 10000 to differentiate with gst and igst
            if (cartItems[ItemData].TaxSlabOtherData === 10000) {
                this.taxSlabs.getTaxSlabs().then(async (TaxRate) => {
                    cartItems[ItemData].TaxSlabCESS = cartItems[ItemData].TaxSlabValue2;
                    for (const taxRatesData in TaxRate) {
                        if (TaxRate[taxRatesData].TaxSlabID === cartItems[ItemData].TaxSlabCESSData) {
                            if (cartItems[ItemData].isSellingPriceTaxInclusive) {
                                // tslint:disable-next-line:max-line-length
                                cartItems[ItemData].TaxSlabCESS = (((TaxRate[taxRatesData].TaxSlabValue * 100) * Number(cartItems[ItemData].discountedPrice)) / (100 + (TaxRate[taxRatesData].TaxSlabValue * 100)));
                            } else {
                                // tslint:disable-next-line:max-line-length
                                cartItems[ItemData].TaxSlabCESS = (TaxRate[taxRatesData].TaxSlabValue * Number(cartItems[ItemData].discountedPrice));

                            }
                            if (cartItems.indexOf(cartItems[ItemData]) === cartItems.length - 1) {
                                callback(cartItems); return;
                            }
                        }
                    }
                });
            } else {
                if (cartItems.indexOf(cartItems[ItemData]) === cartItems.length - 1) {
                    callback(cartItems); return;
                }
            }
        }
    }




    // getting the TaxSlab Name for Each tax Slab Id
    async cartItemsTaxSlabName(cartItems: IProductItemsData[]) {
        let taxRates: ITaxSlabs[] = [];
        // taxRates contains array of tax rates from taxSlabs service for showing DDown data in UI...
        return await this.taxSlabs.getTaxSlabs().then(async (res) => {
            taxRates = res;
            // tslint:disable-next-line:forin
            for (const ItemData in cartItems) {
                cartItems[ItemData].TaxSlabData = 0; cartItems[ItemData].TaxSlabIGSTData = 0;
                cartItems[ItemData].TaxSlabName1 = ''; cartItems[ItemData].TaxSlabName2 = '';
                cartItems[ItemData].TaxSlabName3 = ''; cartItems[ItemData].TaxSlabName4 = '';
                // tslint:disable-next-line:max-line-length
                const taxSlabColumns = [cartItems[ItemData].TaxSlabID1, cartItems[ItemData].TaxSlabID2, cartItems[ItemData].TaxSlabID3, cartItems[ItemData].TaxSlabID4];
                // switch case for setting the highest item tax slab ID
                // tslint:disable-next-line:prefer-for-of
                for (let TaxNumber = 0; TaxNumber < taxSlabColumns.length; TaxNumber++) {
                    // if taxSlab is GST then get the GST Name from it
                    // tslint:disable-next-line:max-line-length
                    for (const taxRatesData in ConstantMessages.GSTTaxRate) { // if the tax slab columns is gst then get the GST value from the constant array and get the tax percentage by multiplying it with 100 and dividing by 2 to get the CGST and SGST value
                        if (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabName1 = 'CGST@' + (Number((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100).toFixed(2)) / 2) + '%';
                            // tslint:disable-next-line:max-line-length
                            cartItems[ItemData].TaxSlabName2 = 'SGST@' + (Number((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100).toFixed(2)) / 2) + '%';
                        }
                    }
                    // if taxSlab is IGST then get the IGST Name from it
                    // tslint:disable-next-line:max-line-length
                    for (const taxRatesData in ConstantMessages.IGSTTaxRate) { // if the tax slab column is IGST then get the GST value from the constant array and get the tax percentage by multiplying it with 100
                        if (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                            cartItems[ItemData].TaxSlabName3 = ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabName;
                        }
                    }
                    // if taxSlab is OTHER then get the OTHER Tax Slab Name from it
                    if (taxSlabColumns[TaxNumber] > 16) { // if the tax slab is greater than 16 then it lies in other tax slab category
                        for (const taxRatesData in taxRates) {
                            if (taxRates[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                                cartItems[ItemData].TaxSlabName4 = taxRates[taxRatesData].TaxSlabName;
                            }
                        }
                    }
                }
            }
            return await cartItems;
        });
    }
    // To push all the items into all items array on Product List page if the categories are disabled in app settings
    async getAllItemDataLength() {
        let ItemDataLength = 0;
        await this.productItemsData.getProductCount().then((res) => {
            if (res !== undefined && res !== null) {
                ItemDataLength = res;
            }
        });

        return await ItemDataLength;
    }

    // Update Item Data for cart List
    UpdateItemData(id, count, sellingPrice, PriceChanged) {
        for (const item of this.itemList) {
            if (id === item.id) {
                item.discountedPrice = sellingPrice;
                item.PriceUpdate = PriceChanged;
                if (count > 0) {
                    // if maintain stock is checked then update the current stock value
                    if (item.isMaintainStock) {
                        if (item.currentStock >= count) {
                            item.count = item.count + count;
                            item.currentStock = item.currentStock - count;
                            if (PriceChanged === 1) {
                                this.footerData.totalBillPrice += (item.discountedPrice * count);
                            } else {
                                this.footerData.totalBillPrice += (item.discountedPrice * count);
                            }
                            if (item.currentStock === 0 && !item.isNegativeStockAllowed) {
                                const msg = item.name + ' is out of stock';
                                this.toastr.error(msg);
                                return true;
                            }
                            // if current stock is less than min stock then show message low on stock
                            if (item.currentStock < item.MinStockNotification && item.currentStock > 0 && !item.isNegativeStockAllowed) {
                                const msg = item.name + ' is low on stock';
                                this.toastr.warning(msg);
                                return true;
                            }
                            // if current stock is less than min stock then show message low on stock
                            if (item.currentStock >= item.MinStockNotification && item.currentStock > 0) {
                                return true;
                            }

                        } else {
                            // if current stock is less than count then show message greater than current stock value
                            if (item.currentStock < count && !item.isNegativeStockAllowed) {
                                this.outOfStockItemAlert(item, count, 'ItemCountUpdatedOnSaleEdit');
                                return false;
                            }
                            if (item.currentStock < count && item.isNegativeStockAllowed) {
                                this.footerData.totalBillPrice -= item.discountedPrice * item.count;
                                item.count = count;
                                item.currentStock = -(count);
                                this.footerData.totalBillPrice += (item.discountedPrice * count);
                                return true;
                            }
                        }
                    } else {
                        if (PriceChanged === 1) {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        } else {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        }
                        item.count = item.count + count;
                        console.log('No need to Update Current Stock');
                        return true;
                    }
                } else {
                    item.count = item.count + count;
                    if (item.isMaintainStock) {
                        item.currentStock = item.currentStock - count;
                        if (PriceChanged === 1) {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        } else {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        }
                        return true;
                    } else {
                        if (PriceChanged === 1) {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        } else {
                            this.footerData.totalBillPrice += (item.discountedPrice * count);
                        }
                        return true;
                    }
                }

            }
        }
    }
    // get the updated products from the cart to new sale page
    getUpdateItemFromCart() {
        // tslint:disable-next-line:forin
        for (const i in this.itemList) {
            if ((this.itemList[i].count > 0) && (!this.isItemAlreadyInCart(this.itemList[i].id))) {
                this.cartItems.push(this.itemList[i]);
            }
            if ((this.itemList[i].count >= 0) && this.isItemAlreadyInCart(this.itemList[i].id)) {
                for (const items of this.cartItems) {
                    if (items.id === this.itemList[i].id) {
                        items.count = this.itemList[i].count;
                        if (items.count === 0) {
                            this.itemList[i].addToCart = false;
                            const index: number = this.cartItems.indexOf(items);
                            this.cartItems.splice(index, 1);
                        }
                    }
                }
            }

        }
        return this.cartItems;
    }

    // add the count value to the item list to edit the sale transaction
    async UpdateCountValue() {
        if (this.itemList.length === 0) {
            await this.getAllItems(this.receivedItemIDs, null);
        }
        // tslint:disable-next-line:forin
        for (const item in this.cartItems) {
            for (const list in this.itemList) {
                if (this.cartItems[item].id === this.itemList[list].id) {
                    this.itemList[list].count = this.cartItems[item].count;
                    this.itemList[list].oldCount = this.cartItems[item].oldCount;
                    this.itemList[list].addToCart = true;
                }
            }
        }
    }

    // To calculate the total tax on item price on bill page
    SellingPriceTaxCalculation(item: IProductItemsData, callback) {
        item.sellingPriceTax = 0;
        if (item.TaxSlabID1 === 0 && item.TaxSlabID2 === 0 && item.TaxSlabID3 === 0 && item.TaxSlabID4 === 0) {
            item.TaxSlabID1 = 15;
        }

        const taxSlabColumns = [item.TaxSlabID1, item.TaxSlabID3, item.TaxSlabID4];
        // tslint:disable-next-line:prefer-for-of
        for (let TaxNumber = 0; TaxNumber < taxSlabColumns.length; TaxNumber++) {
            // Calculate the GST tax rate if GST tax is applied on that item
            // tslint:disable-next-line:max-line-length
            for (const taxRatesData in ConstantMessages.GSTTaxRate) { // if item price is 100 and gst tax applied to it is 5% then the CGST and SGST will be (100*0.05)/2 if tax inclusive is on the the tax calculation will be (100*5)/(100+5)/2 since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                if (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                    item.TaxSlabData = ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabID;
                    if (item.isSellingPriceTaxInclusive) {
                        const itemPrice = Number(item.discountedPrice) + Number(item.tax);
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += ((((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100) * (itemPrice + Number(item.discount))) / (100 + (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100))) / 2);
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += ((((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100) * (itemPrice + Number(item.discount))) / (100 + (ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * 100))) / 2);
                    } else {
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += ((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * (Number(item.discountedPrice) + Number(item.discount))) / 2);
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += ((ConstantMessages.GSTTaxRate[taxRatesData].TaxSlabValue * (Number(item.discountedPrice) + Number(item.discount))) / 2);
                    }
                }
            }
            // Calculate the IGST tax rate if IGST tax is applied on that item
            // tslint:disable-next-line:max-line-length
            for (const taxRatesData in ConstantMessages.IGSTTaxRate) {// if item price is 100 and igst tax applied to it is 5% then the IGST will be (100*0.05) if tax inclusive is on the the tax calculation will be (100*5)/(100+5) since tax slab is already calculated in tax slab value 1 to 4 so we are just assigning that value it to
                if (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabID === taxSlabColumns[TaxNumber]) {
                    if (item.isSellingPriceTaxInclusive) {
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += (((ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100) * (Number(item.discountedPrice) + Number(item.discount))) / (100 + (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * 100)));
                    } else {
                        // tslint:disable-next-line:max-line-length
                        item.sellingPriceTax += (ConstantMessages.IGSTTaxRate[taxRatesData].TaxSlabValue * (Number(item.discountedPrice) + Number(item.discount)));
                    }
                }
            }
            // If tax sab is greater than 16 then assign tax slab id as 10000
            if (taxSlabColumns[TaxNumber] > 16) {
                item.TaxSlabCESSData = taxSlabColumns[TaxNumber];
                item.TaxSlabOtherData = 10000;
            }
        }

        // other tax rate with tax slab id 10000 to differentiate with gst and igst
        if (item.TaxSlabOtherData === 10000) {
            this.taxSlabs.getTaxSlabs().then((TaxRate) => {
                item.TaxSlabCESS = item.TaxSlabValue2;
                for (const taxRatesData in TaxRate) {
                    if (TaxRate[taxRatesData].TaxSlabID === item.TaxSlabCESSData) {
                        if (item.isSellingPriceTaxInclusive) {
                            // tslint:disable-next-line:max-line-length
                            item.sellingPriceTax += (((TaxRate[taxRatesData].TaxSlabValue * 100) * (Number(item.discountedPrice) + Number(item.discount))) / (100 + (TaxRate[taxRatesData].TaxSlabValue * 100)));
                        } else {
                            // tslint:disable-next-line:max-line-length
                            item.sellingPriceTax += (TaxRate[taxRatesData].TaxSlabValue * (Number(item.discountedPrice) + Number(item.discount)));

                        }
                        callback(item);
                        return;
                    }
                }
            });
        } else {
            callback(item);
            return;
        }
    }

    // Save as Draft From the current sale Process
    SaveAsDraft(PageName, partyName, partyID, categoryName, categoryId, showAllItems, EnableTax, callback) {
        this.cartItemsTaxSlab(this.getCartItems()).then((CartData: IProductItemsData[]) => {
            this.cartItems = CartData;
            if (partyName !== '' && partyName != null && partyName !== undefined) { this.footerData.partyName = partyName; }
            if (partyID !== '' && partyID != null && partyID !== undefined) { this.footerData.partyId = partyID; }
            // tslint:disable-next-line:max-line-length
            if (this.footerData.totalBillDiscount == null || this.footerData.totalBillDiscount === undefined) { this.footerData.totalBillDiscount = 0; }
            if (this.footerData.otherCosts == null || this.footerData.otherCosts === undefined) { this.footerData.otherCosts = 0; }
            // tslint:disable-next-line:max-line-length
            if (this.footerData.paidInValue === '' || this.footerData.paidInValue == null || this.footerData.paidInValue === undefined) { this.footerData.paidInValue = 'cash'; }
            this.footerData.totalTax = this.calculateTotalTax(this.cartItems);
            this.footerData.totalBillPrice = this.recalculateTotalBillPrice(this.cartItems);
            this.footerData.totalPayable = this.footerData.totalBillPrice + this.footerData.totalTax;
            this.footerData.amtReceived = this.footerData.totalPayable;
            this.footerData.SaleDraftPage = PageName;
            // tslint:disable-next-line:max-line-length
            if (categoryName !== undefined || categoryName != null && !showAllItems) { this.footerData.categoryPageRedirectName = categoryName; }
            if (categoryId !== undefined || categoryId != null && !showAllItems) { this.footerData.categoryPageRedirect = categoryId; }
            if (showAllItems) { this.footerData.categoryPageRedirectName = 'ShowAllItemsProductListPage'; }
            // Pushing the valid form data to DB
            if (undefined === this.footerData.partyId || null === this.footerData.partyId) {
                this.partyData.getPettyCashPartyData().then(result => { // Setting Petty Cash party for sale in case of no party selected
                    const party = result;
                    this.footerData.PhoneNumber = party.Phone;
                    this.footerData.partyName = party.name;
                    this.footerData.partyId = party.partyId;
                    this.footerData.outStandingBalance = party.outstandingBalance;
                    this.footerData.creditAmount = party.creditAmount;
                    // tslint:disable-next-line:max-line-length
                    this.addDraftSaleInvoiceToDB(EnableTax, (response) => { callback(response); }); // Inserting the draft invoice to DB for Petty Cash
                });
            // tslint:disable-next-line:max-line-length
            } else { this.addDraftSaleInvoiceToDB(EnableTax, (response) => { callback(response); }); } // Inserting the draft invoice to DB with the selected party
        });
    }

    /** To add the Sale Draft details in the DB */
    addDraftSaleInvoiceToDB(EnableTax, callback) {
        let CartItemLength = 0;
        if (null == this.footerData.invoiceNumber || undefined === this.footerData.invoiceNumber) {
            // Pushing the valid form data to DB
            // tslint:disable-next-line:max-line-length
            this.salesInvoiceItems.insertDraftFinalBillDataToDB(this.footerData, '', Number(EnableTax)).then((DraftSalesInvoiceResponse) => {
                CartItemLength = this.cartItems.length;
                // Calculating the each item tax which is not saved in the database
                // tslint:disable-next-line:forin
                for (const item in this.cartItems) {
                    // tslint:disable-next-line:max-line-length
                    this.cartItems[item].tax = this.cartItems[item].TaxSlabValue1 + this.cartItems[item].TaxSlabValue2 + this.cartItems[item].TaxSlabValue3 + this.cartItems[item].TaxSlabValue4;
                }
                // tslint:disable-next-line:forin
                for (const i in this.cartItems) {
                    this.cartItems[i].salesInvoiceID = DraftSalesInvoiceResponse.insertId;
                    // Generating the sales Invoice and Storing it in Footer Array and Sales Invoice Table in DB...
                    if (null === this.footerData.invoiceNumber) {
                        this.productItemsData.getNumberOfSaleDraftTransaction().then(InvoiceID => {
                            // tslint:disable-next-line:max-line-length
                            this.footerData.invoiceNumber = this.generateSalesInvoiceNumber(InvoiceID.value, ConstMessages.FinalBillPage.SAVE_INVOICE_CONFIG_NAME, 4);
                            // tslint:disable-next-line:max-line-length
                            this.salesInvoiceItems.updateDraftSalesInvoiceNumberInDB(this.cartItems[0].salesInvoiceID, this.footerData.invoiceNumber).then(res => {
                            });
                        });
                    }
                    this.salesInvoiceItems.insertDraftSalesInvoiceItemsDataToDB(this.cartItems[i]).then((responseItems) => {
                        if (responseItems) {
                            if (Number(i) === (CartItemLength - 1)) {
                                callback('SavedAsDraft'); return;
                            }
                        } else {
                            callback('SavedFailed'); return;
                        }
                    });
                }
            });
        } else {
            this.salesInvoiceItems.deleteDraftSalesItemDataFromDB(this.footerData.InvoiceId).then((ItemDeletedResponse) => {
                // tslint:disable-next-line:max-line-length
                this.salesInvoiceItems.UpdateDraftFinalBillDataToDB(this.footerData, '', Number(EnableTax)).then((DraftSalesInvoiceResponse) => {
                    if (DraftSalesInvoiceResponse) {
                        CartItemLength = this.cartItems.length;
                        // Calculating the each item tax which is not saved in the database
                        // tslint:disable-next-line:forin
                        for (const item in this.cartItems) {
                            // tslint:disable-next-line:max-line-length
                            this.cartItems[item].tax = this.cartItems[item].TaxSlabValue1 + this.cartItems[item].TaxSlabValue2 + this.cartItems[item].TaxSlabValue3 + this.cartItems[item].TaxSlabValue4;
                        }
                        // tslint:disable-next-line:forin
                        for (const i in this.cartItems) {
                            this.cartItems[i].salesInvoiceID = this.footerData.InvoiceId;
                            this.salesInvoiceItems.insertDraftSalesInvoiceItemsDataToDB(this.cartItems[i]).then((responseItems) => {
                                if (responseItems) {
                                    if (Number(i) === (CartItemLength - 1)) {
                                        callback('DraftUpdated'); return;
                                    }
                                } else {
                                    callback('SavedFailed'); return;
                                }
                            });
                        }
                    } else {
                        callback('SavedFailed'); return;
                    }
                });
            });
        }
    }

    // tslint:disable-next-line:max-line-length
    // Method to generate the sales invoice no., accepts id as Sales Invoice Id, name as the LHS of Invoice No and, length as length of the RHS ID in terms of no. of Digits required...
    generateSalesInvoiceNumber(id: number, name: string, length: number) {
        let invoiceNo = '';
        const invoiceId: string = '' + id;
        let padding = '';
        name = name + '-';
        for (let i = 0; i < length; i++) { padding += '0'; }
        invoiceNo += padding.substring(0, padding.length - invoiceId.length) + invoiceId;
        return (name + invoiceNo);
    }

    /** To show alert to user if item is clicked and current stock is zero */
    outOfStockItemAlert(item: IProductItemsData, countValue: number, type: string) {
        // this.translateService.get(['isoutofstock', 'Doyouwanttocontinue', 'No', 'Yes']).subscribe(ConvertedData => {
        //     const message = item.name + ConvertedData.isoutofstock;
        //     const alert = this.alertCtrl.create({
        //         title: message,
        //         message: ConvertedData.Doyouwanttocontinue,
        //         buttons: [
        //             {
        //                 text: ConvertedData.No,
        //                 role: 'cancel',
        //                 handler: () => {
        //                     console.log('Cancel clicked');
        //                     if ('ItemCountUpdatedOnCustomQuantityEdit' === type) {
        //                         item.count = 0;
        //                         // this.event.publish('UpdateCustomQuantityDataEdit', item, false);
        //                     }
        //                     if ('BarCodeScanOutOfStockAlert' === type) {
        //                         // this.event.publish('BarCodeScanOutOfStockAlert', item, false);
        //                     }
        //                 }
        //             },
        //             {
        //                 text: ConvertedData.Yes,
        //                 handler: () => {
        //                     item.isNegativeStockAllowed = true;
        //                     item.mainStock = true;
        //                     if ('ItemClicked' === type) { this.showCount(item, 0); }
        //                     if ('ItemCountClicked' === type) {
        //                         item.count += countValue;
        //                         item.currentStock -= countValue;
        //                         // Setting the value in the alert controller
        //                         const alterControlInput = this.winRef.nativeWindow.document.getElementsByClassName('alert-input');
        //                         if (alterControlInput.length) {
        //                             console.log('alterControlInput', alterControlInput);
        //                             alterControlInput[0].value = item.count;
        //                             alterControlInput[0].setAttribute('placeholder', item.count);
        //                         }
        //                     }
        //                     if ('ItemCountUpdatedOnSaleEdit' === type) {
        //                         this.footerData.totalBillPrice -= item.discountedPrice * item.count;
        //                         item.count = countValue;
        //                         item.currentStock = -(countValue);
        //                         this.footerData.totalBillPrice += (item.discountedPrice * countValue);
        //                         // this.event.publish('UpdatedItemForCart');
        //                     }

        //                     if ('ItemCountUpdatedOnCustomQuantityEdit' === type) {
        //                         item.isNegativeStockAllowed = true;
        //                         item.mainStock = true;
        //                         item.isNegativeStockAllowed = true;
        //                         item.mainStock = true;
        //                         // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        //                         if (item.isMaintainStock) { item.currentStock = Number(Number(item.currentStock - Number(item.customQuantityData)).toFixed(2)); }
        //                         item.count = Number(item.customQuantityData);
        //                         this.footerData.totalBillPrice += Number(item.count * item.discountedPrice);
        //                         this.footerData.totalItemsAdded += Number(item.customQuantityData);
        //                         this.footerData.totalItemsAdded = Number(this.footerData.totalItemsAdded.toFixed(2));
        //                         for (const itemlist of this.itemList) {
        //                             if (itemlist.id === item.id) {
        //                                 itemlist.currentStock = item.currentStock;
        //                             }
        //                         }
        //                         // this.event.publish('UpdateCustomQuantityDataEdit', item, true);
        //                     }
        //                     if ('BarCodeScanOutOfStockAlert' === type) {
        //                         item.isNegativeStockAllowed = true;
        //                         // this.event.publish('BarCodeScanOutOfStockAlert', item, true);
        //                     }
        //                     // this.event.publish('ReloadFooterDataOnCategoryPage', this.footerData, this.getCartItems());
        //                 }
        //             }
        //         ],
        //         cssClass: 'alertClosePage'
        //     });
        //     alert.present();
        // });
    }

    /** To get more items when loading the data using infinite scroll */
    getMoreItems(receivedItemIDs: number[], key: number, callback) {
        this.getItemsFromDB(receivedItemIDs, key).then((items: IProductItemsData[]) => {
            if (items && items.length) {
                for (const item of items) {
                    this.itemList.push(item);
                    this.receivedItemIDs.push(item.id);
                }
            }
            callback(items);
        });
    }

    /** To get more items when loading the data using infinite scroll with Category ID */
    getMoreCategoryItems(categoryId: number, receivedItemIDs: number[], key: number, callback) {
        this.getItemsList(categoryId, receivedItemIDs, key).then((items: IProductItemsData[]) => {
            if (items && items.length) {
                for (const item of items) {
                    this.itemList.push(item);
                    this.receivedItemIDs.push(item.id);
                }
            }
            callback(items);
        });
    }
}
