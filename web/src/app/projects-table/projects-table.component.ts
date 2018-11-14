import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { of, Observable } from 'rxjs';
import { CustomerProjects, ProjectsTableItem } from '../models/project';
import { ProjectService } from '../services/project.service';
import { catchError, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ProjectComponent } from '../project/project.component';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css'],
})
export class ProjectsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectDataSource = new MatTableDataSource();
  resultsLength = 0;
  projects$: Observable<CustomerProjects[]>;
  customerId: string;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['deleteProject', 'editProject', 'ProjectId', 'CustomerName', 'Type', 'DocumentType', 'IsActive'];

  constructor(private projectService: ProjectService, private route: ActivatedRoute, public projectDialog: MatDialog) {
  }

  ngOnInit() {
    this.projects$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.customerId = params.get('customerId');
        return this.customerId ? this.projectService.getProjectByCustomerId(this.customerId) : this.projectService.getProjects();
      })
    );
  }

  ngAfterViewInit() {
    this.projectDataSource.paginator = this.paginator;
    this.projectDataSource.sort = this.sort;

    this.projects$.pipe(
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

  editProject(row: ProjectsTableItem) {
    console.log(row);
    let currentRow = Object.assign({}, row);

    const dialogRef = this.projectDialog.open(ProjectComponent, {
      width: '750px',
      hasBackdrop: false,
      data: currentRow
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.updateProject(currentRow)
          .subscribe(data => this.projectDataSource.data = this.transformDataToProjects(data));
      }
    })

  }

  deleteProject(row: ProjectsTableItem) {
    let currentRow = Object.assign({}, row);
    currentRow.isActive = false;

    this.projectService.updateProject(currentRow)
          .subscribe(data => this.projectDataSource.data = this.transformDataToProjects(data));
  }
}
