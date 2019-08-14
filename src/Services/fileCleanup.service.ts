import { Injectable } from '@angular/core';
import { ConstantMessages } from '../Constants/constant';

@Injectable()
export class FileCleanupService {
   constructor() { }

    // tslint:disable-next-line:max-line-length
    // To clean up User's Device Local Storage keeping only last 7 days backup files in DigiBill Folder and Only 1 PDF Invoice (latest) in DigiBill/Invoices Folder
    cleanFolder(folderPath: string, folderName: string) {
        // this.file.listDir(folderPath, folderName).then((allFiles) => { // Listing all the files and folders present in DigiBill Folder
        //     console.log(folderName + ' Folder Files List Success Response: ', allFiles);
        //     // Getting the files list from the all files data
        //     if ('DigiBill' === folderName) {
        //         this.getBackupFilesList(allFiles, (backupFiles) => { // Getting Backup files list if we are cleaning up DigiBill Folder
        //             const fileList: Array<{ name: string, path: string, date: Date, size: string }> = backupFiles;
        //             this.cleanFiles(fileList); // Performing the file cleanup script
        //         });
                 // tslint:disable-next-line:max-line-length
        //         const  folderList = this.getFolderList(allFiles); // Getting folders list for cleaning up DigiBill/Invoices and DigiBill/Report Folders
        //         this.cleanFolders(folderList); // Performing the folder cleanup script
        //     }
        // }).catch((error) => {
        //     console.log(folderName + ' Folder Files List Error Response: ', error);
        // });
    }

    /** To perform the clean files operation on the file list received */
    cleanFiles(fileList: Array<{ name: string, path: string, date: Date, size: string }>) {
        let MAX_LIMIT: number;
        if (fileList && fileList.length) { // If files are present the folder searched
            // Getting the Max Limit for the files in the folder
            // tslint:disable-next-line:max-line-length
            if (null === fileList[0].date) { MAX_LIMIT = ConstantMessages.MAX_INVOICE_FILES_IN_LOCAL_STORAGE; } else { MAX_LIMIT = ConstantMessages.MAX_BACKUP_FILES_IN_LOCAL_STORAGE; } // Max Limit of files for Backup files list
            // Performing the cleanup script if max limit is exceeded for the folder
            if (MAX_LIMIT < fileList.length) { // If local storage has more backup files than max allowed, performing the removal of files
                fileList = this.sortFileList(fileList); // Sorting the fileList in descending order of date
                const removeFiles: string[] = this.getFilesToRemove(fileList, MAX_LIMIT); // Getting all the files to be removed from list
                // tslint:disable-next-line:max-line-length
                if (removeFiles.length) { this.removeFiles(removeFiles, 0); } // Removing files, if we have backup files to be removed starting with 0 index
            }
        }
    }

    /** To get all the backup files present in DigiBill Folder */
    getBackupFilesList(allFiles: any[], callback) {
        // tslint:disable-next-line:one-variable-per-declaration
        const fileList: Array<{ name: string, path: string, date: Date, size: string }> = [], backupFiles: any[] = [];
        for (const file of allFiles) {
            if (file.isFile && 'dbBackup' === file.name.substring(file.name.lastIndexOf('.') + 1)) { // If file is a backup file
                backupFiles.push(file); // Getting all the backup files
            }
        }
        for (const file of backupFiles) { // Looping over all backup files
            const fileData = file.name.split('_');
            let fileModificationDate: Date;
            // tslint:disable-next-line:max-line-length
            if ('GoogleDrive' === fileData[0]) { fileModificationDate = new Date(fileData[2] + ' ' + fileData[3]); } else { fileModificationDate = new Date(fileData[1] + ' ' + fileData[2]); } // Getting the file date from file name
            this.getFileSize(file.nativeURL, (fileSize) => {
                fileList.push({ // Creating a list of all the backup files
                    name: file.name,
                    path: file.nativeURL,
                    date: fileModificationDate,
                    size: fileSize
                });
                if (backupFiles.length - 1 === backupFiles.indexOf(file)) { // last file in backup files list
                    callback(fileList);
                }
            });
        }
    }

    /** To get all the backup files present in DigiBill Folder */
    getFolderList(allFiles: any[]) {
        const folderList: any[] = [];
        for (const file of allFiles) {
            if (file.isDirectory) { // If file entry is a Folder
                folderList.push(file); // Adding the file entry to the folder list
            }
        }
        return folderList;
    }

