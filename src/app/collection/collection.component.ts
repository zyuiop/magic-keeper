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
import {
  NotPublicCollectionError, OnlineCardStorage,
  OnlineCollectionService
} from "../services/online-collection.service";
import {Response} from "@angular/http";

@Component({
  templateUrl: './collection.component.html',
  selector: 'app-collection'
})
export class CollectionComponent implements OnInit {
  storage: CardStorage = null;
  error: string = null; // For loading errors only

  constructor(private lib: LocalCollectionService, private online: OnlineCollectionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("url")) {
          this.loadStorage(params.get("url"));
        } else {
          this.error = "missing url";
        }
      });
  }

  private loadStorage(url: string): void {
    if (url.toLowerCase() === "my") {
      this.storage = this.lib.load();
      return;
    }

    this.online.getCards(url).then(resp => this.storage = resp)
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

  get total(): number {
    let total = 0;
    for (const obj of this.storage.getCards()) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }

  get title(): string {
    if (this.storage instanceof OnlineCardStorage) {
      return (this.storage.username) + "'s collection";
    }

    return "Collection";
  }
}
