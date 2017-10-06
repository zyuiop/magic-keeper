import {MagicCard} from "./magic-card";

/**
 * Represents something that provides cards, either an API or a card list
 */
export interface CardProvider {
  /**
   * Search a card using its set and collectible number
   * @param {string} set
   * @param {string} number
   * @returns {Promise<MagicCard>}
   */
  searchCard(set: string, number: string): Promise<MagicCard>;
}
