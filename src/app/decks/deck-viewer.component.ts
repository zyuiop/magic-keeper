import {Component, OnInit} from '@angular/core';
import {DecksProviderService} from "./decks-provider.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {MagicDeck} from "../types/magic-deck";
import {Response} from "@angular/http";

@Component({
  templateUrl: 'deck-viewer.component.html'
})
export class DeckViewerComponent implements OnInit {
  error: string = null; // For loading errors only
  deck: MagicDeck = null;
  id: string = null;

  constructor(protected backend: DecksProviderService, protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("id")) {
          this.id = params.get("id");
          this.loadDeck();
        } else {
          this.error = "missing url";
        }
      });
  }

  protected shouldBeModifiable() {
    return false;
  }

  private loadDeck(): void {
    this.backend.getDeck(this.id).then(complete => {
      this.deck = this.backend.load(complete, this.shouldBeModifiable());

      if (this.deck.cards.allowUpdate() !== this.shouldBeModifiable() && this.shouldBeModifiable() === false) {
        this.deck = null;
        throw new Error("Deck modificability is invalid (expected " + this.shouldBeModifiable() + ")");
      }
    }).catch(err => {
      if (err instanceof Response) {
        const error = err as Response;
        this.error = error.json().message;
      } else {
        this.error = "unknown error";
        console.log(err);
      }
    });;
  }
}
