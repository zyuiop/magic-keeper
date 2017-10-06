import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {InfoListDisplayComponent} from "./info-list-display.component";
import {GalleryDisplayComponent} from "./gallery-display.component";
import {StandardDisplayComponent} from "./standard-display.component";
import {NgModule} from "@angular/core";
import {CardsDisplayComponent} from "./cards-display.component";
import {SortDisplayComponent} from "./sort-display.component";
import {FiltersDisplayComponent} from "./filters-display.component";
import {ProxyPipe} from "../card-display/proxy.pipe";
import {CardDisplayModule} from "../card-display/card-display.module";
import {FilterDisplayComponent} from "./filter-display.component";
import {CardsPickerComponent} from "./cards-picker-component";

@NgModule({
  declarations: [
    StandardDisplayComponent,
    GalleryDisplayComponent,
    InfoListDisplayComponent,
    CardsDisplayComponent,
    FiltersDisplayComponent,
    FilterDisplayComponent,
    SortDisplayComponent,
    CardsPickerComponent
  ],
  imports: [
    BrowserModule, FormsModule, CardDisplayModule
  ],
  exports: [
    CardsDisplayComponent, CardsPickerComponent
  ]
})
export class CardListModule { }

