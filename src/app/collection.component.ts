import {Component, Input, OnInit} from '@angular/core';
import {MagicOwnedCard} from "./types/magic-owned-card";
import {LocalCollectionService} from "./local-collection.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "./types/card-filter";
import {
  Comparator
} from "./types/sort";
import {CardStorage} from "./card-storage";
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {NotPublicCollectionError, OnlineCollectionService} from "./online-collection.service";
import {Response} from "@angular/http";

class DisplayType {
  key: string;
  name: string;
}

const DISPLAYS: DisplayType[] = [
  { key: "standard", name: "Classic"},
  { key: "gallery", name: "Gallery"},
  { key: "list", name: "List"}
];

@Component({
  templateUrl: './collection.component.html',
  selector: 'app-collection'
})
export class CollectionComponent implements OnInit {
  private _comparator = new Comparator([]);
  filters: CardFilter<any>[] = [
    new NumericFilter("amount", "Cards amount", 0),
    new NumericFilter("amountFoil", "Foil cards amount", 0),
    new NumericFilter("card.cmc", "Converted mana cost", 0),
    new StringFilter("card.name", "Card name", null),
    new StringFilter("card.setName", "Set name", null),
    new StringFilter("card.rarity", "Rarity", null),
    new StringFilter("card.type", "Type", null),
    new StringArrayFilter("card.colors", "Color", null),
    new SelectFilter("card.layout", "Layout", new Map([["normal", "Normal"], ["aftermath", "Aftermath"]]), null),
  ];
  displays = DISPLAYS;
  display = "standard";
  storage: CardStorage = null;
  error: string = null; // For loading errors only
  url: string = null;

  constructor(private lib: LocalCollectionService,
              private online: OnlineCollectionService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("display")) {
          this.display = params.get("display");
        }
        if (params.has("url")) {
          this.url = params.get("url");
        }

        this.loadStorage();
      });
  }

  loadStorage(): void {
    if (this.url === null) {
      this.storage = this.lib.load();
    } else {
      this.online.getCards(this.url).then(resp => this.storage = resp)
        .catch(err => {
          if (err instanceof NotPublicCollectionError) {
            this.error = "This collection is private !";
          } else if (err instanceof Response && (err as Response).status === 404) {
            this.error = "This collection doesn't exist !";
          } else {
            console.log(err);
          }
        });
    }
  }

  get comparator(): Comparator {
    return this._comparator;
  }

  get cards(): MagicOwnedCard[] {
    const cards = this.storage.getCards();
    return cards
      .filter(card => {
        for (const filter of this.filters) {
          if (!filter.check(card)) {
            return false;
          }
        }
        return true;
      })
      .sort((c1, c2) => this._comparator.compare(c1, c2));
  }

  get total(): number {
    let total = 0;
    for (const obj of this.storage.getCards()) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }
}
