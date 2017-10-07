import {Component, OnInit} from '@angular/core';
import {DecksProviderService} from "./decks-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DeckViewerComponent} from "./deck-viewer.component";
import {LocalCollectionService} from "../services/local-collection.service";
import {CardStorage} from "../types/card-storage";
import {AuthService} from "../auth/auth.service";
import {MagicDeckSnapshot} from "../types/magic-deck-info";
import {MagicDeck} from "../types/magic-deck";
import {MagicOwnedCard} from "../types/magic-owned-card";

@Component({
  templateUrl: 'deck.component.html',
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
export class DeckComponent extends DeckViewerComponent implements OnInit {
  storage: CardStorage;

  constructor(backend: DecksProviderService, route: ActivatedRoute,
              private localStorage: LocalCollectionService, private router: Router,
              private auth: AuthService) {
    super(backend, route);
  }

  get deckCount() {
    let num = 0;
    this.deck.cards.getCards().forEach(c => num += c.amount + c.amountFoil);
    return num;
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Load own deck
    this.storage = this.localStorage.load();
  }

  get allowed() {
    return this.deck === null || this.auth.isUser(this.deck.info.username);
  }

  protected shouldBeModifiable() {
    return true;
  }

  rename(name: string) {
    this.backend.updateDeck(this.deck.info._id, {name: name}).then(res => {
      if (res.ok) {
        this.deck.info.name = name;
      }
    });
  }

  updatePrivacy(val: string) {
    this.backend.updateDeck(this.deck.info._id, {public: val === "true"}).then(res => {
      if (res.ok) {
        this.deck.info.public = val === "true";
      }
    });
  }

  delete() {
    if (!this.deck.cards.finishedLoading()) {
      return;
    }

    // Add cards into storage
    this.deck.cards.getCards().forEach(card => {
      this.storage.addCard(card.card, card.amount, card.amountFoil);
    });

    this.backend.deleteDeck(this.deck.info._id).then(r => {
      if (r.ok) {
        this.router.navigate(['/decks', this.deck.info.username]);
      }
    }).catch(err => {
      alert(err);
    });
  }

  makeSnapshot(name: string) {
    this.backend.makeSnapshot(this.deck, name).then(snap => {
      this.deck.info.snapshots.push(snap);
    });
  }

  get snapshots() {
    return this.deck.info.snapshots.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  getSnapDate(snap: MagicDeckSnapshot) {
    const data = new Date(snap.date);
    return data.toLocaleDateString() + " " + data.toLocaleTimeString();
  }

  loadSnapshot(snap: MagicDeckSnapshot) {
    if (this.deck === null) {
      return;
    }

    console.log("Requesting snapshot load " + snap.name + " / " + snap.date + " / " + snap.cards);

    const oldCards = this.deck.cards;
    const oldInfo = this.deck.info;
    this.deck = null;

    const data = this.backend.loadCards(snap.cards);
    console.log("Loading cards...");

    data.onComplete(map => {
      console.log("Cards load done");
      // Replace deck cards
      const newCards = this.backend.loadLocal(oldInfo._id, data);

      // Update library
      oldCards.getCards().forEach(card => {
        this.storage.addCard(card.card, card.amount, card.amountFoil);
      });
      newCards.getCards().forEach(card => {
        this.storage.removeCard(card.card, card.amount, card.amountFoil);
      });

      // Request online update as well
      this.backend.updateDeck(oldInfo._id, {cards: newCards.toString()});

      // Finish !
      this.deck = new MagicDeck(oldInfo, newCards);
      console.log("Replaced deck")
    });
  }
}
