import {MagicCard} from "./types/magic-card";

/**
 * Represents something that saves cards, either an API, a card list, a deck, a collection, a deck side, ...
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
   * Check if this CardStorage can be updated
   * @returns {boolean}
   */
  allowUpdate(): boolean;
}