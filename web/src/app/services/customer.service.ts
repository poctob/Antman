import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CustomersTableItem } from '../models/customer';

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
