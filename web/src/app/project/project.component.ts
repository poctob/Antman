import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Customer } from '../models/customer';
import { CustomerComponent } from '../customer/customer.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  customerControl = new FormControl();
  customers: Customer[] = new Array();
  filteredOptions: Observable<Customer[]>;

  constructor(public newCustomerDialog: MatDialog) { }

  ngOnInit() {
    this.customers.push(new Customer(1, 'test1', '', ''));
    this.customers.push(new Customer(2, 'test2', '', ''));
    this.customers.push(new Customer(3, 'test3', '', ''));

    this.filteredOptions = this.customerControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onNewCustomerClick(): void {
    console.log("New customer clicked!");
    const dialogRef = this.newCustomerDialog.open(CustomerComponent, {
      width: '250px',
      hasBackdrop: false,
      data: new Customer(4, null, null, null)
    });

    dialogRef.afterClosed().subscribe(result => {
      this.customers.push(result);
      this.customerControl.setValue(result.name);
    })
  }

  private _filter(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers
      .filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
