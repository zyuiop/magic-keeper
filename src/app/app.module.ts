import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./magic-api.service";
import {HttpModule} from "@angular/http";
import {LocalCollectionService} from "./local-collection.service";
import {CardListModule} from "./card-list/card-list.module";
import {AppRoutingModule} from "./app-routing.module";
import {CallbackComponent} from "./callback/callback.component";
import {AuthService} from "./auth/auth.service";
import {BackendService} from "./backend.service";
import {AuthModule} from "./auth.module";
import {CardsLoaderService} from "./cards-loader.service";
import {OnlineCollectionService} from "./online-collection.service";
import {CollectionModule} from "./collection/collection.module";
import {PickUsernameComponent} from "./auth/pick-username.component";

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    PickUsernameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CardListModule,
    AppRoutingModule,
    AuthModule,
    CollectionModule
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
