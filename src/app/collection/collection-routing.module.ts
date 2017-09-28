import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection.component";
import {PublicCollectionComponent} from "./public-collection.component";

const routes: Routes = [
  { path: 'my', redirectTo: '/collection/my', pathMatch: 'full' },
  { path: 'collection/my',  component: CollectionComponent },
  { path: 'collection/my/:display', component: CollectionComponent },
  { path: 'collection/:url/:display', component: PublicCollectionComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class CollectionRoutingModule {}
