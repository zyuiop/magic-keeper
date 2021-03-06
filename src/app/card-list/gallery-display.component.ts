import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../types/card-storage";
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

  get splittedCards(): MagicOwnedCard[] {
    const cards: MagicOwnedCard[] = [];
    this.cards.forEach(card => this.cardSplitter(card).forEach(c => cards.push(c)));
    return cards;
  }
}
