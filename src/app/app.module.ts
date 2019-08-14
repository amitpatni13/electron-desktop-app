import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SignInUser } from '../pages/SignIn/signin';
import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterUser } from '../pages/Register/register';
import { Dashboard } from '../pages/Dashboard/dashboard';
import { IntroPage } from '../pages/intro/intro';
import { Authentication } from '../BizLogic/Authentication';
import { DatabaseProvider } from '../providers/database/database';
import { DBManager } from '../DBManager/dbmanager';
import { WindowRef } from '../Utilities/WindowRef';
import { NgxElectronModule, ElectronService } from 'ngx-electron';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesReportService } from '../Services/salesReport.service';
import { HttpOtpService } from 'src/Services/httpOtp.service';
import { ProductItemsData } from 'src/Services/productItemsData.service';
import { ProductCategory } from 'src/Services/product_category.service';
import { ValidationHelper } from 'src/Utilities/Validator';
import { AllItems } from 'src/BizLogic/itemData';
import { ToasterService } from 'src/Services/toastMessage.service';
import { CustomerData } from 'src/Services/customerData.service';
import { BusinessProfileData } from 'src/Services/business_profile.service';
import { TaxSlabs } from 'src/Services/taxSlabs.service';
import { PartyData } from 'src/Services/party.service';
import { ControlMessagesComponent } from 'src/Utilities/control-messages.component';
import { SalesInvoiceItems } from 'src/Services/salesInvoiceItems.service';
import { SocialSharingService } from 'src/Services/SocialSharing.service';
import { PartyTxnDetail } from 'src/Services/partytxndetail.service';
import { dbTester } from 'src/Services/dbTester.service';
import { ExcelService } from 'src/Services/excel.service';
import { ExpenseListData } from 'src/Services/expenselistdata.service';
import { BillSetting } from 'src/Services/billSetting.service';
import { ErrorLogService } from 'src/Services/errorLog.service';
import { DashboardService } from 'src/Services/dashboard.service';
import { EmailSending } from 'src/Services/emailSending.service';
import { AppSettings } from 'src/Services/appSetting.service';
import { BusinessUserServerCheck } from 'src/Services/businessUserServerCheck.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatGridListModule, MatCardModule,
         MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FinalBillDBService } from 'src/Services/finalBill.service';
import { TransactionDataService } from 'src/Services/transactionDataService';
import { MeasurementUnitService } from 'src/Services/measurementUnit.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IndianCurrencyFormat } from 'src/Utilities/IndianCurrency.pipe';
import { ProfitLossService } from 'src/Services/profit&loss.service';
import { SalesMainComponent } from 'src/pages/Sales/sales';
import { InvoiceWidgetComponent } from 'src/pages/invoiceWidget/invoiceWidget';
import { InvoiceTableComponent } from 'src/pages/invoiceTable/invoiceTable';
import { BillComponent } from 'src/pages/bill/bill';
import { BillFormatOneComponent } from 'src/pages/bill/billFormatOne/billFormatOne';
import { BillFormatTwoComponent } from 'src/pages/bill/billFormatTwo/billFormatTwo';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaxRatesModalComponent } from 'src/pages/TaxRatesModal/taxRatesModal';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    RegisterUser,
    Dashboard,
    IndianCurrencyFormat,
    IntroPage,
    SignInUser,
    SalesMainComponent,
    InvoiceWidgetComponent,
    InvoiceTableComponent,
    BillComponent,
    BillFormatOneComponent,
    BillFormatTwoComponent,
    TaxRatesModalComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    NgxElectronModule,
    NgDatepickerModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    CalendarModule,
    DragDropModule,
    NgbPopoverModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HomePage,
    RegisterUser,
    Dashboard,
    SignInUser,
    IntroPage,
    SalesMainComponent,
    InvoiceWidgetComponent,
    InvoiceTableComponent,
    BillComponent,
    BillFormatOneComponent,
    BillFormatTwoComponent,
    TaxRatesModalComponent
  ],
  providers: [
    HttpOtpService,
    ProductItemsData,
    ProductCategory,
    ValidationHelper,
    AllItems,
    ToasterService,
    CustomerData,
    FinalBillDBService,
    Authentication,
    BusinessProfileData,
    TaxSlabs,
    PartyData,
    ControlMessagesComponent,
    DatabaseProvider,
    DBManager,
    SalesInvoiceItems,
    SocialSharingService,
    WindowRef,
    PartyTxnDetail,
    dbTester,
    ExcelService,
    ExpenseListData,
    BillSetting,
    ElectronService,
    SalesReportService,
    ErrorLogService,
    DashboardService,
    EmailSending,
    AppSettings,
    BusinessUserServerCheck,
    TransactionDataService,
    MeasurementUnitService,
    TranslateService,
    ProfitLossService
  ]
})
export class AppModule { }


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
