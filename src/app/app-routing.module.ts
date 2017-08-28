import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection/collection.component";
import {CallbackComponent} from "./callback/callback.component";
import {PublicCollectionComponent} from "./collection/public-collection.component";
import {PickUsernameComponent} from "./auth/pick-username.component";

const routes: Routes = [
  { path: '', redirectTo: '/my', pathMatch: 'full' },
  // { path: '**', redirectTo: '/my', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'my',  component: CollectionComponent },
  { path: 'my/:display', component: CollectionComponent },
  { path: 'collection/:url', component: PublicCollectionComponent },
  { path: 'pickUsername', component: PickUsernameComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
