import {Component} from '@angular/core';
import {MagicOwnedCard} from "./types/magic-owned-card";
import {MagicLibraryService} from "./magic-library.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "./types/card-filter";
import {DISPLAYS} from "./displays/list-display-components";
import {
  Comparator, NumberCriteria, SortCriteria, StringCriteria, StringNumberCriteria,
  TypeCriteria
} from "./sort/sort";

@Component({
  templateUrl: './card-list.component.html',
  selector: 'app-card-list'
})
export class CardListComponent {
  private _cards: Map<number, MagicOwnedCard>;
  filters: CardFilter<any>[] = [
    new NumericFilter("amount", "Cards amount", 0),
    new NumericFilter("amountFoil", "Foil cards amount", 0),
    new NumericFilter("card.cmc", "Converted mana cost", 0),
    new StringFilter("card.name", "Card name", null),
    new StringFilter("card.setName", "Set name", null),
    new StringFilter("card.rarity", "Rarity", null),
    new StringFilter("card.type", "Type", null),
    new StringArrayFilter("card.colors", "Color", null),
    new SelectFilter("card.layout", "Layout", new Map([["normal", "Normal"], ["aftermath", "Aftermath"]]), null),
  ];
  displays = DISPLAYS;
  display = "standard";
  private _comparator = new Comparator([]);

  constructor(private lib: MagicLibraryService) {
    this._cards = lib.cards;
  }

  get comparator(): Comparator {
    return this._comparator;
  }

  get cards(): MagicOwnedCard[] {
    // TODO optimise : we have to sort all this shit all the time !
    // filter
    const cards = Array.from(this._cards.values());
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

  get total(): number {
    let total = 0;
    this._cards.forEach(value => total += value.totalAmount());
    return total;
  }
}
