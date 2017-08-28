import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "./types/magic-card";
import {CardStorage} from "./card-storage";
import {CardProvider} from "./card-provider";
import {CardsLoaderService} from "./cards-loader.service";
import {BackendService} from "./backend.service";

class OnlineCardStorage implements CardStorage {
  constructor(private cards: Map<number, MagicOwnedCard>) {};

  addCard(card: MagicCard, amount: number, amountFoil: number): void {
    throw new Error("Method not implemented.");
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number): void {
    throw new Error("Method not implemented.");
  }

  allowUpdate(): boolean {
    return false;
  }

  getCards(): MagicOwnedCard[] {
    return Array.from(this.cards.values());
  }
}

@Injectable()
export class OnlineCollectionService {
  constructor(private loader: CardsLoaderService, private backend: BackendService) {
  }

  getCards(url: string): Promise<CardStorage> {
    return this.backend.getCollection(url).then(collection => {
      if (collection.public) {
        return new OnlineCardStorage(this.loader.loadString(collection.userCollection));
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
