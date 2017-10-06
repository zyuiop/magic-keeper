import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {BackendService, BackendUpdateRequest} from "../services/backend.service";
import {BackendCollection} from "../types/backend-collection";
import {AuthService} from "../auth/auth.service";
import {CardStorage} from "../types/card-storage";
import {LocalCollectionService} from "../services/local-collection.service";
import {CloudSaverService, NetworkStatus} from "../services/cloud-saver.service";

@Component({
  selector: 'app-cloud-status',
  templateUrl: './cloud-status.component.html'
})
export class CloudStatusComponent implements OnInit {
  @Input() myStorage: CardStorage;
  @Output() myStorageChange = new EventEmitter<CardStorage>();
  display = false;
  backendVersion: BackendCollection;
  sendingPrivacy = false;

  constructor(public auth: AuthService, private backend: BackendService, private lib: LocalCollectionService,
              public saver: CloudSaverService) {}

  ngOnInit(): void {
    this.saver.autoSave(this.myStorage) // We try to autosave if the backed up data is too old
      .then(() => this.reloadBackend()); // Whatever happens, we load the remote data
  }

  get outdated(): boolean {
    return this.saver.isLocalOutdated();
  }

  get notSaved(): boolean {
    return this.saver.isRemoteOutdated(this.myStorage);
  }

  get sending() {
    return this.saver.status === NetworkStatus.SENDING;
  }

  get sent() {
    return this.saver.status === NetworkStatus.SENT;
  }

  reloadBackend(): Promise<void> {
    if (this.auth.isAuthenticated()) {
      return this.backend.getOwnCollection().then(c => {
        this.backendVersion = c;
      });
    }
    return Promise.resolve(null);
  }

  updatePrivacy(): void {
    if (this.backendVersion) {
      this.sendingPrivacy = true;
      this.backend.updateCollection({public: this.backendVersion.public})
        .then(r => this.sendingPrivacy = false);
    }
  }

  loadCollection(): void {
    this.reloadBackend().then(() => {
      this.lib.replace(this.backendVersion.userCollection);
      this.myStorage = this.lib.load();
      this.myStorageChange.emit(this.myStorage);

      this.saver.lastRevision = this.backendVersion.revision;
    });
  }

  get hasName(): boolean {
    return localStorage.getItem("username") !== null;
  }

  get name(): string {
    return localStorage.getItem("username");
  }
}
