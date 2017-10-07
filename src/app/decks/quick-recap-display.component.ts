import {Component, Input} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../types/card-storage";
import {Comparator, NumberCriteria, SortCriteria, TypeCriteria} from "../types/sort";

@Component({
  selector: 'app-quick-recap-display',
  templateUrl: './quick-recap-display.component.html',
  styles: [
    `
      table {
        display: table;
        width: 100%;
        max-width: 100%;
      }

      td {
        padding: 2px;
        vertical-align: top;
      }
    `
  ]
})
export class QuickRecapDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() cardStorage: CardStorage;
  @Input() deckStorage: CardStorage;


  private _comparator = new Comparator([new TypeCriteria(), new NumberCriteria("card.cmc", "osef").reverse()]);

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
            ret.push(new TypeWrapper(currentType, current));
          }
          currentType = card.card.types[0];
          current = [];
        }

        current.push(card);
      });

    if (currentType !== null) {
      ret.push(new TypeWrapper(currentType, current));
    }

    return ret;
  }

}

class TypeWrapper {
  constructor(public type: string, public cards: MagicOwnedCard[]) {}

  get title() {
    const num = this.number;
    let name = this.type;

    // Plural
    if (num > 1) {
      if (name.substr(name.length - 1, 1) === "y" || name.substr(name.length - 1, 1) === "i") {
        name = name.substr(0, name.length - 1) + "ies";
      } else {
        name += "s";
      }
    }

    return name + " (" + num + ")";
  }

  get number() {
    let acc = 0;
    this.cards.forEach(c => acc += c.amountFoil + c.amount);
    return acc;
  }
}
