import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { of } from 'rxjs';
import { CustomerProjects, ProjectsTableItem } from '../models/project';
import { ProjectService } from '../services/project.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css'],
})
export class ProjectsTableComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectDataSource = new MatTableDataSource();
  resultsLength = 0;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['ProjectId' , 'CustomerName', 'Type', 'DocumentType'];

  constructor(private projectService: ProjectService) {
  }

  ngAfterViewInit() {
    this.projectDataSource.paginator = this.paginator;
    this.projectDataSource.sort = this.sort;

    this.projectService.getCustomers().pipe(
      catchError(() => of([]))
    ).subscribe((data) => {
      // console.log(this.transformDataToProjects(data));
      this.projectDataSource.data = this.transformDataToProjects(data);
    });
  }

  transformDataToProjects(data: CustomerProjects[]) {
    let transformedData: ProjectsTableItem[] = [];

    data.forEach((x) => {
      if (x.projects) {
        x.projects.forEach((p) => {
          let project = p;
          project["CustomerId"] = x.CustomerId;
          project["CustomerName"] = x.name;
          transformedData.push(project);
        });
      }
    });

    return transformedData;
  }

}
