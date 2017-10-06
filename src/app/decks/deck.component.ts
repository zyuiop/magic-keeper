import {Component, OnInit} from '@angular/core';
import {LocalDecksProviderService} from "./local-decks-provider.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {MagicDeck} from "../types/magic-deck";
import {DeckViewerComponent} from "./deck-viewer.component";
import {LocalCollectionService, LocalStorage} from "../services/local-collection.service";
import {CardStorage} from "../types/card-storage";

@Component({
  templateUrl: 'deck.component.html'
})
export class DeckComponent extends DeckViewerComponent implements OnInit {
  storage: CardStorage;

  constructor(local: LocalDecksProviderService, route: ActivatedRoute,
              private localStorage: LocalCollectionService) {
    super(local, route);
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
}