    /** To sort the file list in descending order of date (Backup Files) or reverse the file list if date is not provided (Invoice Files) */
    sortFileList(fileList: Array<{ name: string, path: string, date: Date, size: string }>) {
        if (null === fileList[0].date) { // Sorting the file list in reverse order
            return fileList.reverse();
        } else { // Sorting the files list by date
            return fileList.sort((item1Date, item2Date) => {
                return item1Date > item2Date ? -1 : item1Date < item2Date ? 1 : 0;
            });
        }
    }

    /** Getting the file path of the files to be removed from the local storage */
    getFilesToRemove(fileList: Array<{ name: string, path: string, date: Date, size: string }>, MAX_LIMIT: number) {
        const removeFiles: string[] = [];
        for (const file of fileList) { // Removing all the files inserted in remove files list during this loop
            if (null !== file.date) { // Removing all the backup files with file size 0 KB first
                // tslint:disable-next-line:max-line-length
                if ('GoogleDrive' === file.name.split('_')[0] || (file.size && file.size.length && 0 === Number(file.size.split(' ')[0]))) { // if file size is O KB, or is a Google Drive Downloaded Backup
                    removeFiles.push(file.path); // Adding the file path of the files to be removed
                }
            }
        }
        if ((fileList.length - removeFiles.length) < MAX_LIMIT) { // If files to keep has not exceeded the max limit
            for (const file of fileList) {
                // tslint:disable-next-line:max-line-length
                if (-1 === removeFiles.indexOf(file.path) && (fileList.length - removeFiles.length) < MAX_LIMIT) { // If file to remove not in list and we have not yet exceeded the max limit
                    removeFiles.push(file.path); // Adding the file path of the files to be removed
                } else if ((fileList.length - removeFiles.length) >= MAX_LIMIT) { break; }
            }
        }
        return removeFiles;
    }

    /** Remove all the files provided from the local storage */
    removeFiles(fileList: string[], index: number) {
        this.deleteFile(fileList[index], () => { // Deleting the file present at index position in the file list array
            index += 1;
            if (index < fileList.length) { this.removeFiles(fileList, index); } // Iterating over the file list until all files are removed
        }); // Removing the file from local storage
    }

    /** To remove a file from the local storage by providing the file paths */
    deleteFile(filePath: string, callback) {
        ( window as any).resolveLocalFileSystemURL(filePath, (dirEntry) => {
            function successHandler() { // Callback when file entry is successfully removed
                console.log('File deleted successfully ', filePath.substring(filePath.lastIndexOf('/') + 1));
                callback(true);
            }
            function errorHandler() { // Callback when file entry is not removed
                console.log('There is some error while deleting file ', filePath.substring(filePath.lastIndexOf('/') + 1));
                callback(true);
            }
            dirEntry.remove(successHandler, errorHandler); // Deleting the file from the Local Storage of User's Device
        });
    }

    /** Getting the file size for the backup file generated */
    getFileSize(filePath: string, callback) {
        console.log('file url : ' + filePath);
        ( window as any).resolveLocalFileSystemURL(filePath, (fileEntry) => {
            fileEntry.getMetadata((metadata) => { // File Metadata from most recent Backup File
               // tslint:disable-next-line:one-variable-per-declaration
               const size = Number(metadata.size) / (1024 * 1024);
               let fileSize: string;
               // tslint:disable-next-line:max-line-length
               if (size >= 1) { fileSize = String(size.toFixed(2)) + ' MB'; } else { fileSize = String(Math.round(size * 1024)) + ' KB'; } // File size in Kilo Bytes (KB)
               callback(fileSize);
            });
        }, (error) => {
            console.error('Unable to read file: ', error);
            callback('');
        });
    }

    /** Emptying the folder's present in DigiBill Folder */
    cleanFolders(folderList: any[]) {
        for (const folder of folderList) {
            this.removeFolder(folder.name, (result) => {
                if (result) { this.addFolder(folder.name); }
            });
        }
    }

    /** To remove the folder from the external storage */
    removeFolder(folderName: string, callback) {
        // this.file.removeDir(this.file.externalRootDirectory + 'DigiBill', folderName).then((data) => {
        //     console.log('Deleted folder: ', data) ;
        //     callback(true);
        // }).catch((error) => {
        //     console.log('Error deleting folder: ', error);
        //     callback(false);
        // });
        callback(false);
    }

    /** To add the folder again after it is removed */
    addFolder(folderName: string) {
        // this.file.createDir(this.file.externalRootDirectory + 'DigiBill', folderName, true).then((result) => {
        //     console.log(folderName + 'folder created successfully!', result);
        // }).catch((err) => {
        //     console.log(folderName + 'folder Exists', err);
        // });
    }

}
