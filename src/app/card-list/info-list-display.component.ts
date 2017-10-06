import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../types/card-storage";

@Component({
  selector: 'app-info-list-display',
  templateUrl: './info-list-display.component.html'
})
export class InfoListDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;
}
