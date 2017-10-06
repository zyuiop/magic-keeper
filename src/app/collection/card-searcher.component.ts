import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MagicSet} from "../types/magic-set";
import {MagicApiService} from "../services/magic-api.service";
import {MagicCard} from "../types/magic-card";
import {CardProvider} from "../types/card-provider";
import {CardStorage} from "../types/card-storage";

@Component({
  selector: 'app-card-searcher',
  templateUrl: './card-searcher.component.html'
})

export class CardSearcherComponent implements OnInit {
  @ViewChild('cardNumber') numberField;
  @ViewChild('cardAmount') cardAmount;
  @Input() provider: CardProvider;
  @Input() library: CardStorage;

  sets: MagicSet[];       // A list of sets, provisioned when the component is ready
  set: string;            // The set of the card
  number: string;         // The number of the card
  amount: number;         // The amount
  amountFoil: number;     // The amount in foil cards
  message: string;        // The message to display on the top
  error: string;
  searching = false;
  currentCard: MagicCard; // The card found by the API (if any)

  constructor(private api: MagicApiService) {
    this.provider = api; // for now at least
  }

  ngOnInit(): void {
    this.api.getSets().then(res => {
      this.sets = res;
      this.sets.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  reset(): void {
    this.currentCard = null;
    this.error = null;
  }

  onSearch(): void {
    this.error = null;
    this.searching = true;
    this.api.searchCard(this.set, this.number).then(card => {
      this.searching = false;
      if (card === null) {
        this.error = "No card found with this data...";
      } else {
        this.currentCard = card;
        setTimeout(() => {
          this.cardAmount.nativeElement.focus();
          this.amount = null;
          this.amountFoil = null;
        }, 50);
      }
    }).catch(err => {
      this.error = "Error while searching : " + err;
      this.searching = false;
    });
  }

  onValidate(): void {
    this.number = null;
    this.error = null;
    if (isNaN(this.amount) || this.amount === null) {
      this.amount = 0;
    }

    if (isNaN(this.amountFoil) || this.amountFoil === null) {
      this.amountFoil = 0;
    }

    this.library.addCard(this.currentCard, this.amount, this.amountFoil);
    this.message = "Added : " + this.amount + " and " + this.amountFoil + " of card <b>" + this.currentCard.name + "</b>";
    this.amount = null;
    this.amountFoil = null;
    this.currentCard = null;
    // add card

    this.numberField.nativeElement.focus();
  }
}
