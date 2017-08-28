import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {BackendService, BackendUpdateRequest} from "../backend.service";
import {BackendCollection} from "../types/backend-collection";
import {AuthService} from "../auth/auth.service";
import {CardStorage} from "../card-storage";
import {LocalCollectionService} from "../local-collection.service";

@Component({
  selector: 'app-cloud-status',
  templateUrl: './cloud-status.component.html'
})
export class BackendTestComponent implements OnInit {
  @Input() myStorage: CardStorage;
  @Output() myStorageChange = new EventEmitter<CardStorage>();
  display: false;
  collection: BackendCollection;

  constructor(public auth: AuthService, private backend: BackendService, private lib: LocalCollectionService) {
  }

  ngOnInit(): void {
    this.backend.getOwnCollection().then(c => {
      this.collection = (c === null ? new BackendCollection() : c);
    });
  }

  updateCollection(): void {
    console.log(this.myStorage);
    console.log(this.myStorage.toString());
    const data: BackendUpdateRequest = {userCollection: this.myStorage.toString()};
    if (this.collection) {
      data.publicUrl = this.collection.publicUrl;
      data.public = this.collection.public;
    }
    this.backend.updateCollection(data);
  }

  loadCollection(): void {
    this.lib.replace(this.collection.userCollection);
    this.myStorage = this.lib.load();
    this.myStorageChange.emit(this.myStorage);
  }
}
