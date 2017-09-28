import {NgModule} from "@angular/core";
import {CollectionLoadingComponent} from "./collection-loading.component";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
  declarations: [
    CollectionLoadingComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CollectionLoadingComponent
  ]
})
export class CollectionLoadingModule { }

