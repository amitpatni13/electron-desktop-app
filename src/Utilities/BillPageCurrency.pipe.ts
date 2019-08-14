import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'BillFormat' })
export class BillPageCurrencyFormat implements PipeTransform {
    transform(value: number, args: string): any {
        if (!isNaN(value) && undefined !== value && null !== value && '' !== String(value)) {
            value = Number(Number(value).toFixed(2));
            let output;
            if (args === '₹') {
            const result = value.toString().split('.');
            let lastThree = result[0].substring(result[0].length - 3);
            let otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers !== '' && otherNumbers !== '-') {
                lastThree = ',' + lastThree;
            }
            if (otherNumbers.startsWith('-')) {
                // tslint:disable-next-line:max-line-length
                if (Number(otherNumbers) === 0) { otherNumbers = otherNumbers.replace('-', ''); } else { otherNumbers = otherNumbers.replace('-', '(-)'); }
            }
            if (lastThree.startsWith('-')) {
                if (Number(lastThree) === 0) { lastThree = lastThree.replace('-', ''); } else { lastThree = lastThree.replace('-', '(-)'); }
            }
            output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
            if (result.length > 1) {
                if (result[1].length > 2) { output += '.' + result[1].substring(0, 2); } else { output += '.' + result[1]; }
            }
        } else {
            output = value;
        }
            return output;
        }

    }
}
