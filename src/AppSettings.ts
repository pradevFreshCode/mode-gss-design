import {environment} from './environments/environment';

export class AppSettings {
  public static getAPIUrl(relativePath): string {
    if (relativePath.indexOf('/') === 0) {
      return environment.apiUrl + relativePath;
    } else {
      return environment.apiUrl + '/' + relativePath;
    }
  }
}
