import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { CustomerService } from '../services/customer.service';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CustomerComponent } from '../customer/customer.component';
import { ProjectsTableComponent } from '../projects-table/projects-table.component';
import { CustomersTableItem } from '../models/customer';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.css'],
})
export class CustomersTableComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  displayProjects: boolean = false;
  projectsComponent: ProjectsTableComponent;

  private loadingData = new BehaviorSubject<boolean>(false);

  displayedColumns = ['deleteCustomer', 'editCustomer', 'name', 'email', 'phone'];

  constructor(private customerService: CustomerService, public customerDialog: MatDialog) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadingData.next(true);
   
    this.customerService.getCustomers().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingData.next(false))
    ).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  editCustomer(row: CustomersTableItem) {
    let currentRow = Object.assign({}, row);

    const dialogRef = this.customerDialog.open(CustomerComponent, {
      width: '250px',
      hasBackdrop: false,
      data: currentRow
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.updateCustomer(currentRow)
          .subscribe(retValue => this.updateInternalDataItem(retValue, false));
      }
    })

  }

  deleteCustomer(row: CustomersTableItem) {
    let currentRow = Object.assign({}, row);
    currentRow.isActive = false;

    this.customerService.updateCustomer(currentRow)
      .subscribe(retValue => this.updateInternalDataItem(retValue, true));
  }

  updateInternalDataItem(item: CustomersTableItem, doDelete: boolean) {
    const data = this.dataSource.data;
    let editedRowIndex = data.findIndex((c) => {
      let customer: CustomersTableItem = <CustomersTableItem>c;
      return customer.CustomerId == item.CustomerId
    });

    doDelete ? data.splice(editedRowIndex, 1) : data.splice(editedRowIndex, 1, item);
    this.dataSource.data = data;
  }

  onNewCustomerClick(): void {
    const dialogRef = this.customerDialog.open(CustomerComponent, {
      width: '250px',
      hasBackdrop: false,
      data: { CustomerId: '', isActive: true, name: '' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.customerService.createCustomer(result)
          .subscribe((result) => {
            console.log(result);
            const data = this.dataSource.data;
            data.push(result);
            this.dataSource.data = data;
          });
      }
    });
  }

  showProjects(row: CustomersTableItem) {
   
  }
}
