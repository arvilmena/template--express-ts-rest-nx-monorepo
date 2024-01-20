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
      'cookies',
    );
    this._puppeteerCookieStorage = new FileStorage(
      new LocalStorageAdapter(this._puppeteerCookieDirectory),
    );
    if (!this._puppeteerCookieStorage.fileExists(this._cookieFileName)) {
      this._puppeteerCookieStorage.write(
        this._cookieFileName,
        JSON.stringify({}, null, 2),
      );
    }
  }

  async getCookie(): Promise<Protocol.Network.CookieParam[] | null> {
    try {
      const contents = await this._puppeteerCookieStorage.readToString(
        this._cookieFileName,
      );
      if (!contents || contents.length === 0) return null;
      return JSON.parse(contents) as Protocol.Network.CookieParam[];
    } catch (error) {
      return null;
    }
  }

  async replaceCookie(cookies: Protocol.Network.Cookie[]) {
    await this._puppeteerCookieStorage.write(
      this._cookieFileName,
      JSON.stringify(cookies, null, 2),
    );
  }
}
