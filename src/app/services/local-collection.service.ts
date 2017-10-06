import {Injectable} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";
import {MagicCard} from "../types/magic-card";
import {CardStorage, ChangeListener} from "../types/card-storage";
import {CardProvider} from "../types/card-provider";
import {CardsLoaderService, PartialData} from "./cards-loader.service";
import {CloudSaverService} from "./cloud-saver.service";

@Injectable()
export class LocalCollectionService {
  private _cached = new Map<string, LocalStorage>();

  constructor(private loader: CardsLoaderService, private cloud: CloudSaverService) {}

  /**
   * Loads the cards corresponding to a key, returning cached cards if existing
   * @param {string} key the key to load
   * @returns {LocalStorage} the storage in which cards are stored when loaded
   */
  load(key?: string): LocalStorage {
    key = (key == null ? "cards" : key);

    if (!this._cached.has(key)) {
      this._cached.set(key, this.doLoad(key));
    }

    return this._cached.get(key);
  }

  /**
   * Loads the cards corresponding to a key
   * @param {string} key the key to load
   * @returns {LocalStorage} the storage in which the cards are stored when loaded
   */
  private doLoad(key: string): LocalStorage {
    const storage = new LocalStorage(this.loader.loadFromStorage(key), key);
    storage.addChangeListener(stor => this.cloud.autoSave(stor)); // Cloud listener automatically added
    storage.addChangeListener(stor => {
      localStorage.setItem(key, stor.toString());
      localStorage.setItem(key + ".lastSave", new Date().toString());
    });
    return storage;
  }

  /**
   * Replace a locally stored collection string with an other one
   * @param {string} cards the cards to put in place
   * @param {string} key the key in which to store the collection
   */
  replace(cards: string, key?: string): void {
    this.doReplace(cards, (key == null ? "cards" : key));
  }

  private doReplace(cards: string, key: string): void {
    this._cached.delete(key); // invalidate the cache
    localStorage.setItem(key, cards); // replace the value
  }
}

export class LocalStorage implements CardStorage, CardProvider {
  private _changeListeners: ((storage: LocalStorage) => void)[] = [];

  constructor(private _cards: PartialData<Map<number, MagicOwnedCard>>, private _saveDestination: string) {}

  /**
   * Add a given card to the library, in a given quantity
   * @param {MagicCard} card the card to add
   * @param {number} amount the quantity of the card to add
   * @param {number} amountFoil the quantity of the premium version (foil) of the card to add
   */
  addCard(card: MagicCard, amount: number, amountFoil: number) {
    if (card === null) {
      throw new Error("Tried to add null card");
    }
    if (card.multiverseid === null) {
      throw new Error("Tried to add invalid card");
    }

    this.putCard(new MagicOwnedCard(card, amount, amountFoil));
    this.notifyUpdate();
  }

  addChangeListener(listener: ((storage: LocalStorage) => void)) {
    this._changeListeners.push(listener);
  }

  get cards(): Map<number, MagicOwnedCard> {
    return this._cards.getData();
  }

  getCards(): MagicOwnedCard[] {
    return Array.from(this.cards.values());
  }

  removeCard(card: MagicCard, amount: number, amountFoil: number) {
    if (card === null) {
      throw new Error("Tried to remove null card");
    }
    if (card.multiverseid === null) {
      throw new Error("Tried to remove invalid card");
    }

    if (this.cards.has(card.multiverseid)) {
      this.cards.get(card.multiverseid).increaseFoil(- amountFoil);
      this.cards.get(card.multiverseid).increase(- amount);

      if (this.cards.get(card.multiverseid).totalAmount() <= 0) {
        this.cards.delete(card.multiverseid);
      }
    } else {
      throw new Error("This card is not in the decks !");
    }
    this.notifyUpdate();
  }

  private putCard(card: MagicOwnedCard): void {
    if (card.amount <= 0 && card.amountFoil <= 0) {
      return;
    }

    if (this.cards.has(card.card.multiverseid)) {
      this.cards.get(card.card.multiverseid).increaseFoil(card.amountFoil);
      this.cards.get(card.card.multiverseid).increase(card.amount);
    } else {
      this.cards.set(card.card.multiverseid, card);
    }
  }

  toString(): string {
    const toStore: string[] = [];

    this.cards.forEach(card => {
      toStore.push(card.toString());
    });

    return toStore.join(";");
  }

  protected notifyUpdate(): void {
    for (const listener of this._changeListeners) {
      listener(this);
    }
  }

  lastChange(): Date {
    const last = localStorage.getItem(this._saveDestination + ".lastSave");
    if (last === null) {
      return null;
    }

    return new Date(last);
  }

  searchCard(set: string, number: string): Promise<MagicCard> {
    const corresp = Array.from(this.cards.values())
      .filter(c => c.card.set === set && c.card.number.toLowerCase() === number.toLowerCase());
    return Promise.resolve((corresp && corresp.length > 0 ? corresp[0].card : null));
  }

  allowUpdate(): boolean {
    return this.finishedLoading(); // local storage can always be written
  }

  finishedLoading(): boolean {
    return this._cards.isComplete();
  }
}
