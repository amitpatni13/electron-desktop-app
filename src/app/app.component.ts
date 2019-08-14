import { Component } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
// import { Reports } from '../pages/Reports/reports';
// import { OrgProfilePage } from '../pages/Settings/OrgProfile/OrgProfile';
import { Authentication } from '../BizLogic/Authentication';
import { ElectronService } from 'ngx-electron';
// import { ProductItemPage } from '../pages/ProductItem/ProductItem';
// import { CustomerPage } from '../pages/customer/customer';
// import { ExpenseList } from '../pages/Expenselist/expenselist';
import { RouterOutlet, Router } from '@angular/router';
import { DatabaseProvider } from 'src/providers/database/database';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesReportService } from '../Services/salesReport.service';
import { ConstantMessages } from 'src/Constants/constant';
import { MenuItem } from 'primeng/api';
import { SalesMainComponent } from 'src/pages/Sales/sales';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = false;
  mobileNumber: any = '9717288358';
  businessName: any = 'Amit';
  session: boolean;
  user: any;
  pass: any;
  businessLogo = 'assets/icon/userLogo.png';
  rootPage: any;
  pages: Array<{ title: string, icon: string, component: any }>;
  pagesRight: Array<{ title: string, icon: string, component: any }>;
  list: any[] = [];
  list1: any[] = [];
  title = 'digibill-desktop';
  model: NgbDateStruct;
  today = this.calendar.getToday();
  date = new Date();
  currentMonthYear = new Date(this.date.getFullYear(), this.date.getMonth(), 2, 1);
  fromDate: any = this.currentMonthYear.toISOString().split('T')[0];
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1, 0);
  toDate: any = this.lastDay.toISOString().split('T')[0];
  menuBar: MenuItem[] = [{
    label: '',
    icon: 'pi pi-bars sidebar-icon',
    command: () => { this._toggleSidebar(); }
    // styleClass: 'fixed-dashboard-header'
  }];

  constructor(private authentication: Authentication, private electronService: ElectronService, private router: Router,
              private dbProvider: DatabaseProvider, private calendar: NgbCalendar, private saleReportService: SalesReportService) {
    if (this.electronService.isElectronApp) {
      console.log('Mode Electron');
      console.log(this.electronService.ipcRenderer); // Check if electron is correctly injected
      console.log(this.electronService.process); // Check if NodeJs process is correctly injected
    } else {
      console.log('Mode Browser');
    }

    this.initializeApp();

    this.pages = [
      { title: 'Home', icon: 'home', component: '/home' },
      { title: 'Reports', icon: 'assessment', component: '/reports' },
      { title: 'Activity Log', icon: 'dashboard', component: '/dashboard' },
      { title: 'Bank Accounts', icon: 'assessment', component: '/bank-accounts' },
      { title: 'Settings', icon: 'settings', component: '/settings' },
      { title: 'Help', icon: 'help_outline', component: '/help' },
      { title: 'Logout', icon: 'info', component: '/logout' }
    ];
    this.pagesRight = [
      { title: 'Sale', icon: 'shopping_basket', component: '/sales' },
      { title: 'Purchase', icon: 'shopping_cart', component: '/home' },
      { title: 'Party', icon: 'perm_identity', component: '/party' },
      { title: 'Inventory', icon: 'store', component: '/inventory' },
      { title: 'Expenses', icon: 'credit_card', component: '/expenses' },
      { title: 'Reports', icon: 'receipt', component: '/reports' }
    ];
  }

  initializeApp() {
    // tslint:disable-next-line:no-debugger
    debugger;
    document.addEventListener('deviceready', () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.storage.get('introShown').then((result) => {
      //   if (result) {
      //     this.authentication.validateAuthSession().then(returnPage => {
      //       if (returnPage) {
      //         this.rootPage = returnPage.pageContext;
      //       }
      //     });
      //   } else {
      this.insertData(ConstantMessages.DEFAULT_DATABASE.NAME);
      // this.rootPage = IntroPage;
      // comment this line if intro should not be hidden after displaying once
      //     this.storage.set('introShown', true);
      //   }
      // });
    });

    // Run this code if registered user business profile is stored.
    // if (this.businessName !== null && this.mobileNumber !== null) {
    //   this.storage.get('BusinessName').then((val) => {
    //     if (val) {
    //       this.businessName = val
    //     }
    //   });

    //   this.storage.get('MobileNumber').then((val1) => {
    //     if (val1) {
    //       this.mobileNumber = val1;
    //     }
    //   });
    // }

    // this.storage.get('businessProfileImg').then((result) => {
    //   if (result) {
    //     this.business_logo = result
    //   }
    // });
  }

  logout(): void {
    // this.nav.setRoot(this.authentication.invalidateSession());
  }

  NavigateToBusinessPage() {
    // this.nav.push(OrgProfilePage);
  }

  openPage(page: { title: string, icon: string, component: any }) {
    if (page.component === HomePage) {
      return;
    } else {
      this.router.navigate([page.component]);
    }
  }

  _toggleSidebar() {
    this.opened = !this.opened;
  }

  _closeSidebar() {
    this.opened = false;
  }

  async insertData(dbName: string) {
    this.dbProvider.fillDatabase(dbName).then((result) => {
      console.log('Response from query', result);
    }).catch((error) => { console.log('Error connecting to DB: ', error); });
  }

  async TotalAmountReceived() {
    this.list1 = [];
    this.saleReportService.getSalesReportData(this.fromDate, this.toDate, (res) => {
      this.list1 = res;
      console.log('this list1 is' + this.list1);
    });
  }

}
