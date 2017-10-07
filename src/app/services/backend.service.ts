import {Injectable} from '@angular/core';
import {Headers, Http, Response} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {AuthHttp} from "angular2-jwt";
import {BackendCollection} from "../types/backend-collection";
import {BackendProfile} from "../types/backend-profile";

export const API_URL = "https://magic.zyuiop.net/api";
/**
 * Provides mapping to the magic keeper backend
 */
@Injectable()
export class BackendService {
  private _baseApiUrl = API_URL;
  private _collectionUrl = this._baseApiUrl + "/collection";
  private _profileUrl = this._baseApiUrl + "/profile";


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
        return result.json() as BackendCollection;
      });
  }

  updateCollection(req: BackendUpdateRequest): Promise<Response> { // todo : return status
    return this.authHttp.put(this._collectionUrl, req, HEADERS).toPromise();
  }

  getOwnProfile(): Promise<BackendProfile> {
    return this.authHttp
      .get(this._profileUrl)
      .toPromise()
      .then(result => result.json() as BackendProfile);
  }

  getProfile(username: string): Promise<BackendProfile> {
    return this.http
      .get(this._profileUrl + "/" + username)
      .toPromise()
      .then(result => {
        return result.json() as BackendProfile;
      });
  }

  updateProfile(req: BackendProfileUpdateRequest): Promise<Response> { // todo : return status
    return this.authHttp.put(this._profileUrl, req, HEADERS).toPromise();
  }
}
export const HEADERS = {headers: new Headers({'Content-Type' : 'application/json'})};

export interface BackendUpdateRequest {
  userCollection?: string;
  public?: boolean;
}

export interface BackendProfileUpdateRequest {
  username?: string;
}
