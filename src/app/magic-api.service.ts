import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {MagicSet} from "./types/magic-set";
import 'rxjs/add/operator/toPromise';
import {MagicCard} from "./types/magic-card";
import {MagicOwnedCard, MagicReducedOwnedCard} from "./types/magic-owned-card";
import {isNull, isUndefined} from "util";

@Injectable()
export class MagicApiService {
  private baseApiUrl = "https://api.magicthegathering.io/v1/";
  private cardsUrl = this.baseApiUrl + "cards";
  private setsUrl = this.baseApiUrl + "sets";

  constructor(private http: Http) {}

  getSets(): Promise<MagicSet[]> {
    return this.http.get(this.setsUrl)
      .toPromise()
      .then(result => result.json().sets as MagicSet[])
      .catch(this.handleError);
  }

  searchCard(set: string, number: string): Promise<MagicCard> {
    return this.http.get(this.cardsUrl + "?set=" + set + "&number=" + number)
      .toPromise()
      .then(result => {
        const arr = result.json().cards as MagicCard[];
        if (arr.length >= 1) {
          return arr[0];
        }
        return null;
      })
      .then(this.getMultisidedCard)
      .catch(this.handleError);
  }

  getCards(storedcards: Map<number, MagicReducedOwnedCard>): Promise<Map<number, MagicOwnedCard>> {
    let selector = "";
    storedcards.forEach((value: MagicReducedOwnedCard, key: number) => {
      selector = (selector === "" ? "" : selector + "|") + key;
    });

    return this.http.get(this.cardsUrl + "?multiverseid=" + selector)
      .toPromise()
      .then(result => {
        const cards = result.json().cards as MagicCard[];
        const ret: Map<number, MagicOwnedCard> = new Map();
        const doubleFace: Map<number, MagicCard> = new Map(); // Temporary storage for double faced cards

        for (const card of cards) {
          if (card.names && card.names.length > 1 && card.name !== card.names[0]) {
            if (ret.has(card.multiverseid)) {
              ret.get(card.multiverseid).card.otherSide = card;
            } else {
              doubleFace.set(card.multiverseid, card);
            }
            continue;
          } else if (card.names && card.names.length > 1 && doubleFace.has(card.multiverseid)) {
            card.otherSide = doubleFace.get(card.multiverseid);
          }

          const stored = storedcards.get(card.multiverseid);
          ret.set(card.multiverseid, new MagicOwnedCard(card, stored.amount, stored.amountFoil));
        }

        return ret;
      })
      .catch(this.handleError);
  }

  private getMultisidedCard(card: MagicCard): Promise<MagicCard> {
    if (!card.names || card.names.length <= 1) {
      return Promise.resolve(card);
    }

    const multiverseId = card.multiverseid;
    return this.http.get(this.cardsUrl + "?multiverseid=" + multiverseId)
      .toPromise()
      .then(result => {
        const arr = result.json().cards as MagicCard[];
        if (isUndefined(arr) || isNull(arr) || arr.length < 1) {
          return null;
        }

        if (arr.length === 1) {
          return arr[0];
        }

        arr[0].otherSide = arr[1]; // fuck it !
        return arr[0];
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error', error);
    return Promise.reject(error.message || error);
  }
}
