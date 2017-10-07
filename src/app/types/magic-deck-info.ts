export class MagicDeckInfo {
  _id: string;
  name: string;
  lastChanged?: string;
  public? = false;
  username?: string;
}

export class MagicDeckSnapshot {
  name: string;
  date: string;
  cards: string;
  lands?: Map<string, number>;
}

export class MagicCompleteDeckInfo extends MagicDeckInfo {
  cards: string;
  lands?: Map<string, number> = new Map();
  snapshots: MagicDeckSnapshot[] = [];
}
