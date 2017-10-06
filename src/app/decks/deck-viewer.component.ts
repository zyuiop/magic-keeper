import {Component, OnInit} from '@angular/core';
import {LocalDecksProviderService} from "./local-decks-provider.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {MagicDeck} from "../types/magic-deck";

@Component({
  templateUrl: 'deck-viewer.component.html'
})
export class DeckViewerComponent implements OnInit {
  error: string = null; // For loading errors only
  deck: MagicDeck = null;
  user: string = null;
  id: number = null;

  constructor(protected local: LocalDecksProviderService, protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("user") && params.has("id")) {
          this.user = params.get("user");
          this.id = +params.get("id");
          this.loadDeck();
        } else {
          this.error = "missing url";
        }
      });
  }

  get modifiable() {
    return this.deck != null && this.deck.cards.allowUpdate() && this.user.toLowerCase() === "my";
  }

  private loadDeck(): void {
    if (this.user.toLowerCase() === "my") {
      this.deck = this.local.getDeck(this.id);

      if (this.deck === null) {
        this.error = "Invalid deck id";
      }

      return;
    } else {

    }
  }
}
