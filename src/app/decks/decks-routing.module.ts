import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";

const routes: Routes = [
  { path: 'decks/:user', component: DecksComponent },
  { path: 'decks/:user/:id', component: DeckComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class DecksRoutingModule {}
