import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {MagicSet} from "./types/magic-set";
import 'rxjs/add/operator/toPromise';
import {MagicCard} from "./types/magic-card";
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";

@Injectable()
export class MagicApiService {
  constructor(private http: Http) {}

  getSets(): Promise<MagicSet[]> {
    return this.http.get("https://api.magicthegathering.io/v1/sets")
      .toPromise()
      .then(result => result.json().sets as MagicSet[])
      .catch(this.handleError);
  }

  searchCard(set: string, number: string): Promise<MagicCard> {
    return this.http.get("https://api.magicthegathering.io/v1/cards?set=" + set + "&number=" + number)
      .toPromise()
      .then(result => {
        const arr = result.json().cards as MagicCard[];
        if (arr.length === 1) {
          return arr[0];
        }
        return null;
      })
      .catch(this.handleError);
  }

  getCards(storedcards: Map<number, MagicReducedOwnedCard>): Promise<Map<number, MagicOwnedCard>> {
    let selector = "";
    storedcards.forEach((value: MagicReducedOwnedCard, key: number) => {
      selector = (selector === "" ? "" : selector + "|") + key;
    });

    return this.http.get("https://api.magicthegathering.io/v1/cards?multiverseid=" + selector)
      .toPromise()
      .then(result => {
        const cards = result.json().cards as MagicCard[];
        const ret: Map<number, MagicOwnedCard> = new Map();

        for (const card of cards) {
          const stored = storedcards.get(card.multiverseid);
          ret.set(card.multiverseid, new MagicOwnedCard(card, stored.amount, stored.amountFoil));
        }

        return ret;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error', error);
    return Promise.reject(error.message || error);
  }
}
