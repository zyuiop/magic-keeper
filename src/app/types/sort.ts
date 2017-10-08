import {MagicOwnedCard} from "./magic-owned-card";
import {getInternalValue} from "./utils";
import {isNull, isNullOrUndefined, isUndefined} from "util";

export interface SortCriteria {
  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number;

  display(): string;
}

export class ReverseCriteria implements SortCriteria {
  sourceCriteria: SortCriteria;

  constructor(sourceCriteria: SortCriteria) {
    this.sourceCriteria = sourceCriteria;
  }

  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    return this.sourceCriteria.compare(card2, card1);
  }

  display(): string {
    return "- " + this.sourceCriteria.display();
  }
}

export class Comparator {
  criterias: SortCriteria[];

  constructor(criterias: SortCriteria[]) {
    this.criterias = criterias;
  }

  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    let value = 0, i = 0;
    while (value === 0 && i < this.criterias.length) {
      const criteria = this.criterias[i ++];
      value = criteria.compare(card1, card2);
    }

    return value;
  }

  reverseCriteria(criteria: SortCriteria): void {
    const newCriteria = criteria instanceof ReverseCriteria ? (criteria as ReverseCriteria).sourceCriteria :
      new ReverseCriteria(criteria);

    const index = this.criterias.indexOf(criteria);
    this.criterias[index] = newCriteria;
  }

  removeCriteria(criteria: SortCriteria): void {
    const index = this.criterias.indexOf(criteria);
    this.criterias.splice(index, 1);
  }

  addCriteria(criteria: SortCriteria): void {
    this.criterias.push(criteria);
  }

  hasCriteria(criteria: SortCriteria): boolean {
    return this.criterias.indexOf(criteria) !== -1;
  }
}

abstract class FieldCriteria implements SortCriteria {
  protected _field: string;
  protected _display: string;

  constructor(field: string, display: string) {
    this._field = field;
    this._display = display;
  }

  abstract compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number;

  reverse(): SortCriteria {
    return new ReverseCriteria(this);
  }

  display(): string {
    return this._display;
  }
}

export class StringCriteria extends FieldCriteria {
  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    return getInternalValue<string>(card1, this._field).localeCompare(getInternalValue<string>(card2, this._field));
  }
}

export class TypeCriteria implements SortCriteria {
  constructor(private compareList?: string[]) {}

  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    if (isNullOrUndefined(this.compareList)) {
      return card1.card.types[0].localeCompare(card2.card.types[0]);
    } else {
      const index1 = this.compareList.indexOf(card1.card.types[0]);
      const index2 = this.compareList.indexOf(card2.card.types[0]);

      if (index1 === index2 && index1 === -1) {
        return card1.card.types[0].localeCompare(card2.card.types[0]);
      }

      return index1 - index2;
    }
  }

  display(): string {
    return "Primary Type";
  }
}
export class RarityCriteria implements SortCriteria {
  private static rarityScore(rar: string): number {
    switch (rar) {
      case "Special":
        return 10;
      case "Mythic Rare":
        return 5;
      case "Rare":
        return 4;
      case "Uncommon":
        return 3;
      case "Common":
        return 2;
      case "Basic Land":
        return 1;
      default:
        return 0;
    }
  }

  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    const rar1 = card1.card.rarity, rar2 = card2.card.rarity;
    return RarityCriteria.rarityScore(rar1) - RarityCriteria.rarityScore(rar2);
  }

  display(): string {
    return "Rarity";
  }
}

export class NumberCriteria extends FieldCriteria {
  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    return getInternalValue<number>(card1, this._field) - getInternalValue<number>(card2, this._field);
  }
}

export class StringNumberCriteria extends FieldCriteria {
  compare(card1: MagicOwnedCard, card2: MagicOwnedCard): number {
    const c1val = +getInternalValue<string>(card1, this._field).replace(/[^0-9]/g, '');
    const c2val = +getInternalValue<string>(card2, this._field).replace(/[^0-9]/g, '');
    return c1val - c2val;
  }
}

export const COMPARATORS: SortCriteria[] = [
  new NumberCriteria("amount", "Amount"),
  new NumberCriteria("amountFoil", "Amount (foil)"),
  new StringCriteria("card.name", "Name"),
  new NumberCriteria("card.cmc", "CMC"),
  new TypeCriteria(),
  new StringCriteria("card.name", "Type"),
  new StringNumberCriteria("card.number", "Number"),
  new StringCriteria("card.setName", "Set Name"),
  new RarityCriteria(),
  new NumberCriteria("card.multiverseid", "MultiverseID"),
  new NumberCriteria("card.power", "Power"),
  new NumberCriteria("card.toughness", "Toughness")
];

