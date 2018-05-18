// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  assets_dir: '/assets/',
  api_url: 'http://api.gosweetspot.com/api/',
  agm_key: 'AIzaSyDCvpg954JraP5HVSncoIA_FNIcKwLOGGY',
  stripe_pk_key: 'pk_test_nKiObmbzObQwdu0Yjqq3Tz2H',
  stripe_sk_key: 'sk_test_Np3ugz2TvTNyFtgiITM8lNQf',
  stripe_api_url: 'https://api.stripe.com/v1/charges',
  return_charge: 5.5,

  //ToDo : replace with development api url, if exist
  apiUrl: 'http://localhost'
};
