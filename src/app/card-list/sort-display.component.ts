import {Component, Input} from '@angular/core';
import {CardFilter, NumericFilter} from "../types/card-filter";
import {Comparator, COMPARATORS, ReverseCriteria, SortCriteria} from "../types/sort";

@Component({
  selector: 'app-sort-display',
  templateUrl: 'sort-display.component.html'
})
export class SortDisplayComponent {
  display: false;
  @Input() comparator: Comparator;

  reverseClass(criteria: SortCriteria): string {
    return criteria instanceof ReverseCriteria ? "glyphicon glyphicon-sort-by-attributes" : "glyphicon glyphicon-sort-by-attributes-alt";
  }

  availableCriteria(): SortCriteria[] {
    return COMPARATORS.filter(c => !this.comparator.hasCriteria(c));
  }
}
