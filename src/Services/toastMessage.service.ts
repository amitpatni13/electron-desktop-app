import { Injectable } from '@angular/core';
// import { ToastController } from 'ionic-angular';

@Injectable()
export class ToasterService {

    constructor() { }

    // On a success event, the toast message is displayed
    success(msg: string) {
        // const toast = this.toastr.create({

        //     message: msg,
        //     duration: 700,
        //     position: 'bottom',
        //     cssClass: 'toastSuccess',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Success Toast Message Shown');
        // });
        // toast.present();
    }

    // On data change event, the toast message is displayed
    info(msg: string) {
        // const toast = this.toastr.create({
        //     message: msg,
        //     duration: 700,
        //     position: 'bottom',
        //     cssClass: 'toastInfo',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Info Toast Message Shown');
        // });
        // toast.present();
    }

    // On a warning event, the toast message is displayed
    warning(msg: string) {
        // const toast = this.toastr.create({
        //     message: msg,
        //     duration: 700,
        //     position: 'bottom',
        //     cssClass: 'toastWarning',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Warning Toast Message Shown');
        // });
        // toast.present();
    }

    // On an error event, the toast message is displayed
    error(msg: string) {
        // const toast = this.toastr.create({
        //     message: msg,
        //     duration: 700,
        //     position: 'bottom',
        //     cssClass: 'toastError',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Error Toast Message Shown');
        // });
        // toast.present();
    }

    // On an warning event, the toast message is displayed at bottom with a dismiss button
    warningBottom(msg: string) {
        // const toast = this.toastr.create({
        //     message: msg,
        //     duration: 5000,
        //     position: 'bottom',
        //     cssClass: 'toastWarningBottom',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Bottom Warning Toast Message Button Clicked');
        // });
        // toast.present();
    }

    // On an info event, the toast message is displayed at bottom with a dismiss button
    infoBottom(msg: string) {
        // const toast = this.toastr.create({
        //     message: msg,
        //     duration: 5000,
        //     position: 'bottom',
        //     cssClass: 'toastInfoBottom',
        // });
        // toast.onDidDismiss(() => {
        //     console.log('Bottom Info Toast Message Button Clicked');
        // });
        // toast.present();
    }
}
