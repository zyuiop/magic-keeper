import {MagicCard} from "../types/magic-card";
import {MagicOwnedCard} from "../types/magic-owned-card";

/**
 * Represents something that saves cards, either an API, a card list, a decks, a collection, a decks side, ...
 */
export interface CardStorage {
  /**
   * Add a given amount of a given card
   * @param {MagicCard} card the card to add
   * @param {number} amount the quantity of the card to add
   * @param {number} amountFoil the quantity of the premium version (foil) of the card to add
   */
  addCard(card: MagicCard, amount: number, amountFoil: number): void;

  /**
   * Remove a given amount of a given card
   * @param {MagicCard} card
   * @param {number} amount
   * @param {number} amountFoil
   */
  removeCard(card: MagicCard, amount: number, amountFoil: number): void;

  /**
   * Check if this DeckStorage can be updated
   * @returns {boolean}
   */
  allowUpdate(): boolean;

  /**
   * Get all the cards
   * @returns {MagicOwnedCard[]} an instant value of the cardlist owned. This list may not be complete as data may still
   * be downloading from the net.
   */
  getCards(): MagicOwnedCard[];

  toString(): string;

  finishedLoading(): boolean;

  lastChange(): Date;

  addChangeListener(listener: Function);
}

export interface ChangeListener {
  onChange(changedStorage: CardStorage);
}
