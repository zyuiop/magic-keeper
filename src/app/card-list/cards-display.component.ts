import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../services/card-storage";
import {Comparator} from "../types/sort";
import {
  CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter, MultiFieldStringFilter,
  FILTERS
} from "../types/card-filter";

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html'
})
export class CardsDisplayComponent {
  @Input() storage: CardStorage;
  @Input() display = "standard";

  private _comparator = new Comparator([]);
  filters = FILTERS;

  get comparator(): Comparator {
    return this._comparator;
  }

  get cards(): MagicOwnedCard[] {
    const cards = this.storage.getCards();
    return cards
      .filter(card => {
        for (const filter of this.filters) {
          if (!filter.check(card)) {
            return false;
          }
        }
        return true;
      })
      .sort((c1, c2) => this._comparator.compare(c1, c2));
  }

  get matching(): number {
    let total = 0;
    for (const obj of this.cards) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }
}
