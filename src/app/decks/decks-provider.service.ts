import {Injectable} from "@angular/core";
import {MagicCompleteDeckInfo, MagicDeckInfo} from "../types/magic-deck-info";
import {LocalCollectionService, LocalStorage} from "../services/local-collection.service";
import {MagicDeck} from "../types/magic-deck";
import {DeckStorage} from "../types/deck-storage";
import {CardStorage} from "../types/card-storage";
import {MagicCard} from "../types/magic-card";
import {MagicOwnedCard} from "../types/magic-owned-card";
import {AuthService} from "../auth/auth.service";
import {CardsLoaderService, PartialData} from "../services/cards-loader.service";
import {OnlineCardStorage} from "../services/online-collection.service";
import {API_URL, BackendService, HEADERS} from "../services/backend.service";
import {Http, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class DecksProviderService {
  private _baseApiUrl = API_URL;
  private _decksUrl = this._baseApiUrl + "/decks";
  private _deckUrl = this._baseApiUrl + "/deck";
  constructor(private loader: CardsLoaderService, private auth: AuthService, private http: Http, private authHttp: AuthHttp) {}

  // Decks
  getDecks(username: string = null): Promise<MagicDeckInfo[]> {
    const url = (username === null) ? this._decksUrl : this._decksUrl + "/" + username;

    return (username == null ? this.authHttp : this.http)
      .get(url)
      .toPromise()
      .then(result => result.json() as MagicDeckInfo[]);
  }

  createDeck(name: string): Promise<string> {
    return this.authHttp
      .post(this._decksUrl, {name: name}, HEADERS)
      .toPromise()
      .then(result => result.json().objectId);
  }

  getDeck(id: string): Promise<MagicCompleteDeckInfo> {
    return (this.auth.isAuthenticated() ? this.authHttp : this.http)
      .get(this._deckUrl + "/" + id)
      .toPromise()
      .then(result => result.json() as MagicCompleteDeckInfo);
  }

  deleteDeck(id: string): Promise<Response> {
    return this.authHttp
      .delete(this._deckUrl + "/" + id)
      .toPromise();
  }

  updateDeck(id: string, request: DeckUpdateRequest): Promise<Response> {
    return this.authHttp.put(this._deckUrl + "/" + id, request, HEADERS).toPromise();
  }

  load(deck: MagicCompleteDeckInfo, modifiable = true): MagicDeck {
    // Build storage
    let storage: CardStorage;
    const cardStr = deck.cards ? deck.cards : null;
    const partData = this.loader.loadString(cardStr);

    if (this.auth.isUser(deck.username) && modifiable) {
      // Build a "local" storage
      storage = new LocalStorage(partData, "onlinedeck." + deck._id);
      storage.addChangeListener(st => {
        // Update in the cloud
        this.updateDeck(deck._id, {cards: st.toString()});
      });
    } else {
      // Build a "online" storage
      storage = new OnlineCardStorage(partData, deck.username, deck.lastChanged);
    }

    return new MagicDeck(deck, storage);
  }
}

export interface DeckUpdateRequest {
  cards?: string;
  name?: string;
  public?: boolean;
}
