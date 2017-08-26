import {Component, OnInit} from '@angular/core';
import {MagicOwnedCard} from "./types/magic-owned-card";
import {MagicLibraryService} from "./magic-library.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "./types/card-filter";
import {
  Comparator
} from "./types/sort";
import {CardStorage} from "./card-storage";
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';

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
  templateUrl: './card-list.component.html',
  selector: 'app-card-list'
})
export class CardListComponent implements OnInit {
  private _cards: Map<number, MagicOwnedCard>;
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

  constructor(private lib: MagicLibraryService,
              private route: ActivatedRoute) {
    this._cards = lib.cards;
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("display")) {
          this.display = params.get("display");
        }
      });
  }

  get comparator(): Comparator {
    return this._comparator;
  }

  get cards(): MagicOwnedCard[] {
    const cards = Array.from(this._cards.values());
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
    this._cards.forEach(value => total += value.totalAmount());
    return total;
  }

  get storage(): CardStorage {
    return this.lib;
  }
}
