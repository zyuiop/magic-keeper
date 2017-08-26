import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../card-storage";

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html'
})
export class CardsDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;
  @Input() display = "standard";
}
