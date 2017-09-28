import {NgModule} from "@angular/core";
import {Http, RequestOptions} from "@angular/http";
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import {AuthRoutingModule} from "./auth-routing.module";


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({tokenName: "access_token"}), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  imports: [AuthRoutingModule]
})
export class AuthModule {}
