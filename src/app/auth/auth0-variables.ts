interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'blIFQqDwdYsi4no4NTQaE3Ld9nlBgZYa',
  domain: 'magic-keeper.eu.auth0.com',
  callbackURL: 'http://localhost:4200/callback'
};
