import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import {MagicApiService} from "./magic-api.service";
import {CardSearcherComponent} from "./card-searcher.component";
import {HttpModule} from "@angular/http";
import {CardDisplayComponent} from "./parts/card-display.component";
import {ReplaceNl} from "./pipes/replacenl.pipe";
import {ReplaceMana} from "./pipes/replacemana.pipe";
import {MagicLibraryService} from "./magic-library.service";
import {CardSummaryComponent} from "./parts/card-summary.component";
import {OwnedCardDisplayComponent} from "./parts/owned-card-display.component";
import {CardListComponent} from "./card-list.component";

@NgModule({
  declarations: [
    AppComponent, CardSearcherComponent, CardDisplayComponent, CardSummaryComponent, OwnedCardDisplayComponent, CardListComponent, ReplaceNl, ReplaceMana
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
