import { Injectable } from '@angular/core';
@Injectable()
export class SideMenuAlignment {
    // For changing the button color of tabs
    SideMenuButtonAlignment(PageButtonName) {
        let PageLinks;
        // Get all elements with class="SideMainMenuButtons" and remove the class "ActivatePage"
        PageLinks = document.getElementsByClassName('SideMainMenuButtons');
        // tslint:disable-next-line:prefer-for-of
        for (let ButtonContent = 0; ButtonContent < PageLinks.length; ButtonContent++) {
            PageLinks[ButtonContent].className = PageLinks[ButtonContent].className.replace(' ActivatePage', '');
            // Show the current tab, and add an "ActivatePage" class to the button that opened the tab
            if (PageButtonName === PageLinks[ButtonContent].id) {
                PageLinks[ButtonContent].className += ' ActivatePage';
            }
        }
    }
}
