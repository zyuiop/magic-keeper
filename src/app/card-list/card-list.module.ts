import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CardQtyDisplayComponent} from "./card-qty-display.component";
import {InfoListDisplayComponent} from "./info-list-display.component";
import {GalleryDisplayComponent} from "./gallery-display.component";
import {StandardDisplayComponent} from "./standard-display.component";
import {NgModule} from "@angular/core";
import {CardSummaryComponent} from "./card-summary.component";
import {ReplaceNl} from "./replacenl.pipe";
import {ReplaceMana} from "./replacemana.pipe";
import {RarityPipe} from "./rarity-label.pipe";
import {CardsDisplayComponent} from "./cards-display.component";

@NgModule({
  declarations: [
    StandardDisplayComponent,
    GalleryDisplayComponent,
    InfoListDisplayComponent,
    CardQtyDisplayComponent,
    CardSummaryComponent,
    CardsDisplayComponent,
    ReplaceNl,
    ReplaceMana,
    RarityPipe,
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  exports: [
    CardSummaryComponent,
    CardsDisplayComponent
  ]
})
export class CardListModule { }

