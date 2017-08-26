import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./magic-api.service";
import {CardSearcherComponent} from "./card-searcher.component";
import {HttpModule} from "@angular/http";
import {MagicLibraryService} from "./magic-library.service";
import {CardListComponent} from "./card-list.component";
import {FilterDisplayComponent} from "./parts/filter-display.component";
import {SortDisplayComponent} from "./parts/sort-display.component";
import {CardListModule} from "./card-list/card-list.module";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    CardSearcherComponent,
    CardListComponent,
    FilterDisplayComponent,
    SortDisplayComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CardListModule,
    AppRoutingModule
  ],
  providers: [
    MagicApiService,
    MagicLibraryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
