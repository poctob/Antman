import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  model = new Customer(0, 'test', '123', 'eer');

  // email = new FormControl('', [Validators.email]);
  // name = new FormControl();
  // phone = new FormControl('', [Validators.pattern('[0-9]{10}$')]);

  // getEmailErrorMessage() {
  //   return this.model.email.hasError('email') ? 'Not a valid email' :
  //     '';
  // }

  // getPhoneErrorMessage() {
  //   return this.model.phone.hasError('pattern') ? 'Not a valid phone' :
  //     '';
  // }

  onSubmit() {
    console.log('Submitted');
  }

  constructor() { }

  ngOnInit() {
  }

}
