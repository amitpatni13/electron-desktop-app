import { Injectable } from '@angular/core';

@Injectable()
export class ScreenShotService {
  filename: string;
  screenShotFilePath: any;
  constructor() { }

  async saveScreenShot() {
    //  const date = new Date();
    //  return await this.screenshot.save('jpg', 80, ConstantMessages.screenShot.FILE_NAME + date.getTime() ).then(async res => {
    //     console.log('screenshot response file path:', res.filePath);
    //     return await res.filePath;
    //   });
    return await null;
  }
  // To Create the Modal Page for help page
  openScreenshotModal(modalObject) {
    // modalObject.onDidDismiss((response) => { // An object is returned
    //   this.file.removeFile(ConstantMessages.screenShot.FILE_PATH, this.filename);
    //   console.log('Received screenshot data from Modal: ', response);
    //   this.filename = '';
    // });
    // modalObject.present();
  }
}
