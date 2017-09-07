import {MagicOwnedCard} from "./magic-owned-card";
import {getInternalValue} from "./utils";
import {isUndefined} from "util";

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
}

export class NumericFilter extends CardFilter<number> {
  comparator = ">=";

  check(card: MagicOwnedCard): boolean {
    const internalValue = getInternalValue<number>(card, this._field);

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
    if (this.value === null || this.value === "") {
      return true;
    }

    return getInternalValue<string>(card, this._field).toLowerCase().indexOf(this.value.toLowerCase()) !== -1;
  }
}

export class SelectFilter extends StringFilter {
  values: Map<string, string> = new Map();

  constructor(field: string, displayName: string, values: Map<string, string>, defaultValue: string) {
    super(field, displayName, defaultValue);
    this.values = values;
  }
}

export class StringArrayFilter extends CardFilter<string> {
  check(card: MagicOwnedCard): boolean {
    if (this.value === null || this.value === "") {
      return true;
    }

    const array = getInternalValue<string[]>(card, this._field);
    if (isUndefined(array)) {
      return false;
    }

    for (const s of array) {
      if (s.toLowerCase().indexOf(this.value.toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
  }
}
