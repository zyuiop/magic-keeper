import {Component, Input} from '@angular/core';
import {CardFilter, NumericFilter, SelectFilter} from "../types/card-filter";

@Component({
  selector: 'app-filters-display',
  templateUrl: 'filters-display.component.html'
})
export class FiltersDisplayComponent {
  display = false;
  @Input() filters: CardFilter<any>[];
  @Input() activeFilters: Map<string, CardFilter<any>[]>;
}
