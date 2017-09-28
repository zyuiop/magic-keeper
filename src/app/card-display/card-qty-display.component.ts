import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../services/card-storage";

@Component({
  selector: 'app-card-qty-display',
  templateUrl: './card-qty-display.component.html'
})
export class CardQtyDisplayComponent {
  @Input() card: MagicOwnedCard;
  @Input() storage: CardStorage;
  @Input() foil: boolean;

  update(remove: boolean) {
    if (remove) {
      this.storage.removeCard(this.card.card, this.foil ? 0 : 1, this.foil ? 1 : 0);
    } else {
      this.storage.addCard(this.card.card, this.foil ? 0 : 1, this.foil ? 1 : 0);
    }
  }

  get amount(): number {
    return this.foil ? this.card.amountFoil : this.card.amount;
  }
}
