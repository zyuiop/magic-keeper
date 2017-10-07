import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CollectionComponent} from "./collection.component";
import {CardListModule} from "../card-list/card-list.module";
import {CardSearcherComponent} from "./card-searcher.component";
import {CloudStatusComponent} from "./cloud-status.component";
import {DisplaySelectorComponent} from "../card-list/display-selector.component";
import {CardDisplayModule} from "../card-display/card-display.module";
import {CollectionRoutingModule} from "./collection-routing.module";
import {CollectionLoadingModule} from "../collection-loading/collection-loading.module";


@NgModule({
  declarations: [
    CollectionComponent,
    CardSearcherComponent,
    CloudStatusComponent
  ],
  imports: [
    BrowserModule, FormsModule, CardListModule, CardDisplayModule, CollectionRoutingModule, CollectionLoadingModule
  ]
})
export class CollectionModule {
}

