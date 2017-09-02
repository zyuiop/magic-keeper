import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";
import {LocalCollectionService} from "../local-collection.service";
import {CardFilter, NumericFilter, SelectFilter, StringArrayFilter, StringFilter} from "../types/card-filter";
import {
  Comparator
} from "../types/sort";
import {CardStorage} from "../card-storage";
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {NotPublicCollectionError, OnlineCollectionService} from "../online-collection.service";
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
  template: `<select class="form-control" style="display: inline-block;" [(ngModel)]="display">
    <option *ngFor="let disp of displays" value="{{disp.key}}">{{disp.name}}</option>
  </select>`,
  selector: 'app-display-selector'
})
export class DisplaySelectorComponent implements OnInit{
  displays = DISPLAYS;
  display = "standard";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has("display")) {
          this.display = params.get("display");
        }
      });
  }
}
