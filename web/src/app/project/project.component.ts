import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsTableItem } from '../models/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  public dialogTitle: string;

  constructor(public dialogRef: MatDialogRef<ProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public model: ProjectsTableItem) {
      if(model && model.CustomerId) {
        this.dialogTitle = 'Edit Project';
      } else {
        this.dialogTitle = 'New Project';
      }
     }

  onCancelClick():void {
    this.dialogRef.close();
  }



}
