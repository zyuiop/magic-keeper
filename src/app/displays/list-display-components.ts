import {MagicLibraryService} from "../magic-library.service";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {Component, Input} from "@angular/core";

abstract class AbstractDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  constructor(private lib: MagicLibraryService) {}

  update(card: MagicOwnedCard, foil: boolean, remove: boolean) {
    if (remove) {
      this.lib.removeCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
    } else {
      this.lib.addCard(card.card, foil ? 0 : 1, foil ? 1 : 0);
    }
  }
}

@Component({
  selector: 'app-gallery-display',
  templateUrl: './gallery-display.component.html'
})
export class GalleryDisplayComponent extends AbstractDisplayComponent {
  detailedCard: MagicOwnedCard;

  constructor(lib: MagicLibraryService) {
    super(lib);
  }
}

@Component({
  selector: 'app-info-list-display',
  templateUrl: './info-list-display.component.html'
})
export class InfoListDisplayComponent extends AbstractDisplayComponent {
  constructor(lib: MagicLibraryService) {
    super(lib);
  }
}

@Component({
  selector: 'app-standard-display',
  templateUrl: './standard-display.component.html'
})
export class StandardDisplayComponent extends AbstractDisplayComponent {
  constructor(lib: MagicLibraryService) {
    super(lib);
  }
}

export class DisplayType {
  key: string;
  name: string;
}

export const DISPLAYS: DisplayType[] = [
  { key: "standard", name: "Classic"},
  { key: "gallery", name: "Gallery"},
  { key: "list", name: "List"}
];
