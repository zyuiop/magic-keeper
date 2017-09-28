import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PickUsernameComponent} from "./pick-username.component";
import {CallbackComponent} from "./callback.component";

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'pickUsername', component: PickUsernameComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
