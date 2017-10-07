import {MagicCompleteDeckInfo, MagicDeckInfo} from "./magic-deck-info";
import {CardStorage} from "./card-storage";

export class MagicDeck {
  constructor(private _info: MagicCompleteDeckInfo, private _cards: CardStorage) {
  }

  get info(): MagicCompleteDeckInfo {
    return this._info;
  }

  get cards(): CardStorage {
    return this._cards;
  }
}
