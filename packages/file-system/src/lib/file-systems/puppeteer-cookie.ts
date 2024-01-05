import { FileStorage } from '@flystorage/file-storage';
import { LocalStorageAdapter } from '@flystorage/local-fs';
import * as path from 'path';
import { Protocol } from 'puppeteer';

export class PuppeteerCookie {
  private _puppeteerCookieStorage: FileStorage;
  private _puppeteerCookieDirectory: string;
  private _cookieFileName = 'cookies.json';
  constructor(localRootDirectoryAbsPath: string) {
    this._puppeteerCookieDirectory = path.join(
      localRootDirectoryAbsPath,
      'data',
      'puppeteer',
      'cookies'
    );
    this._puppeteerCookieStorage = new FileStorage(
      new LocalStorageAdapter(this._puppeteerCookieDirectory)
    );
  }

  async getCookie(): Promise<Protocol.Network.CookieParam[]> {
    const contents = await this._puppeteerCookieStorage.readToString(
      this._cookieFileName
    );
    return JSON.parse(contents);
  }

  async replaceCookie(cookies: Protocol.Network.Cookie[]) {
    await this._puppeteerCookieStorage.write(
      this._cookieFileName,
      JSON.stringify(cookies, null, 2)
    );
  }
}
