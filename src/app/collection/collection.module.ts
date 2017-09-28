import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CollectionLoadingComponent} from "./collection-loading.component";
import {CollectionComponent} from "./collection.component";
import {CardListModule} from "../card-list/card-list.module";
import {LocalCollectionService} from "../local-collection.service";
import {OnlineCollectionService} from "../online-collection.service";
import {CardSearcherComponent} from "./card-searcher.component";
import {CloudStatusComponent} from "./cloud-status.component";
import {BackendService} from "../backend.service";
import {MagicApiService} from "../magic-api.service";
import {DisplaySelectorComponent} from "./display-selector.component";
import {PublicCollectionComponent} from "./public-collection.component";
import {CardDisplayModule} from "../card-display/card-display.module";


@NgModule({
  declarations: [
    CollectionLoadingComponent,
    CollectionComponent,
    CardSearcherComponent,
    CloudStatusComponent,
    DisplaySelectorComponent,
    PublicCollectionComponent
  ],
  imports: [
    BrowserModule, FormsModule, CardListModule, CardDisplayModule
  ],
  exports: [
    CollectionComponent, PublicCollectionComponent
  ],
  providers: [
    LocalCollectionService,
    OnlineCollectionService,
    BackendService,
    MagicApiService
  ]
})
export class CollectionModule { }

