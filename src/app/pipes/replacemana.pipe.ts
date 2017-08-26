// http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=W&type=symbol
// http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=3&type=symbol

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'replacemana'})
export class ReplaceMana implements PipeTransform {
  transform(value: string, size: string): string {
    if (!size) {
      size = "medium";
    }
    return value ? value.replace(/{([A-Z0-9])}/g, '<img src="http://gatherer.wizards.com/Handlers/Image.ashx?size=' + size + '&name=$1&type=symbol">') : value;
  }
}
