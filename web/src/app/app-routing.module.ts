import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersTableComponent } from './customers-table/customers-table.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';

const routes: Routes = [
  { path: 'customers', component: CustomersTableComponent},
  { path: 'projects', component: ProjectsTableComponent},
  { path: '**', component: ProjectsTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
