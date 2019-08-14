export interface IItem {

}

export interface IItemCategory {
ItemCategoryID?: number;
ItemCategory_Name: string;
ItemCategory_Desc?: string;
ItemCategory_ImagePath?: string;
ItemCategory_ImageCss?: string;
ItemCategory_ImageString?: string;
isActive?: number;
}
export class ItemCategoryModule implements IItemCategory {
ItemCategoryID?: number;
ItemCategory_Name: string;
ItemCategory_Desc?: string;
ItemCategory_ImagePath?: string;
ItemCategory_ImageCss?: string;
ItemCategory_ImageString?: string;
isActive?: number;

}
