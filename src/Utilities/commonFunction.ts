import { ConstantMessages } from '../Constants/constant';

export class CommonFunction {

    // Get the pan number from the GSTIN
    public static getPANNumber(GSTIN: string, panNumber: string) {
        if (GSTIN.length > 2) {
            if (String(panNumber).length <= 10) {
                panNumber = GSTIN.substring(2, 12);
            }
        }
        return panNumber;
    }

    // To convert data into DD-MM-YYYY format
    public static getDate(date: string) {
        const dateReceived = new Date(date);
        let day = String(dateReceived.getDate());
        let month = String(dateReceived.getMonth() + 1); // Since month starts with 0 in JavaScript, so +1 to get exact month value
        const year = String(dateReceived.getFullYear());
        if (1 === day.length) { day = '0' + day; }
        if (1 === month.length) { month = '0' + month; }
        return day + '-' + month + '-' + year;
    }

    // To convert data into DD/MM/YYYY hh:mm:ss format
    public static getDateTime(date: string) {
        const dateReceived = new Date(date);
        let day = String(dateReceived.getDate());
        let month = String(dateReceived.getMonth() + 1); // Since month starts with 0 in JavaScript, so +1 to get exact month value
        const year = String(dateReceived.getFullYear());
        let hour = String(dateReceived.getHours());
        let min = String(dateReceived.getMinutes());
        let  sec = String(dateReceived.getSeconds());
        if (1 === day.length) { day = '0' + day; }
        if (1 === month.length) { month = '0' + month; }
        if (1 === hour.length) { hour = '0' + hour; }
        if (1 === min.length) { min = '0' + min; }
        if (1 === sec.length) { sec = '0' + sec; }
        return day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    }

    // To convert data into MMM DD, YYYY format
    public static getDateInMmmDdYyyy(date: string) {
        const dateReceived = new Date(date);
        const months = ConstantMessages.Months;
        let day = String(dateReceived.getDate());
        const  month = months[dateReceived.getMonth()];
        const  year = String(dateReceived.getFullYear());
        if (1 === day.length) { day = '0' + day; }
        return month + ' ' + day + ', ' + year;
    }

    // To convert the date into YYYY-MM-DD format
    public static getDateInYyyyMmDd(date: string) {
        const dateFormatted = new Date(date);
        let month = (dateFormatted.getMonth() + 1);
        const day = dateFormatted.getDate();
        let year = dateFormatted.getFullYear();
        if (Number(month) > 12) {
            month = month - 12;
            year = year + 1;
        }
        let MonthData = '' + month;
        let dayData = '' + day;
        if (MonthData.length < 2) { MonthData = '0' + MonthData; }
        if (dayData.length < 2) { dayData = '0' + dayData; }
        return [year, MonthData, dayData].join('-');
    }

    // To return the numeric value up to 2 decimal places
    public static exactlyTwoDecimalsValue(value: number) {
        let result = '';
        const values = String(value).split('.');
        if (2 === values.length) {
            // tslint:disable-next-line:max-line-length
            if (1 === values[1].length) { values[1] = values[1] + '0'; } else if (2 < values[1].length) { values[1] = values[1].substring(0, 2); }
            result = values[0] + '.' + values[1];
        } else { result = values[0] + '.00'; }
        return result;
    }


    // To return the numeric value upto 2 decimal places
    public static uptoTwoDecimalsValue(value: number) {
        let result = 0;
        const values = String(value).split('.');
        if (2 === values.length) {
            // tslint:disable-next-line:max-line-length
            if (1 === values[1].length) { values[1] = values[1] + '0'; } else if (2 < values[1].length) { values[1] = values[1].substring(0, 2); }
            result = Number(values[0] + '.' + values[1]);
        } else { result = Number(values[0]); }
        return result;
    }

