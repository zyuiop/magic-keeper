import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "./types/magic-card";
import {CardStorage} from "./card-storage";
import {CardProvider} from "./card-provider";

@Injectable()
export class LocalCollectionService implements CardStorage, CardProvider {
  private _cards: Map<number, MagicOwnedCard> = new Map();
  private _lastGenString: string = null;
  private _hasChanged = true;

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

  getCards(): MagicOwnedCard[] {
    return Array.from(this._cards.values());
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

    this._hasChanged = true;
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

    this._hasChanged = true;
  }

  private generateString(): void {
    const toStore: string[] = [];

    this._cards.forEach(card => {
      toStore.push(card.toString());
    });

    this._lastGenString = toStore.join(";");
    this._hasChanged = false;
  }

  private toString(): string {
    if (this._hasChanged) {
      this.generateString();
    }
    return this._lastGenString;
  }

  private save(): void {
    localStorage.setItem("cards", this.toString());
  }

  private loadString(stored: string): void {
    if (stored !== null) {
      let counter = 0;
      const storedCards = stored.split(";").map(MagicReducedOwnedCard.fromString);

      while (storedCards.length > 0) {
        const stack: Map<number, MagicReducedOwnedCard> = new Map();
        let stackSize = 0;
        // add 100 cards in the "stack"
        while (storedCards.length > 0 && stackSize < 100) {
          const cur = storedCards.pop();
          stack.set(cur.cardId, cur);
          stackSize++;
          if (cur.double) {
            stackSize++; // double cards
          }
        }

        // process the "stack"
        const cid = ++counter;
        console.log("Sending request " + cid + " with " + stack.size + " cards");
        console.log(stack);
        this.api.getCards(stack).then(res => {
          console.log("Reply for request " + cid + " with " + res.size + " cards");
          console.log(res);
          this.merge(res);
        });
      }
    }
  }

  private load(): void {
    this.loadString(localStorage.getItem("cards"));
  }

  searchCard(set: string, number: string): Promise<MagicCard> {
    const corresp = Array.from(this._cards.values()).filter(c => c.card.set === set && c.card.number.toLowerCase() === number.toLowerCase());
    return Promise.resolve((corresp && corresp.length > 0 ? corresp[0].card : null));
  }

  allowUpdate(): boolean {
    return true; // local storage can always be written
  }
}
