import {Injectable} from "@angular/core";
import {MagicDeckInfo} from "../types/magic-deck-info";
import {LocalCollectionService} from "../services/local-collection.service";
import {MagicDeck} from "../types/magic-deck";
import {DeckStorage} from "../types/deck-storage";

@Injectable()
export class LocalDecksProviderService {
  constructor(private loader: LocalCollectionService) {}

  get decks(): MagicDeckInfo[] {
    const decks = localStorage.getItem("decks");
    const arr = JSON.parse(decks);

    return arr === null ? [] : arr;
  }

  get freeId() {
    let maxId = 0;
    this.decks.forEach(deck => maxId = (deck.id > maxId) ? deck.id : maxId);

    return maxId + 1;
  }

  getDeck(id: number): MagicDeck {
    const decks = this.decks.filter(val => val.id === id);
    if (decks.length === 0) {
      return null;
    }

    console.log("Loading local deck " + id);
    const deck = new MagicDeck(decks[0], this.loader.load("deck." + decks[0].id));

    console.log(deck);

    return deck;
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

  createDeckByName(name: string): void {
    const info = new MagicDeckInfo();
    info.name = name;
    info.id = this.freeId;
    this.createDeck(info);
  }

  set decks(decks: MagicDeckInfo[]) {
    localStorage.setItem("decks", JSON.stringify(decks));
  }
}
