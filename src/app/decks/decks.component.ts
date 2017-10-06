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
  user: string = null;

  constructor(private local: LocalDecksProviderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("user")) {
          this.user = params.get("user");
          this.loadDecks();
        } else {
          this.error = "missing url";
        }
      });
  }

  get modifiable() {
    return this.user.toLowerCase() === "my";
  }

  deleteDeck(info: MagicDeckInfo) {
    this.local.deleteDeck(info.id);
  }

  create(name: string) {
    this.local.createDeckByName(name);
  }

  private loadDecks(): void {
    if (this.user.toLowerCase() === "my") {
      this.title = "Decks";
      this.decks = this.local.decks;
      return;
    } else {
      this.title = this.user + "'s decks";
    }
  }
}
