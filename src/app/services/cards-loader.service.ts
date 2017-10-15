import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "../types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "../types/magic-card";
import {CardStorage} from "../types/card-storage";
import {CardProvider} from "../types/card-provider";
import {Observable} from "rxjs/Observable";
import {count} from "rxjs/operator/count";
import {isNullOrUndefined, isUndefined} from "util";

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
  multiverseid: number;
  card: MagicCard;
  usages: number;
}

@Injectable()
export class CardsLoaderService {
  private _database: IDBDatabase;

  constructor(private api: MagicApiService) {
  }

  private getDatabase(callback: ((database: IDBDatabase) => void)) {
    if (!isUndefined(this._database)) {
      callback(this._database);
    } else {
      const req = indexedDB.open("CacheDatabase", 2);

      req.onsuccess = (e: any) => {
        this._database = e.target.result;
        callback(this._database);
      };

      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        const objectStore = db.createObjectStore("cache", {keyPath: "multiverseid"});
      };
    }
  }

  private getCached(card: number, callback: ((value: MagicCard) => void)) {
    this.getDatabase(database => {
      const store = database.transaction(["cache"], "readonly").objectStore("cache");

      const request = store.get(card);

      request.onsuccess = (e: any) => {
        const result = (request.result as CachedCard);
        callback(isNullOrUndefined(result) ? null : result.card);
      };
    });
  }

  private cacheCard(card: MagicCard) {
    this.getDatabase(database => {

      const store = database.transaction(["cache"], "readwrite").objectStore("cache");

      const request = store.get(card.multiverseid);
      request.onsuccess = (event) => {
        let stored = request.result;

        if (isNullOrUndefined(stored)) {
          stored = {card: card, usages: 1, multiverseid: card.multiverseid};
        } else {
          stored.usages++;
        }

        store.put(stored);
      };
    });
  }

  loadFromStorage(storageKey: string): PartialData<Map<number, MagicOwnedCard>> {
    return this.loadString(localStorage.getItem(storageKey));
  }

  private addCard(map: Map<number, MagicOwnedCard>, card: MagicOwnedCard) {
    if (card.amount <= 0 && card.amountFoil <= 0) {
      return;
    }

    if (map.has(card.card.multiverseid)) {
      map.get(card.card.multiverseid).increaseFoil(card.amountFoil);
      map.get(card.card.multiverseid).increase(card.amount);
    } else {
      map.set(card.card.multiverseid, card);
    }
  }

  private merge(map: Map<number, MagicOwnedCard>, otherMap: Map<number, MagicOwnedCard>): void {
    otherMap.forEach((card: MagicOwnedCard, key: number) => {
      this.cacheCard(card.card);
      this.addCard(map, card);
    });
  }

  loadString(stored: string): PartialData<Map<number, MagicOwnedCard>> {
    const map: Map<number, MagicOwnedCard> = new Map();
    const partial = new PartialDataImpl(map);

    if (stored !== null && stored.length > 0) {
      const storedCards = stored.split(";").map(MagicReducedOwnedCard.fromString);

      let apiRequests = 0;
      let dbRequests = 0;
      let stack: Map<number, MagicReducedOwnedCard> = new Map();
      let stackSize = 0;
      let finished = false;

      while (storedCards.length > 0) {
        const cur = storedCards.pop(); // We fetch all the stored cards
        dbRequests ++;

        this.getCached(cur.cardId, card => {
          dbRequests --;
          if (card !== null) {
            this.addCard(map, new MagicOwnedCard(card, cur.amount, cur.amountFoil));

            if (dbRequests === 0 && finished && apiRequests === 0) {
              partial.finish();
            }
          } else {
            stack.set(cur.cardId, cur);
            stackSize++;
            if (cur.double) {
              stackSize++; // double cards
            }

            if ((dbRequests === 0 && finished) || stackSize === 100) {
              const oldStack = stack;
              stackSize = 0;
              stack = new Map();
              apiRequests ++;

              console.log("Sending request with " + stack.size + " cards");
              console.log(oldStack);
              this.api.getCards(oldStack).then(res => {
                console.log("Reply for request with " + res.size + " cards");
                console.log(res);
                this.merge(map, res);
                if (--apiRequests === 0 && finished) {
                  partial.finish();
                }
              });
            }
          }
        });
      }

      finished = true;

      if (apiRequests === 0 && dbRequests === 0) {
        partial.finish();
      }
    } else {
      partial.finish();
    }

    return partial;
  }
}
