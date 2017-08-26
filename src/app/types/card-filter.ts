import {MagicOwnedCard} from "./magic-owned-card";

export abstract class CardFilter<T>  {
  protected _field: string;
  displayName: string;
  value: T;

  constructor(field: string, displayName: string, defaultValue: T = null) {
    this._field = field;
    this.value = defaultValue;
    this.displayName = displayName;
  }

  abstract check(card: MagicOwnedCard): boolean;

  protected getInternalValue(card: any, field: string): T {
    const index = field.indexOf(".");
    if (index !== -1) {
      return this.getInternalValue(card[field.substr(0, index)], field.substr(index + 1)) as T;
    }
    return card[field] as T;
  }
}

export class NumericFilter extends CardFilter<number> {
  comparator = ">=";

  check(card: MagicOwnedCard): boolean {
    const internalValue = this.getInternalValue(card, this._field);

    if (this.comparator === null || this.value <= 0 || this.value === null || isNaN(this.value)) {
      return true;
    }

    console.log("Filtering " + card.card.name + " on field " + this._field + " -> " + card[this._field]);

    switch (this.comparator) {
      case ">":
        return internalValue > this.value;
      case ">=":
        return internalValue >= this.value;
      case "<":
        return internalValue < this.value;
      case "<=":
        return internalValue <= this.value;
      case "==":
        return internalValue === this.value;
      case "!=":
        return internalValue !== this.value;
    }
  }
}

export class StringFilter extends CardFilter<string> {
  check(card: MagicOwnedCard): boolean {
    if (this.value === null) {
      return true;
    }

    return this.getInternalValue(card, this._field).indexOf(this.value) !== -1;
  }
}
