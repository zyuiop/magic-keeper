import {NgModule} from "@angular/core";
import {DecksRoutingModule} from "./decks-routing.module";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";
import {CollectionLoadingModule} from "../collection-loading/collection-loading.module";
import {BrowserModule} from "@angular/platform-browser";
import {CardListModule} from "../card-list/card-list.module";

@NgModule({
  declarations: [DecksComponent, DeckComponent],
  imports: [BrowserModule, DecksRoutingModule, CollectionLoadingModule, CardListModule]
})
export class DecksModule {}
