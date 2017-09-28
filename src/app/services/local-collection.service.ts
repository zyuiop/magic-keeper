import {Injectable} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";
import {MagicCard} from "../types/magic-card";
import {CardStorage} from "./card-storage";
import {CardProvider} from "./card-provider";
import {CardsLoaderService, PartialData} from "./cards-loader.service";

@Injectable()
export class LocalCollectionService {
  constructor(private loader: CardsLoaderService) {}

  load(): LocalStorage {
    return new LocalStorage(this.loader.loadString(localStorage.getItem("cards")));
  }

  replace(cards: string): void {
    localStorage.setItem("cards", cards);
  }
}

class LocalStorage implements CardStorage, CardProvider {
  constructor(private _cards: PartialData<Map<number, MagicOwnedCard>>) {}

  /**
   * Add a given card to the library, in a given quantity
   * @param {MagicCard} card the card to add
   * @param {number} amount the quantity of the card to add
   * @param {number} amountFoil the quantity of the premium version (foil) of the card to add
   */
  addCard(card: MagicCard, amount: number, amountFoil: number) {
    if (card === null) {
      throw new Error("Tried to add null card");
    }
    if (card.multiverseid === null) {
      throw new Error("Tried to add invalid card");
    }

    this.putCard(new MagicOwnedCard(card, amount, amountFoil));
    this.save();
  }

  get cards(): Map<number, MagicOwnedCard> {
    return this._cards.getData();
  }

  getCards(): MagicOwnedCard[] {
    return Array.from(this.cards.values());
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number) {
    if (card === null) {
      throw new Error("Tried to remove null card");
    }
    if (card.multiverseid === null) {
      throw new Error("Tried to remove invalid card");
    }

    if (this.cards.has(card.multiverseid)) {
      this.cards.get(card.multiverseid).increaseFoil(- amountFoil);
      this.cards.get(card.multiverseid).increase(- amount);

      if (this.cards.get(card.multiverseid).totalAmount() <= 0) {
        this.cards.delete(card.multiverseid);
      }
    } else {
      throw new Error("This card is not in the deck !");
    }
    this.save();
  }

  private putCard(card: MagicOwnedCard): void {
    if (card.amount <= 0 && card.amountFoil <= 0) {
      return;
    }

    if (this.cards.has(card.card.multiverseid)) {
      this.cards.get(card.card.multiverseid).increaseFoil(card.amountFoil);
      this.cards.get(card.card.multiverseid).increase(card.amount);
    } else {
      this.cards.set(card.card.multiverseid, card);
    }
  }

  toString(): string {
    const toStore: string[] = [];

    this.cards.forEach(card => {
      toStore.push(card.toString());
    });

    return toStore.join(";");
  }

  private save(): void {
    localStorage.setItem("cards", this.toString());
  }

  searchCard(set: string, number: string): Promise<MagicCard> {
    const corresp = Array.from(this.cards.values())
      .filter(c => c.card.set === set && c.card.number.toLowerCase() === number.toLowerCase());
    return Promise.resolve((corresp && corresp.length > 0 ? corresp[0].card : null));
  }

  allowUpdate(): boolean {
    return this.finishedLoading(); // local storage can always be written
  }

  finishedLoading(): boolean {
    return this._cards.isComplete();
  }
}
