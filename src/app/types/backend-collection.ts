
export class BackendCollection {
  username?: string;

  userCollection: string;
  lastChanged: string;
  revision: string; // The UUID of the last revision

  public = false;
}
