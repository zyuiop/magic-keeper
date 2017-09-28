import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../services/card-storage";
import {Comparator} from "../types/sort";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter, MultiFieldStringFilter} from "../types/card-filter";

@Component({
  selector: 'app-cards-display',
  templateUrl: './cards-display.component.html'
})
export class CardsDisplayComponent {
  @Input() storage: CardStorage;
  @Input() display = "standard";

  private _comparator = new Comparator([]);
  filters: CardFilter<any>[] = [
    new NumericFilter("amount", "Cards amount", 0),
    new NumericFilter("amountFoil", "Foil cards amount", 0),
    new NumericFilter("card.cmc", "Converted mana cost", 0),
    new MultiFieldStringFilter("General search", null, ["card.name", "card.text", "card.flavor", "card.type"]),
    new StringFilter("card.name", "Card name", null),
    new StringFilter("card.text", "Card text", null),
    new StringFilter("card.flavor", "Card flavortext", null),
    new StringFilter("card.setName", "Set name", null),
    new StringFilter("card.rarity", "Rarity", null),
    new StringFilter("card.type", "Type", null),
    new StringArrayFilter("card.colors", "Color", null),
    new SelectFilter("card.layout", "Layout", new Map([["normal", "Normal"], ["aftermath", "Aftermath"]]), null),
  ];

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
