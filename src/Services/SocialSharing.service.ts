import { Injectable } from '@angular/core';
// import { SocialSharing } from '@ionic-native/social-sharing';
import { ErrorLogService } from './errorLog.service';
import { ConstMessages } from '../Constants/ErrorMessages';

@Injectable()
export class SocialSharingService {

    constructor( public logService: ErrorLogService) { }

    // To share the data directly on WhatsApp
    onWhatsApp(msg: string, image?: string, url?: string) {
        if (undefined === image) { image = null; }
        if (undefined === url) { url = null; }
        return null;
        // this.share.shareViaWhatsApp(msg, image, url)
        //     .then(() => console.log('Message sent on WhatsApp successfully!'))
        //     // tslint:disable-next-line:max-line-length
        //     .catch((err) =>  console.log('Error  ', err));

    }

    // To share the data directly on WhatsApp to a Contact Saved in Mobile of User
    onWhatsAppToUser(contactName: string, msg: string, image?: string, url?: string) {
        return null;
        // this.share.shareViaWhatsAppToReceiver(contactName, msg)
        //     .then(() => console.log('Message sent on WhatsApp successfully!'))
        //     .catch((err) => console.log('Error  ', err));
    }

    // To share the data directly on Facebook
    onFacebook(msg: string, image?: string, url?: string) {
        if (0 === image.length || undefined === image) { image = null; }
        if (0 === url.length || undefined === url) { url = null; }
        return null;
        // this.share.shareViaFacebook(msg, image, url)
        //     .then(() => console.log('Message sent on Facebook successfully!'))
        //     .catch((err) => console.log('Error  ', err));
    }
    // To share the data directly on Facebook with a Paste Message Hint
        onFacebookToUser(contactName: string, msg: string, image?: string, url?: string) {
        if (0 === image.length || undefined === image) { image = null; }
        if (0 === url.length || undefined === url) { url = null; }
        return null;
        // this.share.shareViaFacebookWithPasteMessageHint(contactName, msg, image, url)
        //     .then(() => console.log('Message sent on Facebook successfully!'))
        //     .catch((err) => console.log('Error  ', err));
    }

    // To share the data directly on Twitter
        onTwitter(msg: string, image?: string, url?: string) {
        if (0 === image.length || undefined === image) { image = null; }
        if (0 === url.length || undefined === url) { url = null; }
        return null;
        // this.share.shareViaTwitter(msg, image, url)
        //     .then(() => console.log('Message sent on Twitter successfully!'))
        //     .catch((err) => console.log('Error  ', err));
    }
    // To share the data via Email
    onEMail(msg: string, sub: string, to: string[], cc?: string[], bcc?: string[], file?: string | string[]) {
        if (0 === cc.length || undefined === cc) { cc = null; }
        if (0 === bcc.length || undefined === bcc) { bcc = null; }
        if (0 === file.length || undefined === file) { file = null; }
        return null;
        // this.share.canShareViaEmail().then(() => {
        //     this.share.shareViaEmail(msg, sub, to, cc, bcc, file)
        //         .then(() => console.log('Message sent on Twitter successfully!'))
        //         // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        //         .catch((err) => this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SOCIAL_SHARE_EMAIL, " ;SRC - Service Class:SocialSharingService method:onEMail",err));
        // // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        // }).catch((err) => this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SOCIAL_SHARE_EMAIL, " ;SRC - Service Class:SocialSharingService method:onEMail",err));
    }
    // To share the data directly on Installed Apps
    ShareItAll(msg: string, subject ?: string, file?: string| string[], url?: string) {
        if (0 === file.length || undefined === file) { file = null; }
        if (0 === url.length || undefined === url) { url = null; }
        return null;
        // this.share.share(msg,subject,file,url)
        //     .then(() => console.log("Message sent successfully!"))
        // tslint:disable-next-line:max-line-length
        //     .catch((err) => this.logService.ErrorMessage(ConstMessages.ErrorCode.ERROR_SOCIAL_SHARE_TWITTER, " ;SRC - Service Class:SocialSharingService method:ShareItAll", err));
    }
}
