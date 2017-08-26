import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'rarityLabel'})
export class RarityPipe implements PipeTransform {
  transform(value: string): string {
    let labelClass = "label-info";

    switch (value) {
      case "Common":
        labelClass = "label-default";
        break;
      case "Uncommon":
        labelClass = "label-success";
        break;
      case "Rare":
        labelClass = "label-warning";
        break;
      case "Mythic Rare":
        labelClass = "label-danger";
        break;
      case "Special":
        labelClass = "label-info";
        break;
    }

    return labelClass;
  }
}
