import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CustomerService } from '../customer.service';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

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
  private loadingData = new BehaviorSubject<boolean>(false);

  displayedColumns = ['name', 'email', 'phone'];

  constructor(private customerService: CustomerService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadingData.next(true);
    this.customerService.getCustomers() .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingData.next(false))
      ).subscribe( data => this.dataSource.data = data);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
   
}
