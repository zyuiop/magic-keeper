import {MagicDeckInfo} from "../types/magic-deck-info";
import {CardStorage} from "./card-storage";

export class MagicDeck {
  constructor(private _info: MagicDeckInfo, private _cards: CardStorage) {
  }

  get info(): MagicDeckInfo {
    return this._info;
  }

  get cards(): CardStorage {
    return this._cards;
  }
}
