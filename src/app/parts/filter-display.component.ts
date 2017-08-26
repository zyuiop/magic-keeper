import {Component, Input} from '@angular/core';
import {CardFilter, NumericFilter} from "../types/card-filter";

@Component({
  selector: 'app-filter-display',
  templateUrl: 'filter-display.component.html'
})
export class FilterDisplayComponent {
  display: false;
  @Input() filters: CardFilter<any>[];

  isNumeric(filter: CardFilter<any>): boolean {
    return filter instanceof NumericFilter;
  }

  numericFilter(filter: CardFilter<any>): NumericFilter {
    return filter as NumericFilter;
  }
}
