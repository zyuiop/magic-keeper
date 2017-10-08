import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {CardStorage} from "../types/card-storage";
import {Comparator, NumberCriteria, SortCriteria, TypeCriteria} from "../types/sort";
import {isUndefined} from "util";
import {proxy} from "../types/utils";

@Component({
  selector: 'app-deck-statistics',
  templateUrl: './deck-statistics.component.html'
})
export class DeckStatisticsComponent implements OnChanges {
  @Input() cards: MagicOwnedCard[];
  @ViewChild('cmcCanvas') cmcCanvasRef: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshCmcCanvas();
  }

  private refreshCmcCanvas() {
    const ctx: CanvasRenderingContext2D = this.cmcCanvasRef.nativeElement.getContext('2d');

    const width = ctx.canvas.width, height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);
    const bottomLabelSize = 15;
    const topLabelSize = 15;
    const availableHeight = height - bottomLabelSize - topLabelSize;
    const availableWidth = width;

    const cmcDist = this.cmcDist;
    let maxCost = 0, maxAmount = 0;
    cmcDist.forEach((amount: number, cost: number) => {
      if (amount > maxAmount) {
        maxAmount = amount;
      }
      if (cost > maxCost) {
        maxCost = cost;
      }
    });

    let i = 0;
    while (i <= maxCost) {
      if (!cmcDist.has(i)) {
        cmcDist.set(i, 0);
      }
      ++i;
    }

    const numberOfBars = 1 + maxCost; // Example : 8 to 0 ==> 9 bars
    const numberOfBarUnits = maxAmount;

    const barWidth = (availableWidth) / numberOfBars; // includes spacing !
    const barUnitHeight = (availableHeight) / numberOfBarUnits;

    ctx.fillStyle = "#618685";

    cmcDist.forEach((amount: number, cost: number) => {
      const barPosition = barWidth * cost;

      ctx.fillRect(barPosition, height - bottomLabelSize, (barWidth * 0.9), -amount * barUnitHeight);

      const costMsmt = ctx.measureText("" + cost);
      const amountMsmt = ctx.measureText("" + amount);

      ctx.fillText("" + cost, barPosition + barWidth * 0.45 - costMsmt.width / 2, height - 1);
      ctx.fillText("" + amount, barPosition + barWidth * 0.45 - amountMsmt.width / 2,
        height - bottomLabelSize - amount * barUnitHeight - 4);
    });
  }

  get colorDist(): TypeWrapper[] {
    const ret = new Map<string, number>();
    ret.set("U", 0);
    ret.set("B", 0);
    ret.set("R", 0);
    ret.set("G", 0);
    ret.set("W", 0);
    ret.set("X", 0);

    this.cards.filter(card => card.card.types[0] !== "Land").forEach(card => {
      if (card.card.colorIdentity) {
        card.card.colorIdentity.forEach(col => {
          if (!ret.has(col)) {
            ret.set(col, 1);
          } else {
            ret.set(col, ret.get(col) + 1);
          }
        });
      }
    });

    const retList: TypeWrapper[] = [];
    ret.forEach((val: number, key: string) => retList.push({name: key, amount: val}));

    return retList;
  }

  get cmcDist():  Map<number, number> {
    const ret = new Map<number, number>();
    this.cards.filter(card => card.card.types[0] !== "Land").forEach(card => {
      if (!ret.has(card.card.cmc)) {
        ret.set(card.card.cmc, 1);
      } else {
        ret.set(card.card.cmc, ret.get(card.card.cmc) + 1);
      }
    });

    return ret;
  }
}

class TypeWrapper {
  name: string;
  amount: number;
}
