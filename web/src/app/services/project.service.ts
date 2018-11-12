import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerProjects } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url = 'api/project';
  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<CustomerProjects[]> {
    return this.httpClient.get<CustomerProjects[]>(this.url);
  }

  getProjectByCustomerId(customerId: string): Observable<CustomerProjects[]> {
    return this.httpClient.get<CustomerProjects[]>(this.url + '/' + customerId);
  }
}
