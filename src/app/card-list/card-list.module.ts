import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {InfoListDisplayComponent} from "./info-list-display.component";
import {GalleryDisplayComponent} from "./gallery-display.component";
import {StandardDisplayComponent} from "./standard-display.component";
import {NgModule} from "@angular/core";
import {CardsDisplayComponent} from "./cards-display.component";
import {SortDisplayComponent} from "./sort-display.component";
import {FilterDisplayComponent} from "./filter-display.component";
import {ProxyPipe} from "../card-display/proxy.pipe";
import {CardDisplayModule} from "../card-display/card-display.module";

@NgModule({
  declarations: [
    StandardDisplayComponent,
    GalleryDisplayComponent,
    InfoListDisplayComponent,
    CardsDisplayComponent,
    FilterDisplayComponent,
    SortDisplayComponent,
  ],
  imports: [
    BrowserModule, FormsModule, CardDisplayModule
  ],
  exports: [
    CardsDisplayComponent, ProxyPipe
  ]
})
export class CardListModule { }

