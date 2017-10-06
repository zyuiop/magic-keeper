import {Injectable, OnInit} from "@angular/core";
import {BackendService, BackendUpdateRequest} from "./backend.service";
import {LocalStorage} from "./local-collection.service";
import {AuthService} from "../auth/auth.service";
import {CardStorage} from "../types/card-storage";

@Injectable()
export class CloudSaverService {


  constructor(private backend: BackendService, private auth: AuthService) {
    this.backend.getOwnCollection().then(col => {
      if (this._onlineLastRevision === null) {
        this._onlineLastRevision = col.revision;
      }
    });
  }

  private _status = NetworkStatus.IDLE;
  private _onlineLastRevision: string = null;

  get status() {
    return this._status;
  }

  updateCollection(storage: CardStorage): Promise<UpdateResponse> {
    if (!this.canUpdate()) {
      return Promise.resolve(null);
    }

    // Compute the storage string and update the status
    const data: BackendUpdateRequest = { userCollection: storage.toString() };
    this._status = NetworkStatus.SENDING;

    // Send the collection update
    return this.backend.updateCollection(data)
      .then(r => {
        if (r.ok) {
          const update = r.json().update as UpdateResponse;
          this.lastRevision = update.revision;
          this.lastSaved = update.lastChanged;
          this._onlineLastRevision = update.revision;
          this._status = NetworkStatus.SENT;
          return update;
        }
        return null;
      });
  }

  refreshOnlineLastRevision() {
    this.backend.getOwnCollection().then(col => this._onlineLastRevision = col.revision);
  }

  /**
   * The last revision UUID is used to check if the client is up to date with the server
   * @param {string} revision
   */
  set lastRevision(revision: string) {
    localStorage.setItem("cards.lastRevision", revision);
  }

  get lastRevision() {
    return localStorage.getItem("cards.lastRevision");
  }

  /**
   * The last saved date is used to check if the server is up to date with the client
   * @param {Date} lastSaved
   */
  set lastSaved(lastSaved: Date) {
    localStorage.setItem("cards.lastSync", lastSaved.toString());
  }

  get lastSaved(): Date {
    const last = localStorage.getItem("cards.lastSync");
    if (last === null) {
      return null;
    }

    return new Date(last);
  }

  autoSave(storage: CardStorage): Promise<UpdateResponse> {
    if (this.autosave && !this.isRemoteOutdated(storage)) {
      return this.updateCollection(storage);
    }
    return Promise.resolve(null);
  }

  get autosave(): boolean {
    return localStorage.getItem("autosave") === "true";
  }

  set autosave(as: boolean) {
    localStorage.setItem("autosave", as ? "true" : "false");
  }

  /**
   * Checks whether a given localStorage is more recent than the online copy of it
   * @param {LocalStorage} localStorage the storage to check
   * @returns {boolean} true if the online copy is outdated, false if it is up to date
   */
  isRemoteOutdated(localStorage: CardStorage): boolean {
    const lastSaved = this.lastSaved;

    if (!lastSaved) {
      return true; // Never saved
    }

    const lastUpdate = localStorage.lastChange();
    return new Date(lastUpdate).getTime() > lastSaved.getTime() + 500; // The last time we saved is older than the last time we edited
  }

  /**
   * Checks whether the current storage is older (or different, at least)
   * @returns {boolean}
   */
  isLocalOutdated(): boolean {
    return this.lastRevision === null || this.lastRevision !== this._onlineLastRevision;
  }

  private canUpdate(): boolean {
    return this.auth.isAuthenticated() && localStorage.getItem("username") !== null;
  }
}

export enum NetworkStatus {
  IDLE,
  SENDING,
  SENT
}

export class UpdateResponse {
  revision: string; // The UUID revision
  lastChanged: Date; // The lastchange date
}
