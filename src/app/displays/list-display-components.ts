import {MagicLibraryService} from "../magic-library.service";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {Component, Input} from "@angular/core";
import {CardStorage} from "../card-storage";

abstract class AbstractDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;

}

@Component({
  selector: 'app-card-qty-display',
  templateUrl: './card-qty-display.component.html'
})
export class CardQtyDisplayComponent extends AbstractDisplayComponent {
  @Input() card: MagicOwnedCard;
  @Input() storage: CardStorage;
  @Input() foil: boolean;

  update(remove: boolean) {
    if (remove) {
      this.storage.removeCard(this.card.card, this.foil ? 0 : 1, this.foil ? 1 : 0);
    } else {
      this.storage.addCard(this.card.card, this.foil ? 0 : 1, this.foil ? 1 : 0);
    }
  }

  get amount(): number {
    return this.foil ? this.card.amountFoil : this.card.amount;
  }
}

@Component({
  selector: 'app-gallery-display',
  templateUrl: './gallery-display.component.html'
})
export class GalleryDisplayComponent extends AbstractDisplayComponent {
  detailedCard: MagicOwnedCard;
}

@Component({
  selector: 'app-info-list-display',
  templateUrl: './info-list-display.component.html'
})
export class InfoListDisplayComponent extends AbstractDisplayComponent {
}

@Component({
  selector: 'app-standard-display',
  templateUrl: './standard-display.component.html'
})
export class StandardDisplayComponent extends AbstractDisplayComponent {
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
