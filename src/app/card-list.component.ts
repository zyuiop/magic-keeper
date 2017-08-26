import {Component} from '@angular/core';
import {MagicOwnedCard} from "./types/magic-owned-card";
import {MagicLibraryService} from "./magic-library.service";
import {CardFilter, NumericFilter, StringFilter} from "./types/card-filter";
import {DISPLAYS} from "./displays/list-display-components";

@Component({
  templateUrl: './card-list.component.html',
  selector: 'app-card-list'
})
export class CardListComponent {
  private _cards: Map<number, MagicOwnedCard>;
  filters: CardFilter<any>[] = [
    new NumericFilter("amount", "Nombre de cartes", 0),
    new NumericFilter("amountFoil", "Nombre de cartes foil", 0),
    new NumericFilter("card.cmc", "Coût de mana", 0),
    new StringFilter("card.name", "Nom de la carte", null),
    new StringFilter("card.setName", "Nom du set", null),
    new StringFilter("card.rarity", "Rareté", null)
  ];
  displays = DISPLAYS;
  display = "standard";

  constructor(private lib: MagicLibraryService) {
    this._cards = lib.cards;
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
      .sort((oc1, oc2) => {
        const c1 = oc1.card, c2 = oc2.card;
        if (c1.types[0] !== c2.types[0]) {
          return c1.types[0].localeCompare(c2.types[0]); // easier for now
        }

        if (c1.cmc !== c2.cmc) {
          return c1.cmc - c2.cmc;
        }

        if (c1.number !== c2.number) {
          return +c1.number - +c2.number;
        }

        return c1.multiverseid - c2.multiverseid;
      });
  }

  get total(): number {
    let total = 0;
    this._cards.forEach(value => total += value.totalAmount());
    return total;
  }
}
