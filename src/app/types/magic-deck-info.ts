export class MagicDeckInfo {
  _id: string;
  name: string;
  lastChanged?: string;
  public? = false;
  username?: string;
}

export class MagicCompleteDeckInfo extends MagicDeckInfo {
  cards: string;
}
