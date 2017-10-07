import {Component, OnInit} from '@angular/core';
import {DecksProviderService} from "./decks-provider.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DeckViewerComponent} from "./deck-viewer.component";
import {LocalCollectionService} from "../services/local-collection.service";
import {CardStorage} from "../types/card-storage";
import {AuthService} from "../auth/auth.service";

@Component({
  templateUrl: 'deck.component.html'
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
    return this.auth.isUser(this.deck.info.username);
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
    if (this.deck.cards.getCards().length > 0) {
      return;
    }

    this.backend.deleteDeck(this.deck.info._id).then(r => {
      if (r.ok) {
        this.router.navigate(['/decks', {name: this.deck.info.username}]);
      }
    }).catch(err => {
      alert(err);
    });
  }
}
