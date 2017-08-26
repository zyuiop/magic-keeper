export class MagicCard {
  name: string;
  names: string[]; // for split cards
  manaCost: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  flavor: string;
  type: string;
  supertypes: string[];
  types: string[];
  subtypes: string[];
  rarity: string[];
  set: string;
  setName: string;
  text: string;
  // artist
  number: string;
  power: string;
  toughness: string;
  layout: string;
  multiverseid: number;
  imageUrl: string;
  rulings: Ruling[];
}

export class Ruling {
  date: string;
  text: string;
}
