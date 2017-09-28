import {Component, OnInit} from '@angular/core';

@Component({
  templateUrl: 'decks.component.html'
})
export class DecksComponent implements OnInit {
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
}
