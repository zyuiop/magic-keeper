import {Component, OnInit} from '@angular/core';
import {LocalDecksProviderService} from "./local-decks-provider.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {MagicDeck} from "../services/magic-deck";

@Component({
  templateUrl: 'deck.component.html'
})
export class DeckComponent implements OnInit {
  error: string = null; // For loading errors only
  deck: MagicDeck = null;

  constructor(private local: LocalDecksProviderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("user") && params.has("id")) {
          this.loadDeck(params.get("user"), +params.get("id"));
        } else {
          this.error = "missing url";
        }
      });
  }

  private loadDeck(user: string, deck: number): void {
    if (user.toLowerCase() === "my") {
      this.deck = this.local.getDeck(deck);

      if (this.deck === null) {
        this.error = "Invalid deck id";
      }

      return;
    } else {

    }
  }
}
