import {NgModule} from "@angular/core";
import {DecksRoutingModule} from "./decks-routing.module";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";
import {CollectionLoadingModule} from "../collection-loading/collection-loading.module";
import {BrowserModule} from "@angular/platform-browser";
import {CardListModule} from "../card-list/card-list.module";
import {DeckViewerComponent} from "./deck-viewer.component";
import {LocalDecksProviderService} from "./local-decks-provider.service";
import {QuickRecapDisplayComponent} from "./quick-recap-display.component";
import {ReplaceManaPipe} from "../card-display/replacemana.pipe";
import {CardDisplayModule} from "../card-display/card-display.module";

@NgModule({
  declarations: [DecksComponent, DeckComponent, DeckViewerComponent, QuickRecapDisplayComponent],
  imports: [BrowserModule, DecksRoutingModule, CollectionLoadingModule, CardListModule, CardDisplayModule],
  providers: [LocalDecksProviderService]
})
export class DecksModule {}
