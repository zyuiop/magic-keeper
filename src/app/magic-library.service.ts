import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "./types/magic-card";

@Injectable()
export class MagicLibraryService {
  private _cards: Map<number, MagicOwnedCard> = new Map();

  constructor(private api: MagicApiService) {
    this.load();
  }

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
    return this._cards;
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number) {
    if (card === null) {
      throw new Error("Tried to remove null card");
    }
    if (card.multiverseid === null) {
      throw new Error("Tried to remove invalid card");
    }

    if (this._cards.has(card.multiverseid)) {
      this._cards.get(card.multiverseid).increaseFoil(- amountFoil);
      this._cards.get(card.multiverseid).increase(- amount);

      if (this._cards.get(card.multiverseid).totalAmount() <= 0) {
        this._cards.delete(card.multiverseid);
      }
    } else {
      throw new Error("This card is not in the deck !");
    }
    this.save();
  }

  /**
   * Merges the library map with some other map
   * @param {Map<number, MagicOwnedCard>} otherMap
   */
  private merge(otherMap: Map<number, MagicOwnedCard>): void {
    otherMap.forEach((value: MagicOwnedCard, key: number) => {
      this.putCard(value);
    });
  }

  private putCard(card: MagicOwnedCard): void {
    if (card.amount <= 0 && card.amountFoil <= 0) {
      return;
    }

    if (this._cards.has(card.card.multiverseid)) {
      this._cards.get(card.card.multiverseid).increaseFoil(card.amountFoil);
      this._cards.get(card.card.multiverseid).increase(card.amount);
    } else {
      this._cards.set(card.card.multiverseid, card);
    }
  }

  private save(): void {
    const toStore: MagicReducedOwnedCard[] = [];

    this._cards.forEach(card => {
      toStore.push(new MagicReducedOwnedCard(card));
    });

    localStorage.setItem("cards", JSON.stringify(toStore));
  }

  private load(): void {
    const stored = localStorage.getItem("cards");

    console.log("Loading cards...");

    if (stored !== null) {
      let counter = 0;
      const storedCards = JSON.parse(stored) as MagicReducedOwnedCard[];
      let stack: Map<number, MagicReducedOwnedCard> = new Map();

      while (storedCards.length > 0) {
        // add 100 cards in the "stack"
        while (storedCards.length > 0 && stack.size < 100) {
          const cur = storedCards.pop();
          stack.set(cur.cardId, cur);
        }

        // process the "stack"
        const cid = ++counter;
        console.log("Sending request " + cid + " with " + stack.size + " _cards");
        console.log(stack);
        this.api.getCards(stack).then(res => {
          console.log("Reply for request " + cid + " with " + res.size + " _cards");
          console.log(res);
          this.merge(res);
        });

        stack = new Map();
      }
    }
  }
}
