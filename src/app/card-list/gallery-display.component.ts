import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../services/card-storage";
import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-gallery-display',
  templateUrl: './gallery-display.component.html'
})
export class GalleryDisplayComponent {
  @Input() cards: MagicOwnedCard[];
  @Input() storage: CardStorage;
  detailedCard: MagicOwnedCard;
  @Input() pickFunction = (card: MagicOwnedCard) => this.detailedCard = card;
  @Input() cardSplitter = function(card: MagicOwnedCard): MagicOwnedCard[] { return [card]; };

  onClick(card: MagicOwnedCard) {
    this.pickFunction(card);
  }

  get splittedCards(): MagicOwnedCard[][] {
    return this.cards.map(card => this.cardSplitter(card));
  }
}
