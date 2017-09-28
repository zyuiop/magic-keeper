import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {BackendService, BackendUpdateRequest} from "../services/backend.service";
import {BackendCollection} from "../types/backend-collection";
import {AuthService} from "../auth/auth.service";
import {CardStorage} from "../services/card-storage";
import {LocalCollectionService} from "../services/local-collection.service";

@Component({
  selector: 'app-cloud-status',
  templateUrl: './cloud-status.component.html'
})
export class CloudStatusComponent implements OnInit {
  @Input() myStorage: CardStorage;
  @Output() myStorageChange = new EventEmitter<CardStorage>();
  display = false;
  collection: BackendCollection;
  sending = false;
  sendingPrivacy = false;
  sent = false;

  static reloadBackend(comp: CloudStatusComponent): Promise<void> {
    if (comp.auth.isAuthenticated()) {
      return comp.backend.getOwnCollection().then(c => {
        comp.collection = c;
        console.log("chapo");
      });
    }
    return Promise.resolve(null);
  }

  constructor(public auth: AuthService, private backend: BackendService, private lib: LocalCollectionService) {
  }

  ngOnInit(): void {
    CloudStatusComponent.reloadBackend(this);
    this.myStorage.addChangeListener(() => this.autoUpdate());

    if (this.notSaved) {
      this.autoUpdate();
    }
  }

  updatePrivacy(): void {
    if (this.collection) {
      this.sendingPrivacy = true;
      this.backend.updateCollection({public: this.collection.public})
        .then(r => this.sendingPrivacy = false)
        .then(() => { CloudStatusComponent.reloadBackend(this); });
    }
  }

  updateCollection(): void {
    const data: BackendUpdateRequest = {userCollection: this.myStorage.toString()};
    this.sent = false;
    this.sending = true;

    this.backend.updateCollection(data).then(r => {
      if (r.status === 200 || r.status === 201) {
        if (this.collection === null) {
          this.collection = new BackendCollection();
          this.collection.userCollection = data.userCollection;
        }
      }
    }).then(() => { return CloudStatusComponent.reloadBackend(this); }).then(() => {
      console.log("poupou");
      this.sent = true;
      this.sending = false;
      this.lastLoad = new Date(this.collection.lastChanged);
    });
  }

  autoUpdate() {
    if (this.autosave && !this.outdated) {
      this.updateCollection();
    }
  }

  loadCollection(): void {
    CloudStatusComponent.reloadBackend(this).then(() => {
      this.lib.replace(this.collection.userCollection);
      this.myStorage = this.lib.load();
      this.myStorage.addChangeListener(() => this.autoUpdate());
      this.myStorageChange.emit(this.myStorage);
      this.lastLoad = new Date(this.collection.lastChanged);
    });
  }

  get outdated(): boolean {
    const lastLoad = this.lastLoad;

    if (!this.collection || !lastLoad) {
      return true;
    }

    const lastUpdate = this.collection.lastChanged;
    return new Date(lastUpdate).getTime() > lastLoad.getTime() + 5000;
  }

  get notSaved(): boolean {
    if (!this.myStorage.lastChange()) {
      return false;
    }

    if (!this.collection) {
      return true;
    }

    const lastRemote = this.collection.lastChanged;
    const lastLocal = this.myStorage.lastChange();
    return new Date(lastRemote).getTime() < lastLocal.getTime();
  }

  get lastLoad(): Date {
    const last = localStorage.getItem("cards.lastSync");
    if (last === null) {
      return null;
    }

    return new Date(last);
  }

  get backendLastUpdate(): Date {
    if (!this.collection) {
      return null;
    }

    return new Date(this.collection.lastChanged);
  }

  set lastLoad(lastLoad: Date) {
    localStorage.setItem("cards.lastSync", lastLoad.toString());
  }

  get hasName(): boolean {
    return localStorage.getItem("username") !== null;
  }

  get name(): string {
    return localStorage.getItem("username");
  }

  get autosave(): boolean {
    return localStorage.getItem("autosave") === "true";
  }

  set autosave(as: boolean) {
    localStorage.setItem("autosave", as ? "true" : "false");
  }

  toggleAutosave() {
    this.autosave = !this.autosave;
  }
}
