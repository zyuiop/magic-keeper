import {NgModule} from "@angular/core";
import {DecksRoutingModule} from "./decks-routing.module";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";

@NgModule({
  declarations: [DecksComponent, DeckComponent],
  imports: [DecksRoutingModule]
})
export class DecksModule {}
