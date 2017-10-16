import {NgModule} from "@angular/core";
import {DecksRoutingModule} from "./decks-routing.module";
import {DeckComponent} from "./deck.component";
import {DecksComponent} from "./decks.component";
import {CollectionLoadingModule} from "../collection-loading/collection-loading.module";
import {BrowserModule} from "@angular/platform-browser";
import {CardListModule} from "../card-list/card-list.module";
import {DeckViewerComponent} from "./deck-viewer.component";
import {DecksProviderService} from "./decks-provider.service";
import {QuickRecapDisplayComponent} from "./quick-recap-display.component";
import {CardDisplayModule} from "../card-display/card-display.module";
import {FormsModule} from "@angular/forms";
import {DeckStatisticsComponent} from "./deck-statistics.component";
import {DeckHistoryComponent} from "./deck-history.component";

@NgModule({
  declarations: [DecksComponent, DeckComponent, DeckViewerComponent, QuickRecapDisplayComponent, DeckStatisticsComponent, DeckHistoryComponent],
  imports: [BrowserModule, DecksRoutingModule, CollectionLoadingModule, CardListModule, CardDisplayModule, FormsModule],
  providers: [DecksProviderService]
})
export class DecksModule {}
