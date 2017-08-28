import {Component, Input, OnInit} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";
import {LocalCollectionService} from "../local-collection.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "../types/card-filter";
import {
  Comparator
} from "../types/sort";
import {CardStorage} from "../card-storage";
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {NotPublicCollectionError, OnlineCardStorage, OnlineCollectionService} from "../online-collection.service";
import {Response} from "@angular/http";

@Component({
  templateUrl: './public-collection.component.html',
  selector: 'app-public-collection'
})
export class PublicCollectionComponent implements OnInit {
  display = "standard";
  storage: OnlineCardStorage = null;
  error: string = null; // For loading errors only
  url: string = null;

  constructor(private online: OnlineCollectionService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("display")) {
          this.display = params.get("display");
        }

        if (params.has("url")) {
          this.url = params.get("url");
          this.loadStorage();
        } else {
          this.error = "missing url";
        }
      });
  }

  loadStorage(): void {
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

  get total(): number {
    let total = 0;
    for (const obj of this.storage.getCards()) {
      total += (obj as MagicOwnedCard).totalAmount();
    }
    return total;
  }
}
