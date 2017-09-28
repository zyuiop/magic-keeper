import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CollectionComponent} from "./collection.component";
import {CardListModule} from "../card-list/card-list.module";
import {LocalCollectionService} from "../services/local-collection.service";
import {OnlineCollectionService} from "../services/online-collection.service";
import {CardSearcherComponent} from "./card-searcher.component";
import {CloudStatusComponent} from "./cloud-status.component";
import {BackendService} from "../services/backend.service";
import {MagicApiService} from "../services/magic-api.service";
import {DisplaySelectorComponent} from "./display-selector.component";
import {CardDisplayModule} from "../card-display/card-display.module";
import {CollectionRoutingModule} from "./collection-routing.module";
import {CollectionLoadingModule} from "../collection-loading/collection-loading.module";


@NgModule({
  declarations: [
    CollectionComponent,
    CardSearcherComponent,
    CloudStatusComponent,
    DisplaySelectorComponent,
  ],
  imports: [
    BrowserModule, FormsModule, CardListModule, CardDisplayModule, CollectionRoutingModule, CollectionLoadingModule
  ],
  providers: [
    LocalCollectionService,
    OnlineCollectionService,
    BackendService,
    MagicApiService
  ]
})
export class CollectionModule { }

