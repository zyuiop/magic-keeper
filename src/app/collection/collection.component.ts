import {Component, Input, OnInit} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";
import {LocalCollectionService} from "../services/local-collection.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "../types/card-filter";
import {
  Comparator
} from "../types/sort";
import {CardStorage} from "../services/card-storage";
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {NotPublicCollectionError, OnlineCollectionService} from "../services/online-collection.service";
import {Response} from "@angular/http";

@Component({
  templateUrl: './collection.component.html',
  selector: 'app-collection'
})
export class CollectionComponent implements OnInit {
  storage: CardStorage = null;
  error: string = null; // For loading errors only

  constructor(private lib: LocalCollectionService) {}

  ngOnInit(): void {
    this.storage = this.lib.load();
  }

  get total(): number {
    let total = 0;
    for (const obj of this.storage.getCards()) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }
}
