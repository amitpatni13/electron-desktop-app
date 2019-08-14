import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ConstantMessages } from 'src/Constants/constant';
import { FinalBillDBService } from 'src/Services/finalBill.service';
import { ProfitLossService } from 'src/Services/profit&loss.service';
import { SalesReportService } from 'src/Services/salesReport.service';
import { DashboardService } from 'src/Services/dashboard.service';
import { IExpenseData } from 'src/Model/Dashboard.model';
import { IExpenseCategories } from 'src/Model/expense.Model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})

// tslint:disable-next-line:component-class-suffix
export class HomePage implements OnInit {
  date: Date;
  salesChart: any;
  outstandingBalanceChart: any;
  expensesChart: any;
  productsSoldChart: any;
  profitLossChart: any;
  @ViewChild('salesCanvas') salesCanvas;
  @ViewChild('expenseCanvas') expenseCanvas;
  @ViewChild('profitLossCanvas') profitLossCanvas;
  // @ViewChild('balanceCanvas') balanceCanvas;
  // @ViewChild('productsSoldCanvas') productsSoldCanvas;
  ExpensePeriod = 'THIS MONTH';
  BankAccountConnect = 'Go to registers';
  ProfitLossPeriod = 'THIS MONTH';
  SalesPeriod = 'LAST MONTH';
  currency = '';
  NetExpense = 0;
  NetProfit = 0;
  NetSales = 0;
  saleData;
  saleValues = [];
  profitValues = [];
  expenseData: IExpenseData[];
  expenseCategoriesData: IExpenseCategories[];
  expenseCategoryColors: string[] = [];
  expenseCategories: string[] = [];
  expenseValues = [];

  constructor(public router: Router, private billService: FinalBillDBService, private profitLossService: ProfitLossService,
              private salesReportService: SalesReportService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.billService.SelectAutoIncrementInvoice('Currency', '1').then((responseCurrency) => {
      for (const currency of ConstantMessages.CURRENCY) {
        if (currency.Name === responseCurrency.InvoiceVerify) {
          this.currency = currency.CODE;
        }
      }
    });
    this.SalesCardData();
    this.ExpenseCardData();
    this.ProfitLossCardData();
  }

