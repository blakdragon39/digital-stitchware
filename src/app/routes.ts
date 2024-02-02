import { Routes } from '@angular/router'
import { CreationComponent } from './creation/creation.component'


export const routes: Routes = [
  { path: '', redirectTo: '/creation', pathMatch: 'full'},
  { path: 'creation', component: CreationComponent },
]
