import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Customer } from '../models/customer';
import { CustomersTableItem } from '../customers-table/customers-table-datasource';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {

  public dialogTitle: string;

  constructor(public dialogRef: MatDialogRef<CustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public model: CustomersTableItem) {
      if(model && model.CustomerId) {
        this.dialogTitle = 'Edit Customer';
      } else {
        this.dialogTitle = 'New Customer';
      }
     }

  onCancelClick():void {
    console.log('Cancelled');
    this.dialogRef.close();
  }
}
