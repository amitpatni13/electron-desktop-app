import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from '../pages/home/home';
import { Dashboard } from '../pages/Dashboard/dashboard';
import { IntroPage } from '../pages/intro/intro';
import { RegisterUser } from '../pages/Register/register';
import { SignInUser } from '../pages/SignIn/signin';
import { SalesMainComponent } from 'src/pages/Sales/sales';
import { BillComponent } from 'src/pages/bill/bill';

const  routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'dashboard', component: Dashboard },
  { path: 'intro', component: IntroPage },
  { path: 'RegisterUser', component: RegisterUser },
  { path: 'SignInUser', component: SignInUser },
  { path: 'sales', component: SalesMainComponent },
  { path: 'bill', component: BillComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomePage } // Page not Found
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
export const routingComponents = [HomePage, Dashboard, IntroPage, RegisterUser, SignInUser, SalesMainComponent ];
