import {Component, Input} from '@angular/core';
import {MagicCard} from "../types/magic-card";

@Component({
  selector: 'app-card-summary',
  templateUrl: 'card-summary.component.html'
})
export class CardSummaryComponent {
  @Input() card: MagicCard;
  @Input() reducedInfo = false;
}
