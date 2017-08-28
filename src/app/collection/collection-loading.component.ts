import {Component, Input} from "@angular/core";

@Component({
  templateUrl: './collection-loading.component.html',
  selector: 'app-collection-loading'
})
export class CollectionLoadingComponent {
  @Input() error: string;
}
