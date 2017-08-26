import {Component, Input} from '@angular/core';
import {MagicCard} from "../types/magic-card";

@Component({
  selector: 'app-card-display',
  templateUrl: 'card-display.component.html'
})
export class CardDisplayComponent {
  @Input() card: MagicCard;
}
