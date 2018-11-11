import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Customer } from './models/customer';
import { CustomersTableItem } from './customers-table/customers-table-datasource';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = 'api/customer';
  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<CustomersTableItem[]> {
    return this.httpClient.get<CustomersTableItem[]>(this.url);
  }

  createCustomer(data:CustomersTableItem ): Observable<CustomersTableItem> {
    return this.httpClient.post<CustomersTableItem>(this.url, data);
  }
  
  updateCustomer(data:CustomersTableItem ): Observable<CustomersTableItem> {
    return this.httpClient.put<CustomersTableItem>(this.url, data);
  }
}
