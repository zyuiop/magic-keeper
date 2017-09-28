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

  constructor(public auth: AuthService, private backend: BackendService, private lib: LocalCollectionService) {
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.backend.getOwnCollection().then(c => {
        this.collection = c;
      });
    }
  }

  updatePrivacy(): void {
    if (this.collection) {
      this.sendingPrivacy = true;
      this.backend.updateCollection({public: this.collection.public}).then(r => this.sendingPrivacy = false);
    }
  }

  updateCollection(): void {
    const data: BackendUpdateRequest = {userCollection: this.myStorage.toString()};
    this.sent = false;
    this.sending = true;

    this.backend.updateCollection(data).then(r => {
      this.sent = true;
      this.sending = false;

      if (r.status === 200 || r.status === 201) {
        if (this.collection === null) {
          this.collection = new BackendCollection();
          this.collection.userCollection = data.userCollection;
        }
      }
    });
  }

  loadCollection(): void {
    this.lib.replace(this.collection.userCollection);
    this.myStorage = this.lib.load();
    this.myStorageChange.emit(this.myStorage);
  }

  get hasName(): boolean {
    return localStorage.getItem("username") !== null;
  }

  get name(): string {
    return localStorage.getItem("username");
  }
}
