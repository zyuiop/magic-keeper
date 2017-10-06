import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../types/card-storage";
import {Comparator, NumberCriteria, SortCriteria, TypeCriteria} from "../types/sort";

@Component({
  selector: 'app-quick-recap-display',
  templateUrl: './quick-recap-display.component.html'
})
export class QuickRecapDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() cardStorage: CardStorage;
  @Input() deckStorage: CardStorage;


  private _comparator = new Comparator([new TypeCriteria(), new NumberCriteria("cmc", "osef").reverse()]);

  removeOne(card: MagicOwnedCard, foil: boolean) {
    this.deckStorage.removeCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
    this.cardStorage.addCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
  }

  get sorted(): TypeWrapper[] {
    const ret: TypeWrapper[] = [];
    let current: MagicOwnedCard[] = [];
    let currentType = null;

    this.cards
      .sort((c1, c2) => this._comparator.compare(c1, c2))
      .forEach(card => {
        if (card.card.types[0] !== currentType) {
          if (currentType != null) {
            ret.push({cards : current, type : currentType});
          }
          currentType = card.card.types[0];
          current = [];
        }

        current.push(card);
      });

    if (currentType !== null) {
      ret.push({cards : current, type : currentType});
    }

    return ret;
  }
}

class TypeWrapper {
  type: string;
  cards: MagicOwnedCard[];
}
