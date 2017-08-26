import {Component} from '@angular/core';
import {MagicOwnedCard} from "./types/magic-owned-card";
import {MagicLibraryService} from "./magic-library.service";

@Component({
  templateUrl: './card-list.component.html',
  selector: 'app-card-list'
})
export class CardListComponent {
  private _cards: Map<number, MagicOwnedCard>;

  constructor(private lib: MagicLibraryService) {
    this._cards = lib.cards;
  }

  update(card: MagicOwnedCard, foil: boolean, remove: boolean) {
    if (remove) {
      this.lib.removeCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
    } else {
      this.lib.addCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
    }
  }

  get cards(): MagicOwnedCard[] {
    return Array.from(this._cards.values()).sort((oc1, oc2) => {
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
