import { Component, OnInit } from '@angular/core';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { Customer } from '../models/customer';
import { CustomerComponent } from '../customer/customer.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Project } from '../models/project';
import { CustomerService } from '../customer.service';
import { CustomersTableItem } from '../customers-table/customers-table-datasource';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  customers: CustomersTableItem[];
  disableAddCustomer: boolean = false;
  customerSelected: boolean = false;
  project: Project = new Project(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null);
    selectedCustomer: Customer;

  constructor(public newCustomerDialog: MatDialog, private customerService: CustomerService) { }

  ngOnInit() {

    this.customerService.getCustomers()
      .subscribe(c => this.customers = c );

  }

  onNewCustomerClick(): void {
    this.disableAddCustomer = true;
    const dialogRef = this.newCustomerDialog.open(CustomerComponent, {
      width: '250px',
      hasBackdrop: false,
      data: new Customer(4, null, null, null)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.createCustomer(result)
        .subscribe(result => console.log(result));

        this.customers = [...this.customers, result];
        this.selectedCustomer = result;
      }
      this.disableAddCustomer = false;
    })
  }

  onCustomerSelectionChanged($event) {
    this.customerSelected = !!($event);
  }

  displayCustomer(customer?: Customer): string | undefined {
    return customer ? customer.name : undefined;
  }

}
