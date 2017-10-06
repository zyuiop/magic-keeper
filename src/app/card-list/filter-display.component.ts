import {Component, Input} from '@angular/core';
import {CardFilter, NumericFilter, SelectFilter} from "../types/card-filter";

@Component({
  selector: 'app-filter-display',
  templateUrl: 'filter-display.component.html'
})
export class FilterDisplayComponent {
  @Input() filter: CardFilter<any>;

  get numeric(): boolean {
    return this.filter instanceof NumericFilter;
  }

  get select(): boolean {
    return this.filter instanceof SelectFilter;
  }

  get asNumeric(): NumericFilter {
    return this.filter as NumericFilter;
  }

  get asSelect(): SelectFilter {
    return this.filter as SelectFilter;
  }
}
