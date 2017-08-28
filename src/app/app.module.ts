import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./magic-api.service";
import {CardSearcherComponent} from "./parts/card-searcher.component";
import {HttpModule} from "@angular/http";
import {LocalCollectionService} from "./local-collection.service";
import {CollectionComponent} from "./collection.component";
import {FilterDisplayComponent} from "./parts/filter-display.component";
import {SortDisplayComponent} from "./parts/sort-display.component";
import {CardListModule} from "./card-list/card-list.module";
import {AppRoutingModule} from "./app-routing.module";
import {CallbackComponent} from "./callback/callback.component";
import {AuthService} from "./auth/auth.service";
import {BackendService} from "./backend.service";
import {BackendTestComponent} from "./parts/cloud-status.component";
import {AuthModule} from "./auth.module";
import {CardsLoaderService} from "./cards-loader.service";
import {OnlineCollectionService} from "./online-collection.service";

@NgModule({
  declarations: [
    AppComponent,
    CardSearcherComponent,
    CollectionComponent,
    FilterDisplayComponent,
    SortDisplayComponent,
    CallbackComponent,

    BackendTestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CardListModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    MagicApiService,
    LocalCollectionService,
    AuthService,
    BackendService,
    CardsLoaderService,
    OnlineCollectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
