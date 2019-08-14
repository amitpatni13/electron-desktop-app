import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'DateMomentPipe' })
export class DateMomentPipe implements PipeTransform {
    transform(value) {
        const newValue = value.toString();
        value = new Date(newValue);
        return convertToNiceDate(value);
    }
}

// To convert Date Differences into minutes, hours, days, weeks or months
function convertToNiceDate(time: string) {
    const date = new Date(time);
    const timeDifference = (((new Date()).getTime() - date.getTime()) / 1000);
    const dayDifference = Math.floor(timeDifference / 86400);
    if (isNaN(dayDifference) || dayDifference < 0) {
        return '';
    }
    return dayDifference === 0 && (
        timeDifference < 60 && 'Just now' ||
        timeDifference < 120 && '1 minute ago' ||
        timeDifference < 3600 && Math.floor(timeDifference / 60) + ' minutes ago' ||
        timeDifference < 7200 && '1 hour ago' ||
        timeDifference < 86400 && Math.floor(timeDifference / 3600) + ' hours ago') ||
        dayDifference === 1 && 'Yesterday' ||
        dayDifference < 7 && dayDifference + ' days ago' ||
        dayDifference < 14 && '1 week ago' ||
        dayDifference < 31 && Math.ceil(dayDifference / 7) + ' weeks ago' ||
        dayDifference < 61 && '1 month ago' ||
        dayDifference < 361 && Math.ceil(dayDifference / 30) + ' months ago' ||
        dayDifference < 366 && '11 months ago' ||
        dayDifference < 721 && '1 year ago' ||
        dayDifference >= 721 && Math.ceil(dayDifference / 365) + ' years ago';
}
