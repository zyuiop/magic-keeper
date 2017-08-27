import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection.component";

const routes: Routes = [
  { path: '', redirectTo: '/collection', pathMatch: 'full' },
  { path: '**', redirectTo: '/collection', pathMatch: 'full' },
  { path: 'collection',  component: CollectionComponent },
  { path: 'collection/:display', component: CollectionComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
