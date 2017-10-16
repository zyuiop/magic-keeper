import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "../types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "../types/magic-card";
import {CardStorage} from "../types/card-storage";
import {CardProvider} from "../types/card-provider";
import {Observable} from "rxjs/Observable";
import {startTimeRange} from "@angular/core/src/profile/wtf_impl";

export interface PartialData<T> {
  getData(): T;
  isComplete(): boolean;

  onComplete(onComplete: ((result: T) => void)): void;
}

class PartialDataImpl<T> implements PartialData<T> {
  private _finished: boolean;
  private _data: T;
  private _completeListeners: ((res: T) => void)[] = [];

  constructor(_data: T) {
    this._data = _data;
  }

  getData(): T {
    return this._data;
  }

  onComplete(onComplete: (result: T) => void): void {
    this._completeListeners.push(onComplete);

    if (this.isComplete()) {
      onComplete(this._data);
    }
  }

  isComplete(): boolean {
    return this._finished;
  }

  finish(): void {
    this._finished = true;
    this._completeListeners.forEach(listener => listener(this._data));
  }
}

class CachedCard {
  card: MagicCard;
  usages: number;
}

@Injectable()
export class CardsLoaderService {

  constructor(private api: MagicApiService) {
  }

  private getCached(card: number): MagicCard {
    const item = localStorage.getItem("card.cache." + card);
    return item === null ? null : JSON.parse(item).card;
  }

  private cacheCard(card: MagicCard) {
    const item = localStorage.getItem("card.cache." + card.multiverseid);
    let cached: CachedCard;
    if (item != null) {
      cached = JSON.parse(item);
      cached.usages ++;
    } else {
      cached = {card: card, usages: 1};
    }
    localStorage.setItem("card.cache." + card.multiverseid, JSON.stringify(cached));
  }

  private merge(map: Map<number, MagicOwnedCard>, otherMap: Map<number, MagicOwnedCard>): void {
    otherMap.forEach((card: MagicOwnedCard, key: number) => {
      this.cacheCard(card.card);

      if (card.amount <= 0 && card.amountFoil <= 0) {
        return;
      }

      if (map.has(card.card.multiverseid)) {
        map.get(card.card.multiverseid).increaseFoil(card.amountFoil);
        map.get(card.card.multiverseid).increase(card.amount);
      } else {
        map.set(card.card.multiverseid, card);
      }
    });
  }

  loadFromStorage(storageKey: string): PartialData<Map<number, MagicOwnedCard>> {
    return this.loadString(localStorage.getItem(storageKey));
  }

  loadFromReducedArray(storedCards: MagicReducedOwnedCard[]): PartialData<Map<number, MagicOwnedCard>> {
    const map: Map<number, MagicOwnedCard> = new Map();
    const partial = new PartialDataImpl(map);

    let todo = 0;
    let counter = 0;

    while (storedCards.length > 0) {
      const stack: Map<number, MagicReducedOwnedCard> = new Map();
      let stackSize = 0;
      // add 100 cards in the "stack"
      while (storedCards.length > 0 && stackSize < 100) {
        const cur = storedCards.pop();

        const cached = this.getCached(cur.cardId);

        if (cached !== null) {
          const other = new Map<number, MagicOwnedCard>();
          other.set(cur.cardId, new MagicOwnedCard(cached, cur.amount, cur.amountFoil));
          this.merge(map, other);
          continue;
        }


        stack.set(cur.cardId, cur);
        stackSize++;
        if (cur.double) {
          stackSize++; // double cards
        }
      }

      if (stackSize === 0) {
        break;
      }

      // process the "stack"
      const cid = ++counter;
      todo++;

      console.log("Sending request " + cid + " with " + stack.size + " cards");
      console.log(stack);
      this.api.getCards(stack).then(res => {
        console.log("Reply for request " + cid + " with " + res.size + " cards");
        console.log(res);
        this.merge(map, res);
        if (--todo === 0) {
          partial.finish();
        }
      });
    }

    if (counter === 0 || todo === 0) {
      partial.finish();
    }

    return partial;
  }

  loadString(stored: string): PartialData<Map<number, MagicOwnedCard>> {
    let storedCards = [];
    if (stored !== null && stored.length > 0) {
      storedCards = stored.split(";").map(MagicReducedOwnedCard.fromString);
    }

    return this.loadFromReducedArray(storedCards);
  }
}
