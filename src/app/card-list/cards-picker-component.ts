import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../services/card-storage";
import {Comparator} from "../types/sort";
import {
  CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter, MultiFieldStringFilter,
  FILTERS
} from "../types/card-filter";
import {CardsDisplayComponent} from "./cards-display.component";

@Component({
  selector: 'app-cards-picker',
  templateUrl: './cards-picker.component.html'
})
/**
 * This class represents a card picker. A card picker is a basic card selector, locked in "gallery" display mode
 * with a source storage ({@field storage}) and a target storage ({@field targetStorage}).
 * When a card is clicked, it is *removed* from the source storage and added in the target storage.
 */
export class CardsPickerComponent extends CardsDisplayComponent {
  @Input() targetStorage: CardStorage;

  onClick(card: MagicOwnedCard) {
    this.targetStorage.addCard(card.card, card.amount > 0 ? 1 : 0, card.amountFoil > 0 ? 1 : 0);
    this.storage.removeCard(card.card, card.amount > 0 ? 1 : 0, card.amountFoil > 0 ? 1 : 0);
  }

  splitCards(card: MagicOwnedCard) {
    if (card.amountFoil > 0 && card.amount > 0) {
      return [new MagicOwnedCard(card.card, card.amount, 0), new MagicOwnedCard(card.card, 0, card.amountFoil)];
    } else {
      return [card];
    }
  }
}
