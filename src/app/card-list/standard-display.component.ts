import {CardStorage} from "../card-storage";
import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";

@Component({
  selector: 'app-standard-display',
  templateUrl: './standard-display.component.html'
})
export class StandardDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;
}
