import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "../types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "../types/magic-card";
import {CardStorage, ChangeListener} from "../types/card-storage";
import {CardProvider} from "../types/card-provider";
import {CardsLoaderService, PartialData} from "./cards-loader.service";
import {BackendService} from "./backend.service";

/**
 * Represents a card storage in which the cards are loaded from the backend
 * Storages loaded this way cannot be modified
 */
export class OnlineCardStorage implements CardStorage {
  constructor(private cards: PartialData<Map<number, MagicOwnedCard>>, private _username: string, private _lastChange: string) {};

  addCard(card: MagicCard, amount: number, amountFoil: number): void {
    throw new Error("Method not implemented.");
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number): void {
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

  get username(): string {
    return this._username;
  }

  finishedLoading(): boolean {
    return this.cards.isComplete();
  }

  lastChange(): Date {
    return new Date(this._lastChange);
  }

  addChangeListener(listener: Function) {
  }
}

@Injectable()
export class OnlineCollectionService {
  constructor(private loader: CardsLoaderService, private backend: BackendService) {
  }

  getCards(url: string): Promise<OnlineCardStorage> {
    return this.backend.getCollection(url).then(collection => {
      if (collection.public) {
        return new OnlineCardStorage(this.loader.loadString(collection.userCollection), collection.username, collection.lastChanged);
      } else {
        throw new NotPublicCollectionError();
      }
    });
  }
}

export class NotPublicCollectionError implements Error {
  name = "NotPublicCollectionError";
  message = "Collection is not public !";
}
