import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "../types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "../types/magic-card";
import {CardStorage, ChangeListener} from "../types/card-storage";
import {CardProvider} from "../types/card-provider";
import {CardsLoaderService, PartialData} from "./cards-loader.service";
import {BackendService} from "./backend.service";
import {FixedCardStorage} from "../types/fixed-card-storage";

/**
 * Represents a card storage in which the cards are loaded from the backend
 * Storages loaded this way cannot be modified
 */
export class OnlineCardStorage extends FixedCardStorage {
  constructor(cards: PartialData<Map<number, MagicOwnedCard>>, private _username: string, private _lastChange: string) {
    super(cards);
  }

  get username(): string {
    return this._username;
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
