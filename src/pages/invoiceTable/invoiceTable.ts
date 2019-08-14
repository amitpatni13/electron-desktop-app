import { Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-invoice-table',
    templateUrl: './invoiceTable.html',
    styleUrls: ['./invoiceTable.scss']
})
export class InvoiceTableComponent implements OnInit, OnChanges {

    @Input() data;
    @Input() currency: string;
    @Input() displayedColumns: string[];
    dataSource = new MatTableDataSource<any>(this.data);
    selection = new SelectionModel<any>(true, []);
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) { // Only run when property "data" changed
            this.data = changes.data.currentValue;
        }
        if (changes.currency) { // Only run when property "currency" changed
            this.currency = changes.currency.currentValue;
        }
        if (changes.displayedColumns) { // Only run when property "displayedColumns" changed
            this.displayedColumns = changes.displayedColumns.currentValue;
        }
        console.log(changes);
    }

    ngOnInit() {
        console.log(this.currency, this.data);
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.paginator = this.paginator;
    }

    selectPaymentAction(ev: any) {
        console.log(ev);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
}
