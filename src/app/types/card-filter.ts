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

    if (isUndefined(internalValue)) {
      return false;
    }

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

    const internal = getInternalValue<string>(card, this._field);

    if (isUndefined(internal) || internal === null) {
      return false;
    }

    return internal.toLowerCase().indexOf(this.value.toLowerCase()) !== -1;
  }
}

export class SelectFilter extends StringFilter {
  values: Map<string, string> = new Map();

  constructor(field: string, displayName: string, values: Map<string, string>, defaultValue: string) {
    super(field, displayName, defaultValue);
    this.values = values;
  }
}

export class MultiFieldStringFilter extends CardFilter<string> {
  private fields: string[];

  constructor(displayName: string, defaultValue: string, fields: string[]) {
    super(null, displayName, defaultValue);
    this.fields = fields;
  }

  check(card: MagicOwnedCard): boolean {
    if (this.value === null || this.value === "") {
      return true;
    }

    for (const field of this.fields) {
      const internal = getInternalValue<string>(card, field);

      if (isUndefined(internal) || internal === null) {
        continue;
      }

      if (internal.toLowerCase().indexOf(this.value.toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
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

export const FILTERS: CardFilter<any>[] = [
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
