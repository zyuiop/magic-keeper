import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CardQtyDisplayComponent} from "./card-qty-display.component";
import {NgModule} from "@angular/core";
import {CardSummaryComponent} from "./card-summary.component";
import {ReplaceNl} from "./replacenl.pipe";
import {ReplaceManaPipe} from "./replacemana.pipe";
import {RarityPipe} from "./rarity-label.pipe";
import {ProxyPipe} from "./proxy.pipe";

@NgModule({
  declarations: [
    CardQtyDisplayComponent,
    CardSummaryComponent,
    ReplaceNl,
    ReplaceManaPipe,
    RarityPipe,
    ProxyPipe
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  exports: [
    CardSummaryComponent,
    CardQtyDisplayComponent,
    ProxyPipe,
    ReplaceManaPipe,
    RarityPipe
  ]
})
export class CardDisplayModule { }

