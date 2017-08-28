import {Injectable} from '@angular/core';
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";
import {MagicApiService} from "./magic-api.service";
import {MagicCard} from "./types/magic-card";
import {CardStorage} from "./card-storage";
import {CardProvider} from "./card-provider";

@Injectable()
export class CardsLoaderService {
  constructor(private api: MagicApiService) {
  }

  private merge(map: Map<number, MagicOwnedCard>, otherMap: Map<number, MagicOwnedCard>): void {
    otherMap.forEach((card: MagicOwnedCard, key: number) => {
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

  loadString(stored: string): Map<number, MagicOwnedCard> {
    const map: Map<number, MagicOwnedCard> = new Map();
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
          this.merge(map, res);
        });
      }
    }

    return map;
  }
}
