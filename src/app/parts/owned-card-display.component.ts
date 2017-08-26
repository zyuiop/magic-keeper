import {Component, Input} from '@angular/core';
import {MagicOwnedCard} from "../types/magic-owned-card";

@Component({
  selector: 'app-owned-card-display',
  templateUrl: 'owned-card-display.component.html'
})
export class OwnedCardDisplayComponent {
  @Input() card: MagicOwnedCard;
}
