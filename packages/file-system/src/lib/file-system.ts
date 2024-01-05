import { FileStorage } from '@flystorage/file-storage';
import { LocalStorageAdapter } from '@flystorage/local-fs';
import * as path from 'path';
import { PuppeteerCookie } from './file-systems/puppeteer-cookie';
export * from './file-systems/daily-crawl-files';

export class FileSystem {
  private _puppeteerCookie: PuppeteerCookie;
  private _simplyWallStreetDataStorage: FileStorage;
  private _puppeteerUserDataDir: string;

  constructor(localRootDirectoryAbsPath: string) {
    this._puppeteerCookie = new PuppeteerCookie(localRootDirectoryAbsPath);

    this._puppeteerUserDataDir = path.join(
      localRootDirectoryAbsPath,
      'data',
      'puppeteer',
      'chrome-user-data-dir'
    );

    this._simplyWallStreetDataStorage = new FileStorage(
      new LocalStorageAdapter(
        path.join(localRootDirectoryAbsPath, 'data', 'simply-wall-street')
      )
    );
  }

  public get puppeteerUserDataDir(): string {
    return this._puppeteerUserDataDir;
  }

  public get puppeteerCookie(): PuppeteerCookie {
    return this._puppeteerCookie;
  }

  public get simplyWallStreetDataStorage(): FileStorage {
    return this._simplyWallStreetDataStorage;
  }
}
