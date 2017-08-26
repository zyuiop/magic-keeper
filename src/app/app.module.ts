import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./magic-api.service";
import {CardSearcherComponent} from "./card-searcher.component";
import {HttpModule} from "@angular/http";
import {ReplaceNl} from "./pipes/replacenl.pipe";
import {ReplaceMana} from "./pipes/replacemana.pipe";
import {MagicLibraryService} from "./magic-library.service";
import {CardSummaryComponent} from "./parts/card-summary.component";
import {CardListComponent} from "./card-list.component";
import {RarityPipe} from "./pipes/rarity-label.pipe";
import {FilterDisplayComponent} from "./parts/filter-display.component";
import {
  CardQtyDisplayComponent,
  GalleryDisplayComponent, InfoListDisplayComponent,
  StandardDisplayComponent
} from "./displays/list-display-components";
import {SortDisplayComponent} from "./parts/sort-display.component";

@NgModule({
  declarations: [
    AppComponent, CardSearcherComponent, CardSummaryComponent, CardListComponent, ReplaceNl,
    ReplaceMana, RarityPipe, FilterDisplayComponent, StandardDisplayComponent, GalleryDisplayComponent,
    InfoListDisplayComponent, SortDisplayComponent, CardQtyDisplayComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule
  ],
  providers: [
    MagicApiService, MagicLibraryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