    // convert number to text format
    public static  NumberToTextFormat(amount) {
        const  words = new Array();
        words[0] = '';
        words[1] = 'One';
        words[2] = 'Two';
        words[3] = 'Three';
        words[4] = 'Four';
        words[5] = 'Five';
        words[6] = 'Six';
        words[7] = 'Seven';
        words[8] = 'Eight';
        words[9] = 'Nine';
        words[10] = 'Ten';
        words[11] = 'Eleven';
        words[12] = 'Twelve';
        words[13] = 'Thirteen';
        words[14] = 'Fourteen';
        words[15] = 'Fifteen';
        words[16] = 'Sixteen';
        words[17] = 'Seventeen';
        words[18] = 'Eighteen';
        words[19] = 'Nineteen';
        words[20] = 'Twenty';
        words[30] = 'Thirty';
        words[40] = 'Forty';
        words[50] = 'Fifty';
        words[60] = 'Sixty';
        words[70] = 'Seventy';
        words[80] = 'Eighty';
        words[90] = 'Ninety';
        amount = amount.toString();
        const atemp = amount.split('.');
        // tslint:disable-next-line:variable-name
        const number = atemp[0].split(',').join('');
        // tslint:disable-next-line:variable-name
        const  n_length = number.length;
        // tslint:disable-next-line:variable-name
        let words_string = '';
        if (n_length <= 9) {
            // tslint:disable-next-line:variable-name
            const n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
           // tslint:disable-next-line:variable-name
            const received_n_array = new Array();
            for (let ArrayData = 0; ArrayData < n_length; ArrayData++) {
                received_n_array[ArrayData] = number.substr(ArrayData, 1);
            }
            for (let numberData = 9 - n_length, Numbers = 0; numberData < 9; numberData++ , Numbers++) {
                n_array[numberData] = received_n_array[Numbers];
            }
            for (let ReceivedNumbers = 0, Digit = 1; ReceivedNumbers < 9; ReceivedNumbers++ , Digit++) {
                if (ReceivedNumbers === 0 || ReceivedNumbers === 2 || ReceivedNumbers === 4 || ReceivedNumbers === 7) {
                    if (n_array[ReceivedNumbers] === 1) {
                        // tslint:disable-next-line:radix
                        n_array[Digit] = 10 + parseInt(String(n_array[Digit]));
                        n_array[ReceivedNumbers] = 0;
                    }
                }
            }
            let value;
            for (let  NumberDigit = 0; NumberDigit < 9; NumberDigit++) {
                if (NumberDigit === 0 || NumberDigit === 2 || NumberDigit === 4 || NumberDigit === 7) {
                    value = n_array[NumberDigit] * 10;
                } else {
                    value = n_array[NumberDigit];
                }
                if (value !== 0) {
                    words_string += words[value] + ' ';
                }
                if ((NumberDigit === 1 && value !== 0) || (NumberDigit === 0 && value !== 0 && n_array[NumberDigit + 1] === 0)) {
                    words_string += 'Crores ';
                }
                if ((NumberDigit === 3 && value !== 0) || (NumberDigit === 2 && value !== 0 && n_array[NumberDigit + 1] === 0)) {
                    words_string += 'Lakhs ';
                }
                if ((NumberDigit === 5 && value !== 0) || (NumberDigit === 4 && value !== 0 && n_array[NumberDigit + 1] === 0)) {
                    words_string += 'Thousand ';
                }
                if (NumberDigit === 6 && value !== 0 && (n_array[NumberDigit + 1] !== 0 && n_array[NumberDigit + 2] !== 0)) {
                    words_string += 'Hundred and ';
                } else if (NumberDigit === 6 && value !== 0) {
                    words_string += 'Hundred ';
                }
            }
            words_string = words_string.split('  ').join(' ');
        }
        return words_string;
    }
   // converting in paise
    public static  RsPaise(amount) {
        const amounts = amount.toString().split('.');
        const whole =  CommonFunction.NumberToTextFormat(amounts[0]);
        let output;
        if (amounts[1] === null) {
            amounts[1] = 0;
        }
        if (amounts[1].length === 1 ) {
            amounts[1] = amounts[1] + '0';
        }
        if (amounts[1].length > 2) {
        amounts[1] = amounts[1].substring(2, length - 1);
        }
        if (amounts.length === 2) {
            if (amounts[0] <= 9) {
                 amounts [0] = amounts[0] * 10;
            } else {
                amounts[0] = amounts[0];
            }
            const fraction = CommonFunction.NumberToTextFormat(amounts[1]);
            let amt;
            if (whole === '' && fraction === '') {
                output = 'Zero only';
            }
            if (whole === '' && fraction !== '') {
            output = 'Paise ' + fraction + ' only';
        }
            if (whole !== '' && fraction === '') {output = 'Rupees ' + whole + ' only'; }
            if (whole !== '' && fraction !== '') {output = 'Rupees ' + whole + 'and ' + fraction + ' paise only'; }
            amt = amount;
            if ( amt > 999999999.99) {
            output = 'Oops!!! The amount is too big to convert';
        }
            if (isNaN(amt) === true ) {
            output = 'Error : Amount in number appears to be incorrect. Please Check.';
        }
        }
        return output;
    }
}
