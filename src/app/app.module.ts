import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./services/magic-api.service";
import {HttpModule} from "@angular/http";
import {LocalCollectionService} from "./services/local-collection.service";
import {CardListModule} from "./card-list/card-list.module";
import {AppRoutingModule} from "./app-routing.module";
import {CallbackComponent} from "./auth/callback.component";
import {AuthService} from "./auth/auth.service";
import {BackendService} from "./services/backend.service";
import {AuthModule} from "./auth/auth.module";
import {CardsLoaderService} from "./services/cards-loader.service";
import {OnlineCollectionService} from "./services/online-collection.service";
import {CollectionModule} from "./collection/collection.module";
import {PickUsernameComponent} from "./auth/pick-username.component";
import {PageNotFoundComponent} from "./page-not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    PickUsernameComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CardListModule,
    AuthModule,
    CollectionModule,


    AppRoutingModule // must remain last !
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
