import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {LocalDecksProviderService} from "./local-decks-provider.service";
import {MagicDeckInfo} from "../types/magic-deck-info";

@Component({
  templateUrl: 'decks.component.html'
})
export class DecksComponent implements OnInit {
  error: string = null; // For loading errors only
  decks: MagicDeckInfo[] = null;
  title: string = null;

  constructor(private local: LocalDecksProviderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("user")) {
          this.loadDecks(params.get("user"));
        } else {
          this.error = "missing url";
        }
      });
  }

  private loadDecks(user: string): void {
    if (user.toLowerCase() === "my") {
      this.title = "Decks";
      this.decks = this.local.decks;
      return;
    } else {
      this.title = user + "'s decks";
    }
  }
}
