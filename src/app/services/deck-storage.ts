import {MagicDeckInfo} from "../types/magic-deck-info";
import {MagicDeck} from "./magic-deck";

/**
 * Represents something that saves cards, either an API, a card list, a decks, a collection, a decks side, ...
 */
export interface DeckStorage {
  decks: MagicDeckInfo[];

  getDeck(id: number): Promise<MagicDeck>;

  deleteDeck(id: number): void;

}
