import {MagicCard} from "./magic-card";

export class MagicOwnedCard {
  card: MagicCard;
  private _amount: number;
  private _amountFoil: number;

  get amount(): number {
    return this._amount;
  }

  get amountFoil(): number {
    return this._amountFoil;
  }

  totalAmount(): number {
    return this._amountFoil + this._amount;
  }

  increase(amt: number): void {
    if (this._amount + amt < 0) {
      throw new Error("Cannot assign negative value (current : " + this._amount + ", added : " + amt + ")");
    }
    this._amount += amt;
  }

  increaseFoil(amt: number): void {
    if (this._amountFoil + amt < 0) {
      throw new Error("Cannot assign negative foil value (current : " + this._amountFoil + ", added : " + amt + ")");
    }
    this._amountFoil += amt;
  }

  constructor(card: MagicCard, amount: number, amountFoil: number) {
    this.card = card;
    this._amount = Math.max(0, amount);
    this._amountFoil = Math.max(0, amountFoil);
  }

  toString(): string {
    return this.card.multiverseid + (this.card.layout !== "normal" ? "+" : "") + ":" + this._amount + "," + this._amountFoil;
  }
}

export class MagicReducedOwnedCard {
  cardId: number; // gatherer id
  amount: number;
  amountFoil: number;
  double = false;

  constructor(cardId: number, amount: number, amountFoil: number) {
    this.cardId = cardId;
    this.amount = amount;
    this.amountFoil = amountFoil;
  }

  static fromString(source: string): MagicReducedOwnedCard {
    const parts = source.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid source data " + source);
    }

    const amts = parts[1].split(",");
    if (amts.length !== 2) {
      throw new Error("Invalid source data " + source);
    }

    if (isNaN(+amts[0]) || isNaN(+amts[0])) {
      throw new Error("Invalid source data " + source);
    }

    if (parts[0].slice(-1) === "+") {
      if (isNaN(+parts[0].slice(0, -1))) {
        throw new Error("Invalid source data " + source);
      }

      const card = new MagicReducedOwnedCard(+parts[0].slice(0, -1), +amts[0], +amts[1]);
      card.double = true;
      return card;
    }

    if (isNaN(+parts[0])) {
      throw new Error("Invalid source data " + source);
    }
    return new MagicReducedOwnedCard(+parts[0], +amts[0], +amts[1]);
  }
}
