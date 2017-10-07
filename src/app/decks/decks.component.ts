import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {MagicDeckInfo} from "../types/magic-deck-info";
import {BackendService} from "../services/backend.service";
import {Response} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {DecksProviderService} from "./decks-provider.service";

@Component({
  templateUrl: 'decks.component.html'
})
export class DecksComponent implements OnInit {
  network = false;

  error: string = null; // For loading errors only
  decks: MagicDeckInfo[] = null;
  title: string = null;
  user: string = null;

  constructor(private backend: DecksProviderService, private route: ActivatedRoute, private auth: AuthService) {}

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
    return (this.user.toLowerCase() === "my" && this.auth.isAuthenticated()) || this.auth.isUser(this.user);
  }

  create(name: string) {
    if (this.network) {
      return;
    }

    this.network = true;
    this.backend.createDeck(name).then(id => {
      this.decks.push({name: name, _id: id});
      this.network = false;
    }).catch(err => {
      this.network = false;
      if (err instanceof Response) {
        alert("Error: " + err.json().message);
      } else {
        alert(err);
      }
    });
  }

  private loadDecks(): void {
    let promise: Promise<MagicDeckInfo[]>;
    if (this.modifiable) {
      this.title = "Decks";
      promise = this.backend.getDecks();
    } else {
      this.title = this.user + "'s decks";
      promise = this.backend.getDecks(this.user);
    }

    promise.then(decks => this.decks = decks).catch(err => {
      if (err instanceof Response) {
        const error = err as Response;
        this.error = error.json().message;
      } else {
        this.error = "unknown error";
        console.log(err);
      }
    });
  }
}
