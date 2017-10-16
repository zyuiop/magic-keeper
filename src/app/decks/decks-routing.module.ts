import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";
import {DeckViewerComponent} from "./deck-viewer.component";
import {DeckHistoryComponent} from "./deck-history.component";

const routes: Routes = [
  { path: 'decks/:user', component: DecksComponent },
  { path: 'deck/:id', component: DeckViewerComponent },
  { path: 'deck/:id/edit', component: DeckComponent },
  { path: 'deck/:id/history', component: DeckHistoryComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class DecksRoutingModule {}
