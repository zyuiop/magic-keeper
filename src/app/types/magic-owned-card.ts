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
      throw new Error("Cannot assign negative value");
    }
    this._amount += amt;
  }

  increaseFoil(amt: number): void {
    if (this._amountFoil + amt < 0) {
      throw new Error("Cannot assign negative value");
    }
    this._amountFoil += amt;
  }

  constructor(card: MagicCard, amount: number, amountFoil: number) {
    this.card = card;
    this._amount = Math.max(0, amount);
    this._amountFoil = Math.max(0, amountFoil);
  }

  toString(): string {
    return this.card.multiverseid + ":" + this._amount + "," + this._amountFoil;
  }
}

export class MagicReducedOwnedCard {
  cardId: number; // gatherer id
  amount: number;
  amountFoil: number;

  constructor(cardId: number, amount: number, amountFoil: number) {
    this.cardId = cardId;
    this.amount = amount;
    this.amountFoil = amountFoil;
  }

  static fromString(source: string): MagicReducedOwnedCard {
    const parts = source.split(":");
    const amts = parts[1].split(",");

    return new MagicReducedOwnedCard(+parts[0], +amts[0], +amts[1]);
  }
}
