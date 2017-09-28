// http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=W&type=symbol
// http://gatherer.wizards.com/Handlers/Image.ashx?size=medium&name=3&type=symbol

import { Pipe, PipeTransform } from '@angular/core';
import {proxy} from "../types/utils";

@Pipe({name: 'replacemana'})
export class ReplaceManaPipe implements PipeTransform {
  transform(value: string, size: string): string {
    if (!size) {
      size = "medium";
    }
    return value ? value.replace(/{([A-Z0-9/]{1,3})}/g, (u1, p1) => {
      p1 = (p1 === "T" ? "tap" : p1);
      p1 = p1.replace("/", "");
      return '<img src="' + proxy('http://gatherer.wizards.com/Handlers/Image.ashx?size=' + size + '&name=' + p1 + '&type=symbol') + '">';
    }) : value;
  }
}
