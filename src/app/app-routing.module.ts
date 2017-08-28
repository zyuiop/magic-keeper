import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollectionComponent} from "./collection.component";
import {CallbackComponent} from "./callback/callback.component";

const routes: Routes = [
  { path: '', redirectTo: '/my', pathMatch: 'full' },
  // { path: '**', redirectTo: '/my', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'my',  component: CollectionComponent },
  { path: 'my/:display', component: CollectionComponent },
  { path: 'collection/:url', component: CollectionComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
