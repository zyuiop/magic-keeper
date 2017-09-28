import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection.component";

const routes: Routes = [
  { path: 'my', redirectTo: '/collection/my', pathMatch: 'full' },
  { path: 'collection/:url', component: CollectionComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class CollectionRoutingModule {}
