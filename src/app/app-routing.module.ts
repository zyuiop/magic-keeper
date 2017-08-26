import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CardListComponent} from "./card-list.component";

const routes: Routes = [
  { path: '', redirectTo: '/collection', pathMatch: 'full' },
  { path: '**', redirectTo: '/collection', pathMatch: 'full' },
  { path: 'collection',  component: CardListComponent },
  { path: 'collection/:display', component: CardListComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
