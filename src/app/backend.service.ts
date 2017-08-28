import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {AuthHttp} from "angular2-jwt";
import {BackendCollection} from "./types/backend-collection";

@Injectable()
export class BackendService {
  private _baseApiUrl = "https://magic.zyuiop.net/api";
  private _collectionUrl = this._baseApiUrl + "/collection";

  constructor(private http: Http, private authHttp: AuthHttp) {}

  getOwnCollection(): Promise<BackendCollection> {
    return this.authHttp
      .get(this._collectionUrl)
      .toPromise()
      .then(result => result.json() as BackendCollection);
  }

  getCollection(url: string): Promise<BackendCollection> {
    return this.http
      .get(this._collectionUrl + "/" + url)
      .toPromise()
      .then(result => {
        console.log(result);
        if (result.status !== 200) {
          console.log(result.status);
          return null;
        }
        return result.json() as BackendCollection;
      });
  }

  updateCollection(req: BackendUpdateRequest): void { // todo : return status
    this.authHttp.put(this._collectionUrl, req, {headers: new Headers({'Content-Type' : 'application/json'})}).toPromise();
  }
}

export interface BackendUpdateRequest {
  userCollection?: string;
  publicUrl?: string;
  public?: boolean;
}
