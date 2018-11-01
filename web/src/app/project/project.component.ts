import { Component, OnInit } from '@angular/core';
import { MatDialog, MatAutocompleteSelectedEvent } from '@angular/material';
import { Customer } from '../models/customer';
import { CustomerComponent } from '../customer/customer.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Project } from '../models/project';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  customerControl = new FormControl();
  customers: Customer[];
  filteredOptions: Observable<Customer[]>;
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

  constructor(public newCustomerDialog: MatDialog, private customerService: CustomerService) { }

  ngOnInit() {

    this.customerService.getCustomers()
      .subscribe((c) => {
        this.customers = c;
        this.filteredOptions = this.customerControl.valueChanges
          .pipe(
            startWith<string | Customer>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => this._filter(name))
          );
      });

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
        this.customers.push(result);
        this.customerControl.setValue(result.name);
      }
      this.disableAddCustomer = false;
    })
  }

  onCustomerSelectionChanged(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.customerSelected = true;
  }

  displayCustomer(customer?: Customer): string | undefined {
    return customer ? customer.name : undefined;
  }

  private _filter(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers
      .filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
