import {Component, OnInit} from '@angular/core';
import {DecksProviderService} from "./decks-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DeckViewerComponent} from "./deck-viewer.component";
import {LocalCollectionService} from "../services/local-collection.service";
import {CardStorage} from "../types/card-storage";
import {AuthService} from "../auth/auth.service";
import {MagicDeckSnapshot} from "../types/magic-deck-info";
import {MagicDeck} from "../types/magic-deck";
import {MagicOwnedCard, MagicReducedOwnedCard} from "../types/magic-owned-card";
import {CardsLoaderService} from "../services/cards-loader.service";
import {FixedCardStorage} from "../types/fixed-card-storage";
import {isNullOrUndefined} from "util";

class StoredSnapshot {
  name: string;
  cards: MagicReducedOwnedCard[];
  date: Date;
}

class SnapshotDiff {
  previous: string;
  current: string;
  added: CardStorage;
  removed: CardStorage;
}

@Component({
  templateUrl: 'deck-history.component.html',
  styles: [
    `
      table {
        display: table;
        width: 100%;
        max-width: 100%;
      }

      td {
        padding: 2px;
        vertical-align: top;
      }
    `
  ]
})
export class DeckHistoryComponent extends DeckViewerComponent implements OnInit {
  private _snapshots: StoredSnapshot[];
  private _diffs: SnapshotDiff;
  private _left: StoredSnapshot;
  private _right: StoredSnapshot;

  constructor(backend: DecksProviderService, route: ActivatedRoute,
              private cardsLoader: CardsLoaderService, private auth: AuthService) {
    super(backend, route);
  }


  get left(): StoredSnapshot {
    return this._left;
  }

  set left(value: StoredSnapshot) {
    this._left = value;
    this._diffs = null;
  }

  get right(): StoredSnapshot {
    return this._right;
  }

  set right(value: StoredSnapshot) {
    this._right = value;
    this._diffs = null;
  }

  get leftName(): string {
    return isNullOrUndefined(this._left) ? undefined : this.buildName(this._left);
  }

  private searchSnap(value: string) {
    const index = value.lastIndexOf("&&");
    const name = value.substr(0, index);
    const date = value.substring(index + 2);
    const arr = this._snapshots.filter(snap => snap.name === name && snap.date.toString() === date);
    return (arr && arr.length > 0) ? arr[0] : null;
  }

  set leftName(value: string) {
    this.left = this.searchSnap(value);
  }

  buildName(snap: StoredSnapshot) {
    return snap.name + "&&" + snap.date.toString();
  }

  get rightName(): string {
    return isNullOrUndefined(this._right) ? undefined : this.buildName(this._right);
  }

  set rightName(value: string) {
    this.right = this.searchSnap(value);
  }

  get snapshots(): StoredSnapshot[] {
    if (!isNullOrUndefined(this._snapshots)) {
      return this._snapshots;
    }

    const snaps = this.deck.info.snapshots.map(snap => {
      return {name: snap.name, date: new Date(snap.date), cards: snap.cards.split(";").map(MagicReducedOwnedCard.fromString)};
    });
    snaps.push({name: "(current)", date: new Date(), cards: this.deck.info.cards.split(";").map(MagicReducedOwnedCard.fromString)});
    snaps.push({name: "(none)", date: new Date(0), cards: this.deck.info.cards.split(";").map(MagicReducedOwnedCard.fromString)});
    this._snapshots = snaps.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    this.left = this.snapshots[0];
    this.right = this.snapshots[1];
    return this._snapshots;
  }

  get allowed() {
    return this.deck === null || this.auth.isUser(this.deck.info.username);
  }

  get diff(): SnapshotDiff {
    if (!isNullOrUndefined(this._diffs)) {
      return this._diffs;
    }

    if (isNullOrUndefined(this.left) || isNullOrUndefined(this.right)) {
      return null;
    }

    this._diffs = this.compare(this.left, this.right);
    return this._diffs;
  }

  /**
   * Find all the cards added in stack1 that weren't in stack2
   * @param {StoredSnapshot} stack1
   * @param {StoredSnapshot} stack2
   * @returns {MagicReducedOwnedCard[]}
   */
  private findAddedCard(stack1: StoredSnapshot, stack2: StoredSnapshot): MagicReducedOwnedCard[] {
    const added = [];

    outer: for (const card of stack1.cards) {
      for (const check of stack2.cards) {
        if (check.cardId === card.cardId) {
          const d = {cardId: check.cardId, amount: 0, amountFoil: 0};
          if (check.amountFoil < card.amountFoil) {
            d.amountFoil = card.amountFoil - check.amountFoil;
          }

          if (check.amount < card.amount) {
            d.amount = card.amount - check.amount;
          }

          if (d.amountFoil > 0 || d.amount > 0) {
            added.push(d);
          }
          continue outer;
        }
      }

      added.push(card);
    }

    return added;
  }

  private compare(left: StoredSnapshot, right: StoredSnapshot): SnapshotDiff {
    const added = this.findAddedCard(left, right);
    const removed = this.findAddedCard(right, left);


    const addedData = this.cardsLoader.loadFromReducedArray(added);
    const removedData = this.cardsLoader.loadFromReducedArray(removed);

    return {previous: right.name, current: left.name, added: new FixedCardStorage(addedData), removed: new FixedCardStorage(removedData)};
  }

  count(stor: CardStorage): number {
    let total = 0;
    for (const obj of stor.getCards()) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }
}