  /** Calculating the Net Sales and generating the Chart for the Sales Card */
  SalesCardData() {
    const today = new Date();
    let fromDate = '';
    let toDate = '';
    if ('TODAY' === this.SalesPeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 1).toISOString().split('T')[0];
      toDate = today.toISOString().split('T')[0];
    } else if ('THIS WEEK' === this.SalesPeriod) {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6
      fromDate = new Date(curr.setDate(first)).toISOString().split('T')[0];
      toDate = new Date(curr.setDate(last)).toISOString().split('T')[0];
    } else if ('THIS MONTH' === this.SalesPeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
    } else if ('THIS YEAR' === this.SalesPeriod || 'ALL' === this.SalesPeriod) {
      fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
    }
    this.callingSaleData(fromDate, toDate, (TotalSale) => {
      this.NetSales = TotalSale;
    });
    this.getAllSalesDataFromDB(fromDate, toDate, () => {
      this.generateSalesAndProfitData(fromDate, toDate);
      const labelDates = this.getDatePeriod(fromDate, toDate);
      this.salesChart = new Chart(this.salesCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labelDates,
          datasets: [
            {
              label: 'Sales',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(74, 239, 79,0.4)',
              borderColor: 'rgba(74, 239, 79,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.saleValues, // Calculated Sales Data added here
              spanGaps: false,
            }
          ]
        }
      });
    });
  }

  /** Calculating the Net Expense */
  ExpenseCardData() {
    const today = new Date();
    let fromDate = '';
    let toDate = '';
    if ('TODAY' === this.ExpensePeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 1).toISOString().split('T')[0];
      toDate = today.toISOString().split('T')[0];
    } else if ('THIS WEEK' === this.ExpensePeriod) {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6
      fromDate = new Date(curr.setDate(first)).toISOString().split('T')[0];
      toDate = new Date(curr.setDate(last)).toISOString().split('T')[0];
    } else if ('THIS MONTH' === this.ExpensePeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
    } else if ('THIS YEAR' === this.ExpensePeriod || 'ALL' === this.ExpensePeriod) {
      fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
    }
    this.CalculateExpense(fromDate, toDate, (TotalExpense) => {
      this.CalculateTotalPurchase(fromDate, toDate, (TotalProductsPurchased) => {
        this.CalculatePurchaseReturn(fromDate, toDate, (TotalPurchaseReturn) => {
          this.CalculateReverseCharge(fromDate, toDate, (TotalReverseCharge) => {
            this.NetExpense = TotalExpense + TotalProductsPurchased + TotalReverseCharge - TotalPurchaseReturn;
          });
        });
      });
    });
    this.getAllExpenseDataFromDB(fromDate, toDate).then(() => {
      this.getAllExpenseCategoriesFromDB().then(() => { // Fills the expense category data array wrt to the response received from DB
        this.getAllExpenseCategoriesInfo().then(() => {  // Fills the expenseCategory and expense category color arrays
          this.generateExpenseCategoriesData().then(() => { // For Expense Categories Graph
            this.updateExpenseCategoryArrays().then(() => {  // Update the expense category arrays if no value is present
              // this.expenseValues = [200, 80];
              // this.expenseCategories = ['Electricity', 'Internet'];
              // this.expenseCategoryColors = ['rgba(0, 116, 217, 0.5)', 'rgba(127, 219, 255, 0.5)'];
              // Pie Chart for Expense Category
              const borderWidthArray: number[] = [];
              const hoverBorderWidthArray: number[] = [];
              const expenseCategoryColors: string[] = [];
              // tslint:disable-next-line:prefer-for-of
              for (let index = 0; index < this.expenseValues.length; index++) {
                borderWidthArray.push(1);
                hoverBorderWidthArray.push(2);
                expenseCategoryColors.push(this.expenseCategoryColors[index]);
              }
              this.expensesChart = new Chart(this.expenseCanvas.nativeElement, {
                type: 'doughnut', // Same settings for 'pie' chart as well
                data: {
                  datasets: [{
                    label: 'Expense Categories',
                    backgroundColor: expenseCategoryColors,
                    borderColor: expenseCategoryColors,
                    borderWidth: borderWidthArray,
                    hoverBackgroundColor: expenseCategoryColors,
                    hoverBorderColor: expenseCategoryColors,
                    hoverBorderWidth: hoverBorderWidthArray,
                    data: this.expenseValues
                  }],
                  // These labels appear in the legend and in the tool tips when hovering different arcs
                  labels: this.expenseCategories
                },
                options: {
                  cutoutPercentage: 50,
                  rotation: -0.5 * Math.PI,
                  circumference: 2 * Math.PI,
                  animation: {
                    animateRotate: true,
                    animateScale: false
                  }
                }
              });
            });
          });
        });
      });
    });
  }

  /** Calculating the Net Profit */
  ProfitLossCardData() {
    const today = new Date();
    let fromDate = '';
    let toDate = '';
    if ('TODAY' === this.ProfitLossPeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 1).toISOString().split('T')[0];
      toDate = today.toISOString().split('T')[0];
    } else if ('THIS WEEK' === this.ProfitLossPeriod) {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6
      fromDate = new Date(curr.setDate(first)).toISOString().split('T')[0];
      toDate = new Date(curr.setDate(last)).toISOString().split('T')[0];
    } else if ('THIS MONTH' === this.ProfitLossPeriod) {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0];
    } else if ('THIS YEAR' === this.ProfitLossPeriod || 'ALL' === this.ProfitLossPeriod) {
      fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      toDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
    }
    const startDate = new Date(fromDate);
    const previousStartDate = new Date(startDate.setDate(startDate.getDate() - 1)).toISOString().split('T')[0];
    const previousYearStartDate = new Date(new Date().getFullYear() - 1, 3, 2, 0).toISOString().split('T')[0];
    const IndirectExpenseData = 0;

    // this.CalculateSaleReturn(fromDate, toDate, (TotalSaleReturn) => {
    //   this.CalculatePayableOutstandingBalance(fromDate, toDate, (PayableOutstandingBalance) => {
    //     this.CalculateReceivableOutstandingBalance(fromDate, toDate, (ReceivableOutstandingBalance) => {
    //     });
    //   });
    // });
    this.CalculateTotalTax(fromDate, toDate, (TotalTaxValue) => {
      this.CalculateClosingStock(fromDate, toDate, (TotalClosingStock) => {
        this.CalculateOpeningStock(previousYearStartDate, previousStartDate, (TotalOpeningStock) => {
          this.callingSaleData(fromDate, toDate, (totalSale) => {
            this.CalculateExpense(fromDate, toDate, (TotalExpense) => {
              this.CalculateTotalPurchase(fromDate, toDate, (TotalProductsPurchased) => {
                this.CalculatePurchaseReturn(fromDate, toDate, (TotalPurchaseReturn) => {
                  this.CalculateReverseCharge(fromDate, toDate, (TotalReverseCharge) => {
                    this.NetProfit = totalSale - (TotalOpeningStock +
                      (TotalProductsPurchased + TotalReverseCharge - TotalPurchaseReturn)
                      - TotalClosingStock) - (TotalExpense + IndirectExpenseData) - TotalTaxValue;
                  });
                });
              });
            });
          });
        });
      });
    });
    this.getAllSalesDataFromDB(fromDate, toDate, () => {
      this.generateSalesAndProfitData(fromDate, toDate);
      const labelDates = this.getDatePeriod(fromDate, toDate);
      this.profitLossChart = new Chart(this.profitLossCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labelDates,
          datasets: [
            {
              label: 'Sales',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(74, 239, 79,0.4)',
              borderColor: 'rgba(74, 239, 79,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.saleValues, // Calculated Sales Data added here
              spanGaps: false
            }, {
              label: 'Profit',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(74, 239, 79,0.4)',
              borderColor: 'rgba(74, 239, 79,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.profitValues, // Calculated Sales Data added here
              spanGaps: false
            }
          ]
        }
      });
    });
  }

  // Calculating Total expense price between the expense date
  CalculateExpense(fromDate, toDate, callback) {
    // getting the total expense amount for each Expense between the dates
    this.profitLossService.getAllExpenseData(fromDate, toDate).then(
      (res) => {
        const ExpenseData = res;
        let totalExpense = this.getTotalExpenseAmount(ExpenseData);
        if (totalExpense === undefined || totalExpense == null) {
          totalExpense = 0;
        }
        callback(totalExpense);
      });
  }

  // calculating the total purchase price
  CalculateTotalPurchase(fromDate, toDate, callback) {
    // getting the total price amount for each transaction between the dates
    this.profitLossService.getTotalProductCount(fromDate, toDate).then(
      (res) => {
        const TotalProducts = res;
        let TotalProductsPurchased = this.getTotalPurchaseAmount(TotalProducts);
        if (TotalProductsPurchased === undefined || TotalProductsPurchased == null) {
          TotalProductsPurchased = 0;
        }
        callback(TotalProductsPurchased);
      });
  }

  // Calculating Purchase Return
  CalculatePurchaseReturn(fromDate, toDate, callback) {
    this.profitLossService.getPurchaseReturn(fromDate, toDate).then(
      (res) => {
        const PurchaseReturn = res;
        let TotalPurchaseReturn = this.getTotalPurchaseReturn(PurchaseReturn);
        if (TotalPurchaseReturn === undefined || TotalPurchaseReturn == null) {
          TotalPurchaseReturn = 0;
        }
        callback(TotalPurchaseReturn);
      }
    );
  }

  // Calculating the Reverse Charge If Present
  CalculateReverseCharge(fromDate, toDate, callback) {
    this.profitLossService.getReverseCharge(fromDate, toDate).then(
      (res) => {
        const ReverseCharge = res;
        let TotalReverseCharge = this.getTotalReverseCharge(ReverseCharge);
        if (TotalReverseCharge === undefined || TotalReverseCharge == null) {
          TotalReverseCharge = 0;
        }
        callback(TotalReverseCharge);
      }
    );
  }

  // getting the Total Sale Value
  callingSaleData(fromDate, toDate, callback) {
    // getting the total price amount for each transaction between the dates
    this.salesReportService.getSalesReportData(fromDate, toDate, (res) => {
      const reportData = res;
      let totalSale = this.getTotalAmount(reportData);
      if (totalSale === undefined || totalSale == null) {
        totalSale = 0;
      }
      callback(totalSale);
    });
  }

  // Calculating the OpeningStock by taking the current stock and purchase price
  CalculateOpeningStock(previousYearStartDate, previousstartDate, callback) {
    this.profitLossService.getOpeningStock(previousYearStartDate, previousstartDate).then(
      (res) => {
        const OpeningStock = res;
        let TotalOpeningStock = this.getTotalOpeningStock(OpeningStock);
        if (TotalOpeningStock === undefined || TotalOpeningStock == null) {
          TotalOpeningStock = 0;
        }
        callback(TotalOpeningStock);
      }
    );
  }

  // Calculating the ClosingStock By T
  CalculateClosingStock(fromDate, toDate, callback) {
    this.profitLossService.getClosingStock(fromDate, toDate).then(
      (res) => {
        const ClosingStock = res;
        let TotalClosingStock = this.getTotalClosingStock(ClosingStock);
        if (TotalClosingStock === undefined || TotalClosingStock == null) {
          TotalClosingStock = 0;
        }
        callback(TotalClosingStock);
      }
    );
  }

  // Calculating TotalTax by adding TotalSaleTax And TotalPurchaseTax
  CalculateTotalTax(fromDate, toDate, callback) {
    this.profitLossService.getTotalTax(fromDate, toDate).then(
      (res) => {
        const TotalTax = res;
        let TotalTaxValue = this.getTotalTaxValue(TotalTax);
        if (TotalTaxValue === undefined || TotalTaxValue == null) {
          TotalTaxValue = 0;
        }
        callback(TotalTaxValue);
      }
    );
  }

  // Calculating the total value for the sale
  getTotalAmount(reportData) {
    let total = 0;
    for (const data of reportData) {
      if (0 === data.isSaleReturn) { total += data.TotalPayable; }
    }
    return total;
  }

  getTotalOpeningStock(OpeningStock) {
    let total = 0;
    for (const data of OpeningStock) {
      if (data.CurrentStock > 0 && ConstantMessages.BillType.PURCHASE !== data.TransactionType
        && ConstantMessages.BillType.SALE_RETURN !== data.TransactionType) {
        total += (data.CurrentStock * data.PurchasePrice);
      } else {
        total += (-data.CurrentStock) * data.PurchasePrice;
      }
    }
    return total;
  }

  getTotalClosingStock(ClosingStock) {
    let total = 0;
    for (const data of ClosingStock) {
      if (data.QtyChanged > 0) {
        total += (data.QtyChanged * data.PurchasePrice);
      } else {
        total += (-data.QtyChanged) * data.PurchasePrice;
      }
    }
    return total;
  }

  getTotalTaxValue(TotalTax) {
    let total = 0;
    if (TotalTax && TotalTax.length) {
      for (const data of TotalTax) {
        total += (data.TotalSaleTax + data.TotalPurchaseTax);
      }
    }
    return total;
  }

  // Calculating the total Expense value for the sale
  getTotalExpenseAmount(ExpenseData) {
    let total = 0;
    for (const data of ExpenseData) {
      total += data.totalExpenseAmount;
    }
    return total;
  }

  // Calculating the total Purchase Products for all transaction
  getTotalPurchaseAmount(TotalProducts) {
    let total = 0;
    for (const data of TotalProducts) {
      total += data.totalAmount;
    }
    return total;
  }

  // Calculating the total Purchase Return
  getTotalPurchaseReturn(PurchaseReturn) {
    let total = 0;
    for (const data of PurchaseReturn) {
      total += data.totalAmount;
    }
    return total;
  }

  // Calculating the total Reverse Charge
  getTotalReverseCharge(ReverseCharge) {
    let total = 0;
    for (const data of ReverseCharge) {
      total += data.totalAmount;
    }
    return total;
  }

  // Getting the data array values for the graphs for sales and profit
  generateSalesAndProfitData(fromDate, toDate) {
    const datePeriod = this.getDatePeriod(fromDate, toDate);
    if (undefined === this.saleData || null === this.saleData) { this.saleData = []; } // In case response from DB is undefined
    for (const date of datePeriod) { // date is a string of type DD-MM-YYYY
      // Getting the sale values for the current date
      let saleAmount = 0;
      const invoiceNumbers: string[] = [];
      for (const sale of this.saleData) {
        const saleDate = this.formatDate(sale.saleDate); // Converting date to string of type DD-MM-YYYY
        if (date === saleDate) { // Comparing the two date strings of similar types
          if (invoiceNumbers.length) { // Checking if total amount already added for Invoice Number
            for (const invoice of invoiceNumbers) {
              if (invoice !== sale.saleInvoiceNumber) { // Amount not added
                saleAmount += sale.totalSaleAmount;
                // Adding the invoice number into the array so that bill amount is not added twice for the same invoice number
                invoiceNumbers.push(sale.saleInvoiceNumber);
                break;
              }
            }
          } else { // First element of array
            saleAmount += sale.totalSaleAmount;
            invoiceNumbers.push(sale.saleInvoiceNumber);
          }
        }
      }
      this.saleValues.push(saleAmount);
      // Getting the profit values for the current date
      let profitAmount = 0;
      for (const sale of this.saleData) {
        const profitDate = this.formatDate(sale.saleDate); // Converting date to string of type DD-MM-YYYY
        if (date === profitDate) { // Comparing the two date strings of similar type
          const profit = (sale.itemSellingPrice - sale.itemPurchasePrice) * sale.itemQuantity;
          profitAmount += profit;
        }
      }
      this.profitValues.push(profitAmount);
    }
    console.log('Sales Values generated from Sales Data is: ', this.saleValues);
    console.log('Profit Values generated from Sales/Profit Info is: ', this.profitValues);
    return;
  }

  // To get the Sales Data from DB for  Income vs Expense, Sales vs Profit and Cash Flow Graphs
  // Also Sales Data is useful for deducing Profit Data from that info for Sales vs Profit Graph
  async getAllSalesDataFromDB(startDate: string, endDate: string, callback) {
    await this.dashboardService.getAllSalesData(startDate, endDate).then((response) => {
      if (response) { this.saleData = response; }
      callback(true);
      console.log('Sales Data received from DB is: ', this.saleData);
    });
  }

  // To get the Expense Data from DB for Income vs Expense and Expense Categories Graphs
  async getAllExpenseDataFromDB(startDate: string, endDate: string) {
    await this.dashboardService.getAllExpenseData(startDate, endDate).then((response) => {
      if (response) { this.expenseData = response; }
      console.log('Expense Data received from DB is: ', this.expenseData);
    });
  }

  // To get the Expense Categories and their colors from DB for Expense Categories Graphs
  async getAllExpenseCategoriesFromDB() {
    await this.dashboardService.getAllExpenseCategories().then((response) => {
      if (response) { this.expenseCategoriesData = response; }
      console.log('Expense Category Data received from DB is: ', this.expenseCategoriesData);
    });
  }

  // Getting the data array values for the expense category graph
  async generateExpenseCategoriesData() {
    if (undefined === this.expenseCategories || null === this.expenseCategories) { // In case response from DB is undefined
      this.expenseCategories = [];
    }
    if (undefined === this.expenseData || null === this.expenseData) { this.expenseData = []; } // In case response from DB is undefined
    // Getting the total expense values for the each of the category
    for (const category of this.expenseCategoriesData) {
      let expenseAmount = 0;
      for (const expense of this.expenseData) {
        if (category.id === Number(expense.expenseCategoryID)) {
          expenseAmount += expense.totalExpenseAmount;
        }
      }
      this.expenseValues.push(expenseAmount);
    }
    console.log('Initial Expense Values generated from Expense Data is: ', this.expenseValues);
    return await this.expenseValues;
  }

  // Getting all the expense categories names and colors in separate arrays, also to be used as labels in expense category graph
  async getAllExpenseCategoriesInfo() {
    this.expenseCategories = []; this.expenseCategoryColors = [];
    for (const category of this.expenseCategoriesData) {
      category.name = category.name.trim();
      const categoryName = category.name.charAt(0).toUpperCase() + category.name.substring(1);
      this.expenseCategories.push(categoryName); // Adding the category to Expense Categories
      this.expenseCategoryColors.push(category.color); // Adding the color for the Expense Category
    }
    return await this.expenseCategories;
  }

  // Removing all the unwanted data from the expense category arrays
  async updateExpenseCategoryArrays() {
    const updatedExpenseValues: number[] = [];
    const updatedExpenseCategories: string[] = [];
    const updatedExpenseCategoryColors: string[] = [];
    for (let index = 0; index < this.expenseValues.length; index++) {
      if (0 < this.expenseValues[index]) { // Pushing the data into the updated arrays only if there is an expense value
        updatedExpenseValues.push(this.expenseValues[index]);
        updatedExpenseCategories.push(this.expenseCategories[index]);
        updatedExpenseCategoryColors.push(this.expenseCategoryColors[index]);
      }
    }
    // Replacing the arrays with the updated expense data arrays
    this.expenseValues = updatedExpenseValues;
    this.expenseCategories = updatedExpenseCategories;
    this.expenseCategoryColors = updatedExpenseCategoryColors;
    console.log('Expense Values generated from Expense Data is: ', this.expenseValues);
    console.log('Expense Categories generated from Expense Data is: ', this.expenseCategories);
    return await [updatedExpenseValues, updatedExpenseCategories, updatedExpenseCategoryColors];
  }

  getDatePeriod(fromDate, toDate) {
    let startDate = new Date(fromDate);
    let endDate = new Date(toDate);
    // Swap the dates if End Date is smaller than Start Date
    if (startDate > endDate) {
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }
    const labelDates: string[] = [];
    while (startDate <= endDate) {
      labelDates.push(this.formatDate(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    console.log('Dates Between Start and End Dates are', labelDates);
    return labelDates;
  }

  // To convert the date into DD-MM-YYYY format
  formatDate(date) {
    const dateFormatted = new Date(date);
    const year = dateFormatted.getFullYear();
    let month = '' + (dateFormatted.getMonth() + 1);
    let day = '' + dateFormatted.getDate();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [day, month, year].join('-');
  }

  // // Calculating the ReceivableOutStanding balance Between the Financial Year
  // CalculateReceivableOutstandingBalance(fromDate, toDate, callback) {
  //   this.profitLossService.getReceivableOutStandingBalance(fromDate, toDate).then(
  //     (res) => {
  //       const Receivable = res;
  //       let TotalReceivableBalance = this.getTotalReceivableOutStandingBalance(Receivable);
  //       if (TotalReceivableBalance === undefined || TotalReceivableBalance == null) {
  //         TotalReceivableBalance = 0;
  //       }
  //       callback(TotalReceivableBalance);
  //     });
  // }

  // // Calculating the PayableOutStanding balance Between the Financial Year
  // CalculatePayableOutstandingBalance(fromDate, toDate, callback) {
  //   this.profitLossService.getPayableOutStandingBalance(fromDate, toDate).then(
  //     (res) => {
  //       const Payable = res;
  //       let TotalPayableBalance = this.getTotalPayableOutStandingBalance(Payable);
  //       if (TotalPayableBalance === undefined || TotalPayableBalance == null) {
  //         TotalPayableBalance = 0;
  //       }
  //       callback(TotalPayableBalance);
  //     }
  //   );
  // }

  // // Calculating Sale Return
  // CalculateSaleReturn(fromDate, toDate, callback) {
  //   this.profitLossService.getSaleReturn(fromDate, toDate).then(
  //     (res) => {
  //       const SaleReturn = res;
  //       let TotalSaleReturn = this.getTotalSaleReturn(SaleReturn);
  //       if (TotalSaleReturn === undefined || TotalSaleReturn == null) {
  //         TotalSaleReturn = 0;
  //       }
  //       callback(TotalSaleReturn);
  //     }
  //   );
  // }

  // getTotalReceivableOutStandingBalance(Receivable) {
  //   let total = 0;
  //   for (const data of Receivable) {
  //     total += data.OutstandingBalance;
  //   }
  //   return total;
  // }

  // getTotalPayableOutStandingBalance(Payable) {
  //   let total = 0;
  //   for (const data of Payable) {
  //     total += data.OutstandingBalance;
  //   }
  //   return total;
  // }

  // getTotalSaleReturn(SaleReturn) {
  //   let total = 0;
  //   for (const data of SaleReturn) {
  //     total += data.TotalPayable;
  //   }
  //   return total;
  // }
}
