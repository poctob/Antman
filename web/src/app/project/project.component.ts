import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomerComponent } from '../customer/customer.component';
import { CustomerService } from '../services/customer.service';
import { CustomersTableItem } from '../models/customer';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  customers: CustomersTableItem[];
  disableAddCustomer: boolean = false;
  customerSelected: boolean = false;
 

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
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.createCustomer(result)
        .subscribe(result => console.log(result));

        this.customers = [...this.customers, result];
      }
      this.disableAddCustomer = false;
    })
  }

  onCustomerSelectionChanged($event) {
    this.customerSelected = !!($event);
  }



}
