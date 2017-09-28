import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection/collection.component";
import {CallbackComponent} from "./auth/callback.component";
import {PublicCollectionComponent} from "./collection/public-collection.component";
import {PickUsernameComponent} from "./auth/pick-username.component";
import {PageNotFoundComponent} from "./page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: '/collection/my', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
