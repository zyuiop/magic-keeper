import {Injectable} from "@angular/core";
import {PartialData} from "../services/cards-loader.service";
import {MagicDeckInfo} from "../types/magic-deck-info";
import {LocalCollectionService, LocalStorage} from "../services/local-collection.service";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {MagicDeck} from "../services/magic-deck";

@Injectable()
export class LocalDecksProviderService {
  constructor(private loader: LocalCollectionService) {}

  get decks(): MagicDeckInfo[] {
    const decks = localStorage.getItem("decks");
    return JSON.parse(decks);
  }

  getDeck(id: number): MagicDeck {
    const decks = this.decks.filter(val => val.id === id);
    if (decks.length === 0) {
      return null;
    }

    return new MagicDeck(decks[0], this.loader.load("deck." + decks[0].id));
  }

  deleteDeck(id: number): void {
    const decks = this.decks;
    this.decks = decks.filter(val => val.id !== id);
  }

  createDeck(deck: MagicDeckInfo): void {
    const decks = this.decks;
    decks.push(deck);
    this.decks = decks;
  }

  set decks(decks: MagicDeckInfo[]) {
    localStorage.setItem("decks", JSON.stringify(decks));
  }
}
