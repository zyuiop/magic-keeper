import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../card-storage";
import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-gallery-display',
  templateUrl: './gallery-display.component.html'
})
export class GalleryDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;
  detailedCard: MagicOwnedCard;
}
