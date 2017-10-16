import {CardStorage} from "./card-storage";
import {PartialData} from "../services/cards-loader.service";
import {MagicOwnedCard} from "./magic-owned-card";
import {MagicCard} from "./magic-card";

export class FixedCardStorage implements CardStorage {
  constructor(private cards: PartialData<Map<number, MagicOwnedCard>>) {};

  addCard(card: MagicCard, amount: number, amountFoil: number): void {
    throw new Error("Method not implemented.");
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number): void {
    throw new Error("Method not implemented.");
  }

  lastChange(): Date {
    throw new Error("Method not implemented.");
  }

  addChangeListener(listener: Function) {
    throw new Error("Method not implemented.");
  }

  getCard(card: MagicCard): MagicOwnedCard {
    return this.cards.getData().get(card.multiverseid);
  }

  allowUpdate(): boolean {
    return false;
  }

  getCards(): MagicOwnedCard[] {
    return Array.from(this.cards.getData().values());
  }

  finishedLoading(): boolean {
    return this.cards.isComplete();
  }
}
