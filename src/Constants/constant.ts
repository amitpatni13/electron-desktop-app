export class ConstantMessages {// Need to verify in all the pages
    public static excelFileName = {
        INVENTORY_REPORT: 'Inventory_Report',
        PROFIT_LOSS_REPORT: 'Profit_&_Loss_Report',
        SALES_REPORT: 'Sales_Report',
        PURCHASE_REPORT: 'Purchase_Report',
        LOW_STOCK_SUMMARY_REPORT: 'Low_Stock_Summary_Report'
    };

    // DigiBill Key and Iv for encrypting and decryption of data
    public static encryptionKey = {
        BACKUP_RESTORE_KEY: '#DigiBillDB@Key#',
        BACKUP_RESTORE_IV: '#DigiBillDB@Iv#'
    };

    public static partyRegistrationTypes = {
        REGISTERED: 'Registered',
        REGISTERED_UNDER_COMPOSITE: 'Registered Under Composite',
        UNREGISTERED: 'Unregistered'
    };

    public static googleGeoCoding = {
        GEO_CODE_URL: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
        LICENSE_KEY: 'AIzaSyDP2SaRQbK_HURA1qtfp4cMijZAJ2Hkdx4'
    };
    public static screenShot = {
        FILE_NAME: 'helpScreenShot',
        MAIL_SUBJECT: 'Give a Title',
        FILE_PATH: 'file:///storage/emulated/0/Pictures/'
    };
    public static ReportPageColumn = [{
        PageName: 'PartyStatement',
        Header1: { Value: 'InvoiceDate', column1: 'Date', sortBy: 'desc' },
        Header2: { Value: 'PartyName', column2: 'Party', sortBy: 'asc' },
        Header3: { Value: 'TransactionType', column3: 'Transaction Type', sortBy: 'asc' },
        Header4: { Value: 'TotalPayable', column4: 'Total', sortBy: 'desc' },
        Header5: { Value: 'Balance', column5: 'Balance', sortBy: 'desc' },
        Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'DailyAccounts',
        Header1: { Value: 'TransactionType', column1: 'Transaction', sortBy: 'asc' },
        Header2: { Value: 'TotalAmount', column2: 'Total', sortBy: 'desc' },
        Header3: { Value: 'paymentIn', column3: 'Payment In', sortBy: 'desc' },
        Header4: { Value: 'paymentOut', column4: 'Payment Out', sortBy: 'desc' },
        Header5: { Value: '', column5: '', sortBy: '' },
        Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'InventoryReport',
        Header1: { Value: 'ItemName', column1: 'Item Name', sortBy: 'asc' },
        Header2: { Value: 'PurchasePrice', column2: 'Purchase Price', sortBy: 'desc' },
        Header3: { Value: 'SellingPrice', column3: 'Selling Price', sortBy: 'desc' },
        Header4: { Value: 'CurrentStock', column4: 'Current Stock', sortBy: 'desc' },
        Header5: { Value: 'TaxAmount', column5: 'Tax Amount', sortBy: 'desc' },
        Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'SalesReport',
        Header1: { Value: 'TotalPayable', column1: 'Total Payable', sortBy: 'desc' },
        Header2: { Value: 'InvoiceDate', column2: 'Invoice Date', sortBy: 'desc' },
        Header3: { Value: 'PartyName', column3: 'Party Name', sortBy: 'asc' },
        Header4: { Value: 'InvoiceNumber', column4: 'Invoice Number', sortBy: 'desc' },
        Header5: { Value: '', column5: '', sortBy: '' },
        Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'PurchaseReport',
        Header1: { Value: 'TotalAmount', column1: 'Total Amount', sortBy: 'desc' },
        Header2: { Value: 'PurchaseInvoiceDate', column2: 'Purchase Invoice Date', sortBy: 'desc' },
        Header3: { Value: 'PartyName', column3: 'Party Name', sortBy: 'asc' },
        Header4: { Value: 'PurchaseInvoiceNumber', column4: 'Invoice Number', sortBy: 'desc' },
        Header5: { Value: '', column5: '', sortBy: '' }, Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'SaveDraftReport',
        Header1: { Value: 'TotalPayable', column1: 'Total Payable', sortBy: 'desc' },
        Header2: { Value: 'InvoiceDate', column2: 'Invoice Date', sortBy: 'desc' },
        Header3: { Value: 'PartyName', column3: 'Party Name', sortBy: 'asc' },
        Header4: { Value: 'InvoiceNumber', column4: 'Invoice Number', sortBy: 'desc' },
        Header5: { Value: '', column5: '', sortBy: '' },
        Header6: { Value: '', column6: '', sortBy: '' }
    }, {
        PageName: 'LowStockSummary',
        Header1: { Value: 'ItemCategory_Name', column1: 'Category Name', sortBy: 'asc' },
        Header2: { Value: 'ItemName', column2: 'Item Name', sortBy: 'asc' },
        Header3: { Value: 'PurchasePrice', column3: 'Purchase Price', sortBy: 'desc' },
        Header4: { Value: 'SellingPrice', column4: 'Selling Price', sortBy: 'desc' },
        Header5: { Value: 'CurrentStock', column5: 'Current Stock', sortBy: 'desc' },
        Header6: { Value: 'TaxAmount', column6: 'Tax Amount', sortBy: 'desc' }
    }];

    public static IndianStates = [
        { code: '', name: '-SelectState--' },
        { code: '01', name: 'Jammu And Kashmir' },
        { code: '02', name: 'Himachal Pradesh' },
        { code: '03', name: 'Punjab' },
        { code: '04', name: 'Chandigarh' },
        { code: '05', name: 'Uttarakhand' },
        { code: '06', name: 'Haryana' },
        { code: '07', name: 'Delhi' },
        { code: '08', name: 'Rajasthan' },
        { code: '09', name: 'Uttar Pradesh' },
        { code: '10', name: 'Bihar' },
        { code: '11', name: 'Sikkim' },
        { code: '12', name: 'Arunachal Pradesh' },
        { code: '13', name: 'Nagaland' },
        { code: '14', name: 'Manipur' },
        { code: '15', name: 'Mizoram' },
        { code: '16', name: 'Tripura' },
        { code: '17', name: 'Meghlaya' },
        { code: '18', name: 'Assam' },
        { code: '19', name: 'West Bengal' },
        { code: '20', name: 'Jharkhand' },
        { code: '21', name: 'Odisha' },
        { code: '22', name: 'Chattisgarh' },
        { code: '23', name: 'Madhya Pradesh' },
        { code: '24', name: 'Gujarat' },
        { code: '25', name: 'Daman and Diu' },
        { code: '26', name: 'Dadra and Nagar Haveli' },
        { code: '27', name: 'Maharashtra' },
        { code: '28', name: 'Andhra Pradesh' },
        { code: '29', name: 'Karnataka' },
        { code: '30', name: 'Goa' },
        { code: '31', name: 'Lakshwadeep' },
        { code: '32', name: 'Kerala' },
        { code: '33', name: 'Tamil Nadu' },
        { code: '34', name: 'Puducherry' },
        { code: '35', name: 'Andaman and Nicobar Islands' },
        { code: '36', name: 'Telangana' },
        { code: '37', name: 'Andhra Pradesh (New)' }
    ];

    public static NO_STATE_SELECTED = '-SelectState--';

    public static TypeOfGSTRegistration = 'Registered Under Composite';

    public static TypeOfBizList = [
        { code: '01', name: 'Wholesale' },
        { code: '02', name: 'Distributor' },
        { code: '03', name: 'Reseller' },
        { code: '04', name: 'Dealer' },
        { code: '05', name: 'Vendor' },
        { code: '06', name: 'Supplier' },
        { code: '07', name: 'Manufacturer' },
        { code: '08', name: 'Brand' },
        { code: '09', name: 'Retailer' },
        { code: '10', name: 'Service Provider' },
        { code: '11', name: 'Home Based Business' },
        { code: '12', name: 'Other' }
    ];
    public static GSTRegistrationType = [
        { code: '01', name: 'Unregistered' },
        { code: '02', name: 'Registered Under Composite' },
        { code: '03', name: 'Registered' },
    ];

    public static PaymentTerms = [
        { code: '01', duration: 'Due On Receipt' },
        { code: '02', duration: 'NET 15 Days' },
        { code: '03', duration: 'NET 30 Days' },
        { code: '04', duration: 'NET 45 Days' },
        { code: '05', duration: 'NET 60 Days' },
        { code: '06', duration: 'NET 90 Days' }
    ];

    public static DefaultPaymentTermDuration = 'Due On Receipt';

    public static GSTTaxRate = [
        { TaxSlabID: 1, TaxSlabValue: 0.0, TaxSlabName: 'GST@0%' },
        { TaxSlabID: 4, TaxSlabValue: 0.05, TaxSlabName: 'GST@5%' },
        { TaxSlabID: 6, TaxSlabValue: 0.12, TaxSlabName: 'GST@12%' },
        { TaxSlabID: 8, TaxSlabValue: 0.18, TaxSlabName: 'GST@18%' },
        { TaxSlabID: 10, TaxSlabValue: 0.28, TaxSlabName: 'GST@28%' },
        { TaxSlabID: 12, TaxSlabValue: 0.0025, TaxSlabName: 'GST@0.25%' },
        { TaxSlabID: 13, TaxSlabValue: 0.03, TaxSlabName: 'GST@3%' },
    ];
    public static IGSTTaxRate = [
        { TaxSlabID: 2, TaxSlabValue: 0.0, TaxSlabName: 'IGST@0%' },
        { TaxSlabID: 3, TaxSlabValue: 0.03, TaxSlabName: 'IGST@3%' },
        { TaxSlabID: 5, TaxSlabValue: 0.05, TaxSlabName: 'IGST@5%' },
        { TaxSlabID: 7, TaxSlabValue: 0.12, TaxSlabName: 'IGST@12%' },
        { TaxSlabID: 9, TaxSlabValue: 0.18, TaxSlabName: 'IGST@18%' },
        { TaxSlabID: 11, TaxSlabValue: 0.28, TaxSlabName: 'IGST@28%' },
        { TaxSlabID: 14, TaxSlabValue: 0.0025, TaxSlabName: 'IGST@0.25%' },
        { TaxSlabID: 15, TaxSlabValue: 0.0, TaxSlabName: 'Exempted' }
    ];

    public static databaseTables = [
        {
            table: 'ItemCategory', structure: [{
                ColumnName: 'ItemCategoryID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'ItemCategory_Name',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'ItemCategory_Desc',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemCategory_ImagePath',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemCategory_ImageString',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemCategory_ImageCss',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'categoryUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }
            ]
        }, {
            table: 'ExpenseList', structure: [{
                ColumnName: 'ExpenseID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'ExpenseAmount',
                type: 'INTEGER'
            }, {
                ColumnName: 'ExpenseDate',
                type: 'TEXT'
            }, {
                ColumnName: 'ReceiptDate',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpensePaidTo',
                type: 'TEXT'
            }, {
                ColumnName: 'PartyID',
                type: 'INTEGER'
            }, {
                ColumnName: 'ExpenseGST',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseCESS',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseDetails',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseCategoryID',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseAttachment',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ExpenseUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }
            ]
        },
        {
            table: 'ExpenseCategory', structure: [{
                ColumnName: 'ExpenseCategoryID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'ExpenseCategoryName',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseCategoryColor',
                type: 'TEXT'
            }, {
                ColumnName: 'ExpenseCategoryDate',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Business', structure: [{
                ColumnName: 'BusinessID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'Name',
                type: 'TEXT'
            }, {
                ColumnName: 'Address',
                type: 'TEXT'
            }, {
                ColumnName: 'City',
                type: 'TEXT'
            }, {
                ColumnName: 'State',
                type: 'TEXT'
            }, {
                ColumnName: 'PinCode',
                type: 'INTEGER'
            }, {
                ColumnName: 'GSTIN',
                type: 'TEXT'
            }, {
                ColumnName: 'PAN',
                type: 'TEXT'
            }, {
                ColumnName: 'CIN',
                type: 'TEXT'
            }, {
                ColumnName: 'ContactNumber',
                type: 'INTEGER'
            }, {
                ColumnName: 'Email',
                type: 'TEXT'
            }, {
                ColumnName: 'Password',
                type: 'TEXT'
            }, {
                ColumnName: 'LogoImagePath',
                type: 'TEXT'
            }, {
                ColumnName: 'RegisterDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'ExpiryDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'TypeOfBiz',
                type: 'TEXT'
            }, {
                ColumnName: 'ProductType',
                type: 'TEXT'
            }, {
                ColumnName: 'GSTRegistrationType',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActive',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'CampaignID',
                type: 'NUMERIC DEFAULT 2'
            }]
        },
        {
            table: 'InvoiceConfiguration', structure: [{
                ColumnName: 'InvoiceConfigID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'InvoiceConfigFieldName',
                type: 'TEXT'
            }, {
                ColumnName: 'InvoiceConfigFieldValue',
                type: 'INTEGER'
            }, {
                ColumnName: 'InvoiceTemplateID',
                type: 'INTEGER'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'HSN_SAC', structure: [{
                ColumnName: 'HSNID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'HSNCode',
                type: 'INTEGER'
            }, {
                ColumnName: 'Description',
                type: 'TEXT'
            }, {
                ColumnName: 'Rate',
                type: 'INTEGER'
            }, {
                ColumnName: 'CESS',
                type: 'INTEGER'
            }, {
                ColumnName: 'Chapter',
                type: 'TEXT'
            }, {
                ColumnName: 'EffectiveFrom',
                type: 'TEXT'
            }, {
                ColumnName: 'RelatedExportImportHSNCodes',
                type: 'TEXT'
            }]
        },
        {
            table: 'RecentActivity', structure: [{
                ColumnName: 'ActivityID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'ActivityMessage',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityComponentPage',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityIcon',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityTimeStamp',
                type: 'DATE'
            }, {
                ColumnName: 'DeviceMACAddress',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParam1',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParamValue1',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParam2',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParamValue2',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParam3',
                type: 'TEXT'
            }, {
                ColumnName: 'ActivityParamValue3',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Reminder', structure: [{
                ColumnName: 'ReminderID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'ReminderType',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderMessage',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderComponentPage',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderTimeStamp',
                type: 'DATE'
            }, {
                ColumnName: 'ReminderDate',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderCustomData',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderInvoiceId',
                type: 'TEXT'
            }, {
                ColumnName: 'ReminderShown',
                type: 'TEXT DEFAULT 0'
            }, {
                ColumnName: 'isActivate',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Sector', structure: [{
                ColumnName: 'SectorID',
                type: 'INTEGER NOT NULL PRIMARY KEY'
            }, {
                ColumnName: 'Sector_Name',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'Sector_tickId',
                type: 'TEXT'
            }, {
                ColumnName: 'Sector_img',
                type: 'TEXT'
            }, {
                ColumnName: 'Sector_title',
                type: 'TEXT'
            }
            ]
        },
        {
            table: 'Category', structure: [{
                ColumnName: 'CategoryID',
                type: 'INTEGER NOT NULL PRIMARY KEY'
            }, {
                ColumnName: 'SectorID',
                type: 'TEXT'
            }, {
                ColumnName: 'Category_Name',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'Category_tickId',
                type: 'TEXT'
            }, {
                ColumnName: 'Category_img',
                type: 'TEXT'
            }, {
                ColumnName: 'Category_title',
                type: 'TEXT'
            }
            ]
        },
        {
            table: 'ProductInventory', structure: [{
                ColumnName: 'ChangeSetID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'name',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemID',
                type: 'INTEGER'
            }, {
                ColumnName: 'Date',
                type: 'TEXT'
            }, {
                ColumnName: 'QtyChanged',
                type: 'INTEGER SIGNED'
            }, {
                ColumnName: 'Reason',
                type: 'TEXT'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'TransactionType',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Payment', structure: [{
                ColumnName: 'id',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'BillType',
                type: 'TEXT'
            }, {
                ColumnName: 'PartyId',
                type: 'TEXT'
            }, {
                ColumnName: 'AmountPaid',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Balance',
                type: 'NUMERIC'
            }, {
                ColumnName: 'PaymentMode',
                type: 'TEXT'
            }, {
                ColumnName: 'PaymentNote',
                type: 'TEXT'
            }, {
                ColumnName: 'PaymentImage',
                type: 'TEXT'
            }, {
                ColumnName: 'PaymentDate',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PaymentUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PaymentType',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'PaymentInvoiceMapping', structure: [{
                ColumnName: 'id',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'PaymentID',
                type: 'INTEGER'
            }, {
                ColumnName: 'InvoiceId',
                type: 'INTEGER'
            }, {
                ColumnName: 'InvoiceNumber',
                type: 'TEXT'
            }, {
                ColumnName: 'AmountPaid',
                type: 'NUMERIC'
            }, {
                ColumnName: 'PaymentDate',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PaymentUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'PurchaseInvoices', structure: [{
                ColumnName: 'PurchaseInvoiceID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'PurchaseInvoiceDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'PurchaseInvoiceNumber',
                type: 'TEXT'
            }, {
                ColumnName: 'PurchaseReceiptDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'PartyID',
                type: 'INTEGER'
            }, {
                ColumnName: 'PartyName',
                type: 'TEXT'
            }, {
                ColumnName: 'InvoiceAmount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'AmountPaid',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalAmount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalTax',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalDue',
                type: 'NUMERIC'
            }, {
                ColumnName: 'PaymentModeID',
                type: 'INTEGER'
            }, {
                ColumnName: 'PaymentRef',
                type: 'TEXT'
            }, {
                ColumnName: 'PaymentRefImagePath',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'otherCosts',
                type: 'NUMERIC'
            }, {
                ColumnName: 'IsPurchaseReturn',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'reverseCharge',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'PurchaseDraftInvoices', structure: [{
                ColumnName: 'PurchaseInvoiceID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'PurchaseInvoiceDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'PurchaseInvoiceNumber',
                type: 'TEXT'
            }, {
                ColumnName: 'PurchaseReceiptDate',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'PartyID',
                type: 'INTEGER'
            }, {
                ColumnName: 'PartyName',
                type: 'TEXT'
            }, {
                ColumnName: 'InvoiceAmount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'AmountPaid',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalAmount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalTax',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TotalDue',
                type: 'NUMERIC'
            }, {
                ColumnName: 'PaymentModeID',
                type: 'INTEGER'
            }, {
                ColumnName: 'PaymentRef',
                type: 'TEXT'
            }, {
                ColumnName: 'PaymentRefImagePath',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'otherCosts',
                type: 'NUMERIC'
            }, {
                ColumnName: 'reverseCharge',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'isPurchaseQuotation',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseQuotationStatus',
                type: 'TEXT'
            }]
        },
        {
            table: 'PurchaseInvoiceItems', structure: [{
                ColumnName: 'PurchaseInvoiceItemID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'PurchaseInvoiceNo',
                type: 'INTEGER NOT NULL'
            }, {
                ColumnName: 'Item_ID',
                type: 'INTEGER'
            }, {
                ColumnName: 'ItemName',
                type: 'TEXT'
            }, {
                ColumnName: 'PurchasePrice',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Quantity',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab1',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab2',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab3',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab4',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab1Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab2Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab3Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab4Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'NetAmountReceivable',
                type: 'NUMERIC'
            }, {
                ColumnName: 'HSNCode',
                type: 'NUMERIC'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'purchaseItemUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'Measurement',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'PurchaseDraftInvoiceItems', structure: [{
                ColumnName: 'PurchaseInvoiceItemID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'PurchaseInvoiceNo',
                type: 'INTEGER NOT NULL'
            }, {
                ColumnName: 'Item_ID',
                type: 'INTEGER'
            }, {
                ColumnName: 'ItemName',
                type: 'TEXT'
            }, {
                ColumnName: 'PurchasePrice',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Quantity',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab1',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab2',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab3',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab4',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab1Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab2Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab3Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab4Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'NetAmountReceivable',
                type: 'NUMERIC'
            }, {
                ColumnName: 'HSNCode',
                type: 'NUMERIC'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'Measurement',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'SalesInvoiceItems', structure: [{
                ColumnName: 'SalesInvoiceItemID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'SalesInvoiceNo',
                type: 'INTEGER NOT NULL'
            }, {
                ColumnName: 'Item_ID',
                type: 'INTEGER'
            }, {
                ColumnName: 'ItemName',
                type: 'TEXT'
            }, {
                ColumnName: 'SellingPrice',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Quantity',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab1',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab2',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab3',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab4',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab1Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab2Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab3Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab4Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'NetAmountReceivable',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Discount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'HSNCode',
                type: 'NUMERIC'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleItemUpdated',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SellingPriceTax',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'IsSellingPriceTaxInclusive',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'Measurement',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'Item_Desc',
                type: 'TEXT'
            }]
        },
        {
            table: 'DraftSalesInvoiceItems', structure: [{
                ColumnName: 'SalesInvoiceItemID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'SalesInvoiceNo',
                type: 'INTEGER NOT NULL'
            }, {
                ColumnName: 'Item_ID',
                type: 'INTEGER'
            }, {
                ColumnName: 'ItemName',
                type: 'TEXT'
            }, {
                ColumnName: 'SellingPrice',
                type: 'NUMERIC'
            }, {
                ColumnName: 'maximumRetailPrice',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Quantity',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab1',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab2',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab3',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab4',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlab1Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab2Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab3Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'TaxSlab4Amt',
                type: 'NUMERIC'
            }, {
                ColumnName: 'NetAmountReceivable',
                type: 'NUMERIC'
            }, {
                ColumnName: 'Discount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'HSNCode',
                type: 'NUMERIC'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'SellingPriceTax',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'IsSellingPriceTaxInclusive',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'Measurement',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'Item_Desc',
                type: 'TEXT'
            }]
        },
        {
            table: 'Item', structure: [{
                ColumnName: 'Item_ID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'ItemCategory_ID',
                type: 'INTEGER NOT NULL'
            },
            {
                ColumnName: 'ItemName',
                type: 'Text NOT NULL'
            },

            {
                ColumnName: 'HSN_SAC',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemName',
                type: 'Text NOT NULL'
            },
            {
                ColumnName: 'barcode',
                type: 'TEXT'
            }, {
                ColumnName: 'Item_Desc',
                type: 'TEXT'
            }, {
                ColumnName: 'Item_Weight',
                type: 'NUMERIC'
            }, {
                ColumnName: 'ItemImagePath',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemImageString',
                type: 'TEXT'
            }, {
                ColumnName: 'ItemImageCss',
                type: 'Text'
            },
            {
                ColumnName: 'PurchasePrice',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'SellingPrice',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'isSellingPriceTaxInclusive',
                type: 'INTEGER'
            },
            {
                ColumnName: 'isPurchasePriceTaxInclusive',
                type: 'INTEGER'
            },

            {
                ColumnName: 'IsMaintainStock',
                type: 'INTEGER'
            },
            {
                ColumnName: 'ItemMeasurementMasterID',
                type: 'INTEGER'
            },
            {
                ColumnName: 'ItemMeasurementFieldCode',
                type: 'TEXT'
            },
            {
                ColumnName: 'CurrentStock',
                type: 'INTEGER'
            }, {
                ColumnName: 'MinStockNotification',
                type: 'INTEGER'
            },
            {
                ColumnName: 'AllowNegativeStock',
                type: 'INTEGER'
            }, {
                ColumnName: 'Brand',
                type: 'TEXT'
            }, {
                ColumnName: 'TaxSlabID1',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlabID2',
                type: 'INTEGER'
            }, {
                ColumnName: 'TaxSlabID3',
                type: 'INTEGER'
            },
            {
                ColumnName: 'TaxSlabID4',
                type: 'INTEGER'
            },
            {
                ColumnName: 'TaxSlab1Amt',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TaxSlab2Amt',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TaxSlab3Amt',
                type: 'NUMERIC'
            },

            {
                ColumnName: 'TaxSlab4Amt',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'CreatedDate',
                type: 'TEXT'
            },
            {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            },
            {
                ColumnName: 'DiscountedPrice',
                type: 'INTEGER'
            },
            {
                ColumnName: 'ItemSold',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'itemUpdated',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'customQuantityFlag',
                type: 'INTEGER DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        }, {
            table: 'TaxSlabs', structure: [{
                ColumnName: 'TaxSlabID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'TaxSlabName',
                type: 'TEXT NOT NULL'
            },
            {
                ColumnName: 'TaxSlabValue',
                type: 'NUMERIC NOT NULL'
            },
            {
                ColumnName: 'CreatedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        }, {
            table: 'Party', structure: [{
                ColumnName: 'PartyID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'PartyName',
                type: 'TEXT NOT NULL'
            },
            {
                ColumnName: 'ContactNumber',
                type: 'INTEGER'
            },
            {
                ColumnName: 'BillingAddress',
                type: 'TEXT'
            },
            {
                ColumnName: 'BillingCity',
                type: 'TEXT'
            },
            {
                ColumnName: 'BillingState',
                type: 'TEXT'
            },
            {
                ColumnName: 'BillingPincode',
                type: 'INTEGER'
            },
            {
                ColumnName: 'ShippingAddress',
                type: 'TEXT'
            },
            {
                ColumnName: 'ShippingCity',
                type: 'TEXT'
            },
            {
                ColumnName: 'ShippingState',
                type: 'TEXT'
            },
            {
                ColumnName: 'ShippingPincode',
                type: 'INTEGER'
            },
            {
                ColumnName: 'GSTIN',
                type: 'TEXT'
            },
            {
                ColumnName: 'Email',
                type: 'TEXT'
            },
            {
                ColumnName: 'OutstandingBalance',
                type: 'INTEGER'
            },
            {
                ColumnName: 'CreatedOn',
                type: 'TEXT'
            },
            {
                ColumnName: 'RegistrationType',
                type: 'TEXT'
            },
            {
                ColumnName: 'PaymentTerms',
                type: 'TEXT'
            },
            {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'partyUpdated',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'CreditPoints',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'CreditLimits',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'TemporaryParty',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {

            table: 'SalesInvoices', structure: [{
                ColumnName: 'SalesInvoiceID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'InvoiceDate',
                type: 'TEXT NOT NULL'
            },
            {
                ColumnName: 'InvoiceNumber',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceDueDate',
                type: 'TEXT'
            },
            {
                ColumnName: 'PartyID',
                type: 'INTEGER'
            },
            {
                ColumnName: 'PartyName',
                type: 'TEXT'
            },
            {
                ColumnName: 'Status',
                type: 'TEXT'
            },
            {
                ColumnName: 'TotalAmount',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'Discount',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'OtherCosts',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TotalTax',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TotalPayable',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'AmountReceived',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'PaymentModeID',
                type: 'INTEGER'
            },
            {
                ColumnName: 'PaymentRef',
                type: 'TEXT'
            },
            {
                ColumnName: 'PaymentRefImagePath',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceShared',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceNote',
                type: 'Text'
            },
            {
                ColumnName: 'Eway',
                type: 'TEXT'
            },
            {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            },
            {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'SaleUpdated',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'IsSaleReturn',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'CreditsUsed',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'InvoiceType',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]

        }, {

            table: 'DraftSalesInvoices', structure: [{
                ColumnName: 'SalesInvoiceID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'InvoiceDate',
                type: 'TEXT NOT NULL'
            },
            {
                ColumnName: 'InvoiceNumber',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceDueDate',
                type: 'TEXT'
            },
            {
                ColumnName: 'PartyID',
                type: 'INTEGER'
            },
            {
                ColumnName: 'PartyName',
                type: 'TEXT'
            },
            {
                ColumnName: 'Status',
                type: 'TEXT'
            },
            {
                ColumnName: 'TotalAmount',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'Discount',
                type: 'NUMERIC'
            }, {
                ColumnName: 'DiscountIn',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'OtherCosts',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TotalTax',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'TotalPayable',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'AmountReceived',
                type: 'NUMERIC'
            },
            {
                ColumnName: 'PaymentModeID',
                type: 'INTEGER'
            },
            {
                ColumnName: 'PaymentRef',
                type: 'TEXT'
            },
            {
                ColumnName: 'PaymentRefImagePath',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceShared',
                type: 'TEXT'
            },
            {
                ColumnName: 'InvoiceNote',
                type: 'Text'
            }, {
                ColumnName: 'SaleDraftPage',
                type: 'Text'
            },
            {
                ColumnName: 'categoryPageRedirect',
                type: 'Text'
            },
            {
                ColumnName: 'categoryPageRedirectName',
                type: 'Text'
            },
            {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            },
            {
                ColumnName: 'InvoiceType',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'isSaleQuotation',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleQuotationStatus',
                type: 'TEXT'
            }, {
                ColumnName: 'Eway',
                type: 'TEXT'
            }]
        },
        {
            table: 'AnalyticsData', structure: [{
                ColumnName: 'LastSaleDoneOn',
                type: 'TEXT'
            }, {
                ColumnName: 'LastPurchaseDoneOn',
                type: 'TEXT'
            }, {
                ColumnName: 'LastItemAddedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'LastCategoryCreatedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'LastExpenseCreatedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'LastAppStartedon',
                type: 'TEXT'
            }, {
                ColumnName: 'LastAppUsedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'TimeSpent',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'DailyAccountsReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR1Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR2Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR3BReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR9Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'InventoryStockReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'LowStockSummaryReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PartyStatementReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ProductLevelInventoryReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ProfitAndLostReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseDraftReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SalesDraftReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'YearEndingReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'AppsubscriptionPage',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'subscriptionContactInformation',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'MonthlySubscriptionSuccess',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'AnuallySubscriptionSucess',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'FailurePayment',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleAppWalkThrough',
                type: 'TEXT'
            }, {
                ColumnName: 'InventoryAppWalkThrough',
                type: 'TEXT'
            }, {
                ColumnName: 'SaleQuotationReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseQuotationReport',
                type: 'NUMERIC DEFAULT 0'
            }]
        },
        {
            table: 'AnalyticsDataForDay', structure: [{
                ColumnName: 'ID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'SalesAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchasesAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ExpensesAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PartiesAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ItemsAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'CategoriesAdded',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'TimeSpent',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'DailyAccountsReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR1Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR2Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR3BReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'GSTR9Report',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'InventoryStockReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'LowStockSummaryReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PartyStatementReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ProductLevelInventoryReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ProfitAndLostReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseDraftReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SalesDraftReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'YearEndingReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'InsertedDate',
                type: 'TEXT'
            }, {
                ColumnName: 'CampaignID',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'SaleQuotationReport',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'PurchaseQuotationReport',
                type: 'NUMERIC DEFAULT 0'
            }]
        },
        {
            table: 'TimeSpentPerSession', structure: [{
                ColumnName: 'ID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'SessionTime',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'InsertedDate',
                type: 'NUMERIC DEFAULT 0'
            }]
        }, {
            table: 'PaymentGateWay', structure: [{
                ColumnName: 'ID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'OrderID',
                type: 'TEXT'
            },
            {
                ColumnName: 'PaymentCompleted',
                type: 'NUMERIC DEFAULT 0'
            },
            {
                ColumnName: 'CreatedDate',
                type: 'TEXT'
            }]
        },
        {
            table: 'MeasurementUnit', structure: [{
                ColumnName: 'MeasurementID',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'MeasurementName',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'MeasurementCode',
                type: 'TEXT'
            }, {
                ColumnName: 'GroupID',
                type: 'TEXT'
            }, {
                ColumnName: 'Ratio',
                type: 'TEXT'
            }, {
                ColumnName: 'RatioID',
                type: 'TEXT'
            }, {
                ColumnName: 'CreatedOn',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Databases', structure: [{
                ColumnName: 'id',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'dbName',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'location',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'financialYear',
                type: 'TEXT'
            }, {
                ColumnName: 'isActive',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'isArchived',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'CreatedDate',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        },
        {
            table: 'Backup', structure: [{
                ColumnName: 'id',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'fileName',
                type: 'TEXT'
            }, {
                ColumnName: 'filePath',
                type: 'TEXT'
            }, {
                ColumnName: 'fileId',
                type: 'TEXT'
            }, {
                ColumnName: 'databaseId',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'isReadOnly',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'isUploadedToGoogleDrive',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'CreatedDate',
                type: 'TEXT'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        }, {
            table: 'userBankDetails', structure: [{
                ColumnName: 'userBankId',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            },
            {
                ColumnName: 'userName',
                type: 'TEXT NOT NULL'
            }, {
                ColumnName: 'bankName',
                type: 'TEXT'
            }, {
                ColumnName: 'accountNumber',
                type: 'TEXT'
            }, {
                ColumnName: 'currentBalance',
                type: 'TEXT'
            }, {
                ColumnName: 'createdDate',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        }, {
            table: 'userTransactionDetails', structure: [{
                ColumnName: 'transactionId',
                type: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
            }, {
                ColumnName: 'userBankId',
                type: 'NUMERIC'
            }, {
                ColumnName: 'transactionName',
                type: 'TEXT'
            }, {
                ColumnName: 'paymentMode',
                type: 'NUMERIC'
            }, {
                ColumnName: 'transactionDescription',
                type: 'TEXT'
            }, {
                ColumnName: 'creditAmount',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'debitAmount',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'toOrForTransactionId',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'transactionTypeId',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'transactionColor',
                type: 'TEXT'
            }, {
                ColumnName: 'transactionPageName',
                type: 'TEXT'
            }, {
                ColumnName: 'createdDate',
                type: 'TEXT'
            }, {
                ColumnName: 'IsActivate',
                type: 'NUMERIC DEFAULT 1'
            }, {
                ColumnName: 'ServerSync',
                type: 'NUMERIC DEFAULT 0'
            }, {
                ColumnName: 'BusinessID',
                type: 'NUMERIC DEFAULT 1'
            }]
        }
    ];
    public static TransactionDateAnalytics = {
        SALE: 'LastSaleDoneOn',
        PURCHASE: 'LastPurchaseDoneOn',
        ITEM: 'LastItemAddedOn',
        CATEGORY: 'LastCategoryCreatedOn',
        EXPENSE: 'LastExpenseCreatedOn',
        LASTUSED: 'LastAppUsedOn',
        STARTEDON: 'LastAppStartedon',
        DAILYACCOUNT: 'DailyAccountsReport',
        GSTR1: 'GSTR1Report',
        GSTR2: 'GSTR2Report',
        GSTR3B: 'GSTR3BReport',
        GSTR9: 'GSTR9Report',
        INVENTORY: 'InventoryStockReport',
        LOWSTOCK: 'LowStockSummaryReport',
        PARTYSTATEMENT: 'PartyStatementReport',
        PRODUCTLEVELINVENTORY: 'ProductLevelInventoryReport',
        PROFITANDLOSS: 'ProfitAndLostReport',
        PURCHASEDRAFTREPORT: 'PurchaseDraftReport',
        PURCHASEREPORT: 'PurchaseReport',
        SALEREPORT: 'SaleReport',
        SALEDRAFTREPORT: 'SalesDraftReport',
        YEARENDINGREPORT: 'YearEndingReport',
        AppsubscriptionPage: 'AppsubscriptionPage',
        subscriptionContactInformation: 'subscriptionContactInformation',
        MonthlySubscriptionSuccess: 'MonthlySubscriptionSuccess',
        AnuallySubscriptionSucess: 'AnuallySubscriptionSucess',
        FailurePayment: 'FailurePayment',
        SaleAppWalkThrough: 'SaleAppWalkThrough',
        InventoryAppWalkThrough: 'InventoryAppWalkThrough',
        SALE_QUOTATION_REPORT: 'SaleQuotationReport',
        PURCHASE_QUOTATION_REPORT: 'PurchaseQuotationReport'
    };

    public static TransactionDateAnalyticsForDay = {
        SALE: 'SalesAdded',
        PURCHASE: 'PurchasesAdded',
        EXPENSE: 'ExpensesAdded',
        PARTIES: 'PartiesAdded',
        ITEMS: 'ItemsAdded',
        CATEGORY: 'CategoriesAdded',
        TIMESPENT: 'TimeSpent',
        DAILYACCOUNT: 'DailyAccountsReport',
        GSTR1: 'GSTR1Report',
        GSTR2: 'GSTR2Report',
        GSTR3B: 'GSTR3BReport',
        GSTR9: 'GSTR9Report',
        INVENTORY: 'InventoryStockReport',
        LOWSTOCK: 'LowStockSummaryReport',
        PARTYSTATEMENT: 'PartyStatementReport',
        PRODUCTLEVELINVENTORY: 'ProductLevelInventoryReport',
        PROFITANDLOSS: 'ProfitAndLostReport',
        PURCHASEDRAFTREPORT: 'PurchaseDraftReport',
        PURCHASEREPORT: 'PurchaseReport',
        SALEREPORT: 'SaleReport',
        SALEDRAFTREPORT: 'SalesDraftReport',
        YEARENDINGREPORT: 'YearEndingReport',
        SALE_QUOTATION_REPORT: 'SaleQuotationReport',
        PURCHASE_QUOTATION_REPORT: 'PurchaseQuotationReport'

    };
    public static UpdateQueries = [ // add all the queries where version is different
        {
            TableName: 'Business',
            ColumnName: 'CampaignID',
            ColumnValue: '1',
            ConditionalColumn: '',
            ConditionalValue: '',
            Condition: '',
            AppVersion: '28'
        }
    ];

    public static InsertMesaurementQueries = [
        {
            MeasurementName: 'KILOGRAMS',
            MeasurementCode: 'KGS',
            GroupID: '1',
            Ratio: '1',
            RatioID: ''
        },
        {
            MeasurementName: 'GRAMS',
            MeasurementCode: 'GMS',
            GroupID: '1',
            Ratio: '1000',
            RatioID: '1'
        },
        {
            MeasurementName: 'KILOLITRE',
            MeasurementCode: 'KLR',
            GroupID: '2',
            Ratio: '1',
            RatioID: ''
        },
        {
            MeasurementName: 'MILLILITRE',
            MeasurementCode: 'MLT',
            GroupID: '2',
            Ratio: '1000',
            RatioID: '3'
        },
        {
            MeasurementName: 'PIECES',
            MeasurementCode: 'PCS',
            GroupID: '3',
            Ratio: '1',
            RatioID: ''
        },
        {
            MeasurementName: 'METERS',
            MeasurementCode: 'MTR',
            GroupID: '4',
            Ratio: '1',
            RatioID: ''
        },
        {
            MeasurementName: 'CENTIMETER',
            MeasurementCode: 'CMS',
            GroupID: '4',
            Ratio: '100',
            RatioID: '6'
        },
        {
            MeasurementName: 'LITRE',
            MeasurementCode: 'PCS',
            GroupID: '2',
            Ratio: '1000',
            RatioID: '3'
        },
        {
            MeasurementName: 'DAYS',
            MeasurementCode: 'DAYS',
            GroupID: '5',
            Ratio: '1',
            RatioID: ''
        },
        {
            MeasurementName: 'HOURS',
            MeasurementCode: 'HOURS',
            GroupID: '5',
            Ratio: '24',
            RatioID: '9'
        }
    ];
    public static DatabasesTable = [{
        id: '1',
        dbName: 'DigiBillRetail.db',
        location: 'default',
        financialYear: '2019-2020',
        isActive: '1',
        isArchived: '0',
        CreatedDate: 'DATETIME(\'now\', \'localtime\')',
        BusinessID: '1'
    }];


    public static InvoiceConfigTable = [
        {
            InvoiceConfigFieldName: 'InvoicePrefix',
            InvoiceConfigFieldValue: 'INV',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'InvoiceNumberLength',
            InvoiceConfigFieldValue: '4',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'InvoicePrefix',
            InvoiceConfigFieldValue: 'INV',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'InvoiceNumberLength',
            InvoiceConfigFieldValue: '4',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'InvoiceStartNumber',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'InvoiceStartNumber',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowInvoicePrefix',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowInvoicePrefix',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'SelectOldInvoicePrefix',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'SelectOldInvoicePrefix',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowGST',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowGST',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowPAN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowPAN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowTAN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowTAN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowCIN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowCIN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowHSN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowHSN',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowCategory',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowCategory',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowInvNote',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowInvNote',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowInvImage',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowInvImage',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'ShowTransactionSMS',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowTransactionSMS',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'Printout',
            InvoiceConfigFieldValue: 'A4PrintOut',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'Printout',
            InvoiceConfigFieldValue: 'ThermalPrintOut',
            InvoiceTemplateID: '2'
        }, {
            InvoiceConfigFieldName: 'Printout',
            InvoiceConfigFieldValue: 'A4PrintOutSecondFormat',
            InvoiceTemplateID: '3'
        }, {
            InvoiceConfigFieldName: 'PrintoutSelected',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'ShowItemCategories',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'ShowOtherTaxRates',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'isDigiBillSessionValid',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'isUserOnBoarded',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'ItemDiscount',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'syncServerDate',
            InvoiceConfigFieldValue: 'DATETIME(\'now\', \'localtime\')',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalBillCPL',
            InvoiceConfigFieldValue: '48',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalBillCustomMessage',
            InvoiceConfigFieldValue: 'Generated by DigiBillApp@DigiPlusIT.com',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalBillTitle',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalBillTaxInvoice',
            InvoiceConfigFieldValue: 'GST INVOICE',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalBillTo',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ThermalPrinterInfo',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'A4BillTaxInvoice',
            InvoiceConfigFieldValue: 'TAX INVOICE',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'A4BillCustomMessage',
            InvoiceConfigFieldValue: 'Generated by DigiBillApp@DigiPlusIT.com',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'A4BillTitle',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'A4BillBusinessName',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'PushNotificationTokenID',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'AdPlayerAppActivated',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'ReadMode',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'EnableTax',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'EnablePartyOutstanding',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'AdditionalCharges',
            InvoiceConfigFieldValue: 'Additional Charges',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'GoogleUserEmail',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'AutoBackupSchedule',
            InvoiceConfigFieldValue: 'weekly',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'AutoBackupFileId',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'PreviousBackupDate',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'PreviousBackupFileSize',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'NextBackupDate',
            InvoiceConfigFieldValue: 'DATETIME(\'now\',\'+7 days\')',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'EnableReverseCharge',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        },
        {
            InvoiceConfigFieldName: 'Eway',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowQuantity',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ShowMeasurement',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'AppAnalyticsSync',
            InvoiceConfigFieldValue: 'DATETIME(\'now\', \'localtime\')',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'isSubscriptionActive',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'MonthlyPayment',
            InvoiceConfigFieldValue: '299',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'YearlyPayment',
            InvoiceConfigFieldValue: '2450',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'LifeTime',
            InvoiceConfigFieldValue: '12500',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'isSaleWalkThroughCompleted',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'HideA4Footer',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'HideThermalFooter',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'isInventoryWalkThroughCompleted',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'Currency',
            InvoiceConfigFieldValue: 'Rupees',
            InvoiceTemplateID: '1'
        }
        , {
            InvoiceConfigFieldName: 'Applanguage',
            InvoiceConfigFieldValue: 'en',
            InvoiceTemplateID: ''
        },
        {
            InvoiceConfigFieldName: 'InvoicePaymentReminder',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        },
        {
            InvoiceConfigFieldName: 'ShowDescription',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: '1'
        },
        {
            InvoiceConfigFieldName: 'SalePurchaseQuotation',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        },
        {
            InvoiceConfigFieldName: 'A4BillDescripton',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '1'
        },
        {
            InvoiceConfigFieldName: 'ThermalBillDescripton',
            InvoiceConfigFieldValue: '',
            InvoiceTemplateID: '2'
        },
        {
            InvoiceConfigFieldName: 'ActiveDatabaseId',
            InvoiceConfigFieldValue: '1',
            InvoiceTemplateID: '1'
        }, {
            InvoiceConfigFieldName: 'ReadOnlyDatabase',
            InvoiceConfigFieldValue: '0',
            InvoiceTemplateID: ''
        }, {
            InvoiceConfigFieldName: 'FinancialYearEndDate',
            InvoiceConfigFieldValue: '2019-03-31 00:00:00',
            InvoiceTemplateID: ''
        }
    ];

    public static CharactersPerLine = { // No. of chars in each row for the Thermal Print of Sale Bill
        twoInch: 42,
        threeInch: 48
    };
    public static ProductInventoryReason = [
        { code: '01', name: 'Initial Stock' },
        { code: '02', name: 'Loss Of Product' },
        { code: '03', name: 'Purchase' },
        { code: '04', name: 'Purchase Return' },
        { code: '05', name: 'Sale' },
        { code: '06', name: 'Sale Return' },
        { code: '07', name: 'Expired' },
        { code: '08', name: 'Damaged' }
    ];

    public static SaleReturnConfig = {
        InvoicePrefix: 'CN',
        InvoiceNumberLength: 4,
        InvoiceStartNumber: 1,
        ShowInvoicePrefix: 0,
        SelectOldInvoicePrefix: 1,
    };

    public static PurchaseReturnConfig = {
        InvoicePrefix: 'DN',
        InvoiceNumberLength: 4,
        InvoiceStartNumber: 1,
        ShowInvoicePrefix: 0,
        SelectOldInvoicePrefix: 1,
    };


    public static PettyCashParty = {
        name: 'Cash Sale',
        mobile: '-1'
    };
    public static BillType = {
        SALE: 'Sale',
        PURCHASE: 'Purchase',
        SALE_RETURN: 'Sale Return',
        PURCHASE_RETURN: 'Purchase Return',
        DRAFT: 'Draft'
    };
    // tslint:disable-next-line:variable-name
    public static Payment_Type = {
        PaymentIn: 'IN',
        PaymentOut: 'OUT'
    };

    public static MAX_OUTSTANDING_BALANCE = 30000;
    public static PARTY_CREDIT_LIMIT = 30000;

    public static PaymentModes = {
        CREDIT_NOTE: 'Credit Note',
        DEBIT_NOTE: 'Debit Note',
        CASH: 'Cash',
        VOUCHER: 'Voucher',
        CARD: 'Card',
        CHEQUE: 'Cheque',
        NEFT: 'NEFT',
        RGTS: 'RTGS',
        UPI: 'UPI',
        E_WALLET: 'E-wallet',
        NEFT_RGTS: 'NEFT/RGTS',
        BANK_TRANSFER: 'Bank Transfer',
        NONE: 'None'
    };

    public static PaymentType = {
        PAYMENT_IN: 'Payment In',
        PAYMENT_OUT: 'Payment Out'
    };

    public static MONTH_LABEL_TYPES = {
        SALE: 'Sale',
        PURCHASE: 'Purchase',
        PAYMENT: 'Payment',
        EXPENSE: 'Expense'
    };

    public static INVOICE_FORM_PAGES = {
        BILL_SUMMARY: 'Bill Summary',
        PURCHASE: 'Purchase',
        SALE_EDIT: 'Sale Edit',
        SALE_RETURN: 'Sale Return',
        PURCHASE_RETURN: 'Purchase Return',
        EXPENSE: 'Expense'
    };

    public static SUBSCRIPTION_TYPE = {
        MONTHLY: 'Monthly',
        YEARLY: 'showYearlyPayment',
        LIFETIME: 'showLifeTimePayment'
    };

    public static SUBSCRIPTION_PACKS = {
        MONTHLY: '299',
        MONTHLY_PLAN_NAME: 'MonthlyPayment',
        YEARLY: '2450',
        YEARLY_PLAN_NAME: 'YearlyPayment',
        LIFETIME: '12500',
        LIFETIME_PLAN_NAME: 'LifeTime'
    };

    public static SUBSCRIPTION_PACKS_NAME = {
        MONTHLY_PLAN_NAME: 'Monthly Payment',
        YEARLY_PLAN_NAME: 'Yearly Payment',
        LIFETIME_PLAN_NAME: 'Life Time'
    };

    public static PAYMENT_INFO = {
        KEY_ID_DEMO: 'rzp_test_PZgcLPcEfxXUkX',
        KEY_ID_PROD: 'rzp_live_gx8keakpSbFJfM',
        KEY_SECRET_DEMO: 'rzp_test_PZgcLPcEfxXUkX',
        KEY_ID_PRODUCTION: '',
        KEY_SECRET_PRODUCTION: '',
        ORDER_ID: 'OrderID: ',
        THEME_COLOUR: '#183185',
        LOGO: 'https://digibillapp.com/wp-content/uploads/2018/12/drawable-xxhdpi-icon.png',
        CURRENCY: 'INR'
    };
    public static INVOICE_CONFIG_COLUMNS = {
        SUBSCRIPTION_ACTIVE: 'isSubscriptionActive',
        READ_MODE: 'ReadMode'
    };

    public static CRM_CUSTOMER_DETAILS = {
        NAME: 'NAME',
        SECOND_NAME: 'SECOND_NAME',
        LAST_NAME: 'LAST_NAME',
        OPENED: 'OPENED',
        ASSIGNED_BY_ID: 'ASSIGNED_BY_ID',
        TYPE_ID: 'TYPE_ID',
        SOURCE_ID: 'SOURCE_ID',
        PHONE: 'PHONE',
        GSTIN: 'UF_CRM_1544703883',
        EMAIL: 'EMAIL',
        ADDRESS: 'UF_CRM_1544703832',
        CUSTOMER_NAME: 'UF_CRM_1544703787',
        STATE: 'UF_CRM_1544703841',
        POSTAL_CODE: 'UF_CRM_1544703874',
        STATE_CODE: 'UF_CRM_1544703859',
        PAN: 'UF_CRM_1544703904',
        BUSINESS_TYPE: 'UF_CRM_5C1330BD57F16',
        PRODUCT_TYPE: 'UF_CRM_5C1330BD5EBB4',
        CITY: 'UF_CRM_5C1330BD6A43E',
        APP_VERSION: 'UF_CRM_5C1330BD74EC5'
    };

    public static CRM_INVOICE_DETAILS = {
        NAME: 'NAME',
        SECOND_NAME: 'SECOND_NAME',
        LAST_NAME: 'LAST_NAME',
        OPENED: 'OPENED',
        ASSIGNED_BY_ID: 'ASSIGNED_BY_ID',
        TYPE_ID: 'TYPE_ID',
        SOURCE_ID: 'SOURCE_ID',
        PHONE: 'PHONE',
        GSTIN: 'UF_CRM_1544703883',
        EMAIL: 'EMAIL',
        ADDRESS: 'UF_CRM_1544703832',
        CUSTOMER_NAME: 'UF_CRM_1544703787',
        STATE: 'UF_CRM_1544703841',
        POSTAL_CODE: 'UF_CRM_1544703874',
        STATE_CODE: 'UF_CRM_1544703859',
        PAN: 'UF_CRM_1544703904',
        BUSINESS_TYPE: 'UF_CRM_5C1330BD57F16',
        PRODUCT_TYPE: 'UF_CRM_5C1330BD5EBB4',
        CITY: 'UF_CRM_5C1330BD6A43E',
        APP_VERSION: 'UF_CRM_5C1330BD74EC5'
    };

    // tslint:disable-next-line:max-line-length
    public static DIGIPLUSIT_LOGO = 'data:image/png;base64,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';
    public static PartyListTabs = ['Overview', 'Payments', 'Sale', 'Purchase'];
    // tslint:disable-next-line:max-line-length
    public static PartyListOverviewHeaders = ['This Month', 'Last Month', 'This Quarter', 'Previous Quarter', 'This Year', 'Last Year', 'Overall'];
    public static Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    public static MAX_RETRIES_FOR_FILE_DOWNLOAD_S3 = 3;
    // tslint:disable-next-line:max-line-length
    public static MAX_SALES_LIMIT = 50; // Total Sales Invoices that can be made in trial version of App (Excluding Sale Draft and Sale Return invoices)
    // tslint:disable-next-line:max-line-length
    public static MAX_PURCHASE_LIMIT = 50; // Total Purchase Invoices that can be made in trial version of App (Excluding Purchase Draft and Purchase Return invoices)
    public static MAX_EXPENSE_LIMIT = 50; // Total Expenses that can be made in trial version of App
    public static MAX_PARTY_LIMIT = 50; // Total Parties that can be added in trial version of App (Excluding Temporary Parties)
    public static MAX_ITEMS_LIMIT = 50; // Total Items that can be added to Inventory in trial version of App
    public static TABLE_NAME = {
        SALE: 'SalesInvoices',
        PURCHASE: 'PurchaseInvoices',
        EXPENSE: 'ExpenseList',
        PARTY: 'Party',
        ITEM: 'Item'
    };
    public static FLOW_NAME = {
        SALE: 'Sales',
        PURCHASE: 'Purchases',
        EXPENSE: 'Expenses',
        PARTY: 'Parties',
        ITEM: 'Items',
        EXPIRED: 'Expired',
        REACTIVATE: 'Reactivate'
    };

    public static TaxSlabsTableData = [
        { TaxSlabID: 1, TaxSlabValue: 0.0, TaxSlabName: 'GST@0%' },
        { TaxSlabID: 2, TaxSlabValue: 0.0, TaxSlabName: 'IGST@0%' },
        { TaxSlabID: 3, TaxSlabValue: 0.03, TaxSlabName: 'IGST@3%' },
        { TaxSlabID: 4, TaxSlabValue: 0.05, TaxSlabName: 'GST@5%' },
        { TaxSlabID: 5, TaxSlabValue: 0.05, TaxSlabName: 'IGST@5%' },
        { TaxSlabID: 6, TaxSlabValue: 0.12, TaxSlabName: 'GST@12%' },
        { TaxSlabID: 7, TaxSlabValue: 0.12, TaxSlabName: 'IGST@12%' },
        { TaxSlabID: 8, TaxSlabValue: 0.18, TaxSlabName: 'GST@18%' },
        { TaxSlabID: 9, TaxSlabValue: 0.18, TaxSlabName: 'IGST@18%' },
        { TaxSlabID: 10, TaxSlabValue: 0.28, TaxSlabName: 'GST@28%' },
        { TaxSlabID: 11, TaxSlabValue: 0.28, TaxSlabName: 'IGST@28%' },
        { TaxSlabID: 12, TaxSlabValue: 0.0025, TaxSlabName: 'GST@0.25%' },
        { TaxSlabID: 13, TaxSlabValue: 0.03, TaxSlabName: 'GST@3%' },
        { TaxSlabID: 14, TaxSlabValue: 0.0025, TaxSlabName: 'IGST@0.25%' },
        { TaxSlabID: 15, TaxSlabValue: 0.0, TaxSlabName: 'Exempted' }
    ];

    public static ExpenseCategoryTableData = [
        { ExpenseCategoryName: 'Marketing', ExpenseCategoryColor: 'rgba(0, 116, 217, 0.5)' },
        { ExpenseCategoryName: 'Stationary', ExpenseCategoryColor: 'rgba(127, 219, 255, 0.5)' },
        { ExpenseCategoryName: 'Bank Charges', ExpenseCategoryColor: 'rgba(57, 204, 204, 0.5)' },
        { ExpenseCategoryName: 'Business License', ExpenseCategoryColor: 'rgba(61, 153, 112, 0.5)' },
        { ExpenseCategoryName: 'Donation', ExpenseCategoryColor: 'rgba(46, 204, 64, 0.5)' },
        { ExpenseCategoryName: 'Computer and Internet Expenses', ExpenseCategoryColor: 'rgba(1, 255, 112, 0.5)' },
        { ExpenseCategoryName: 'Education and Training', ExpenseCategoryColor: 'rgba(255, 220, 0, 0.5)' },
        { ExpenseCategoryName: 'Dues and Subscription', ExpenseCategoryColor: 'rgba(255, 133, 27, 0.5)' },
        { ExpenseCategoryName: 'Housekeeping', ExpenseCategoryColor: 'rgba(255, 65, 54, 0.5)' },
        { ExpenseCategoryName: 'Travel', ExpenseCategoryColor: 'rgba(133, 20, 75, 0.5)' },
        { ExpenseCategoryName: 'Food', ExpenseCategoryColor: 'rgba(240, 18, 190, 0.5)' },
        { ExpenseCategoryName: 'Rent', ExpenseCategoryColor: 'rgba(177, 13, 201, 0.5)' },
        { ExpenseCategoryName: 'Repair and Maintenance', ExpenseCategoryColor: 'rgba(51, 0, 0, 0.5)' },
        { ExpenseCategoryName: 'Telephone Bills', ExpenseCategoryColor: 'rgba(139, 134, 130, 0.5)' },
        { ExpenseCategoryName: 'Electricity Bills', ExpenseCategoryColor: 'rgba(206, 204, 21, 0.5)' }
    ];
    public static PartyTableData = [
        { PartyName: 'Cash Sale', ContactNumber: '-1', OutstandingBalance: '0', RegistrationType: 'Unregistered', CreditPoints: '0' }
    ];
    public static ItemCategoryTableData = [{
        ItemCategoryID: '1',
        ItemCategory_Name: 'Other',
        ItemCategory_Desc: 'The items here do not have category',
        ItemCategory_ImagePath: 'assets/images/other.png'
    }];

    public static BusinessTableData = [{
        Name: 'Demo Account',
        Address: '',
        City: '',
        State: '',
        PinCode: '',
        GSTIN: '',
        PAN: '',
        CIN: '',
        ContactNumber: '',
        Email: '',
        Password: '',
        LogoImagePath: '',
        RegisterDate: '',
        ExpiryDate: '',
        GSTRegistrationType: 'Unregistered'
    }];

    public static DEMO_ACCOUNT = { ID: '2', NAME: 'Demo Account' };

    public static SubscribePageButtons = {
        PURCHASE_NOW: 'PurchaseNow',
        PURCHASE_LATER: 'PurchaseLater',
        HELP: 'Help',
        ALREADY_HAVE_LICENSE: 'AlreadyHaveLicense'
    };
    public static KEYS = {
        PRODUCTLIST_KEY: 15,
        SALE_KEY: 10,
        SALE_DRAFT_KEY: 10,
        PURCHASE_KEY: 10,
        PURCHASE_DRAFT_KEY: 10,
        SALE_QUOTATION_KEY: 10
    };

    public static ALL_FLOW_NAME = [
        { name: 'Sales' },
        { name: 'Purchases' },
        { name: 'Expenses' },
        { name: 'Parties' },
        { name: 'Items' },
        { name: 'Expired' }
    ];
    public static SALE_WALK_THROUGH_VIDEO_URL = 'https://www.youtube.com/watch?v=3cs8iPr-uig';
    public static DIGIBILL_YOUTUBE_ACCOUNT_URL = 'https://www.youtube.com/channel/UCR5lXwQt601PUqPUW6XWnzw';
    public static DEMO_ACCOUNT_APP_VERSION = 27; // App Version in which demo account was added, required during DB Restore
    public static DIGIBILL_SUPPORT_INFO = [
        { FIRST_NAME: 'DigiBill', LAST_NAME: 'Support', CONTACT_NUMBER: '8928375058' },
        { FIRST_NAME: 'DigiBill', LAST_NAME: 'Support 2', CONTACT_NUMBER: '9372123461' }
    ];

    public static MAX_BACKUP_FILES_IN_LOCAL_STORAGE = 7;
    public static MAX_INVOICE_FILES_IN_LOCAL_STORAGE = 1;
    public static DEMO_MOBILE_NUMBER = '1234512345';

    public static SALES_QUOTATION = {
        STATUS: {
            PREPARED: 'Prepared',
            SHARED: 'Shared',
            CLOSED: 'Closed',
            EXPIRED: 'Expired',
            NONE: ''
        }
    };
    public static AUTO_BACKUP_SCHEDULE = {
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        NEVER: 'never'
    };

    public static DB_ARCHIVAL_DATE = '2019-04-01';

    public static APP_LANGUAGE = [
        { Name: 'English', Value: 'en' },
        { Name: 'Hindi', Value: 'hn' }
    ];

    public static CURRENCY = [
        { Name: 'Euro', CODE: '€' },
        { Name: 'Dollar', CODE: '$' },
        { Name: 'Pound', CODE: '£' },
        { Name: 'Yen', CODE: '¥' },
        { Name: 'Peso', CODE: '₱' },
        { Name: 'Rupees', CODE: '₹' },
        { Name: 'Ruble', CODE: '₽' }
    ];
    public static PRINTER_COMMANDS = {
        FEED_CONTROL_SEQUENCES: {
            CTL_LF: '\x0a', // Print and line feed
            CTL_FF: '\x0c', // Form feed
            CTL_CR: '\x0d', // Carriage return
            CTL_HT: '\x09', // Horizontal tab
            CTL_VT: '\x0b', // Vertical tab
        },
        HARDWARE: {
            HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
            HW_SELECT: '\x1b\x3d\x01', // Printer select
            HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
        },
        MARGINS: {
            BOTTOM: '\x1b\x4f', // Fix bottom size
            LEFT: '\x1b\x6c', // Fix left size
            RIGHT: '\x1b\x51', // Fix right size
        },
        PAPER: {
            PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
            PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
            PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
            PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
        },
        TEXT_FORMAT: {
            TXT_NORMAL: '\x1b\x21\x00', // Normal text
            TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
            TXT_2WIDTH: '\x1b\x21\x20', // Double width text
            TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text
            TXT_HEIGHT: {
                1: '\x00',
                2: '\x01',
                3: '\x02',
                4: '\x03',
                5: '\x04',
                6: '\x05',
                7: '\x06',
                8: '\x07'
            },
            TXT_WIDTH: {
                1: '\x00',
                2: '\x10',
                3: '\x20',
                4: '\x30',
                5: '\x40',
                6: '\x50',
                7: '\x60',
                8: '\x70'
            },

            TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
            TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
            TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
            TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
            TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
            TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
            TXT_ITALIC_ON: '\x1b\x34', // Italic font ON
            TXT_FONT_A: '\x1b\x4d\x00', // Font type A
            TXT_FONT_B: '\x1b\x4d\x01', // Font type B
            TXT_FONT_C: '\x1b\x4d\x02', // Font type C
            TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
            TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
            TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
        }
    };

    public static APP_LANGUAGE_UPDATE = {
        HEADER: 'App Language',
        DESCRIPTION: 'Choose your default app language.',
        BUTTON1: 'English',
        BUTTON2: 'हिंदी',
        ENGLISH: 'en',
        HINDI: 'hn',
        APP_LANGUAGE: 'Applanguage'
    };

    public static ARCHIVE_DATABASE = {
        NOW: 'Archive Database Now',
        LATER: 'Archive Database Later'
    };

    public static DEFAULT_DATABASE = {
        ID: '1',
        NAME: 'DigiBillRetail.db',
        LOCATION: 'default'
    };
    public static TransactionTypeId = [
        { Opening_balance_id: 101, Opening_balance_text: 'Opening Balance' },
        { To_bank_cash_id: 102, To_bank_cash_text: 'To Bank' },
        { From_bank_cash_id: 103, From_bank_cash_text: 'From Bank' },
        { To_bank_cheque_id: 104, To_bank_cheque_text: 'To Cheque' },
        { From_bank_cheque_id: 105, From_bank_cheque_text: 'From Cheque' },
        { Deposit_cash_id: 106, Deposit_cash_text: 'Deposited Cash' },
        { Withdraw_cash_id: 107, Withdraw_cash_text: 'Withdrawn Cash' },
        { Increase_cash_id: 108, Increase_cash_text: 'Increased Cash' },
        { Decrease_cash: 109, Decrease_cash_text: 'Decreased Cash' }
    ];
}
