import { FileStorage } from '@flystorage/file-storage';
import { LocalStorageAdapter } from '@flystorage/local-fs';
import {
  SwsScreenerSpecificCrawlTypesType,
  SwsStockListSpecificCrawlTypesType,
} from '@myawesomeorg/constants';
import { luxonToManilaSqlFormat, slugify } from '@myawesomeorg/utils';
import { DateTime } from 'luxon';
import * as path from 'path';

type SaveSwsCrawlDataParamsType = { luxonDataAt: DateTime; data: object } & (
  | {
      crawlType: 'sws_stock_list';
      crawlTypeSpecific: SwsStockListSpecificCrawlTypesType;
    }
  | {
      crawlType: 'sws_screener';
      crawlTypeSpecific: SwsScreenerSpecificCrawlTypesType;
    }
  | {
      crawlType: 'sws_company';
      crawlTypeSpecific: string;
    }
);
interface CanSaveSwsCrawlData {
  saveSwsCrawlData({
    crawlType,
    crawlTypeSpecific,
  }: SaveSwsCrawlDataParamsType): Promise<void>;
}

export class DailyCrawlSwsDataFileSystem implements CanSaveSwsCrawlData {
  constructor(
    private readonly luxonDataAt: DateTime,
    private readonly dailyCrawlFileStorage: FileStorage,
  ) {}
  async saveSwsCrawlData({
    crawlType,
    crawlTypeSpecific,
    data,
  }: SaveSwsCrawlDataParamsType): Promise<void> {
    const _slugged = slugify(crawlTypeSpecific);
    const fileName =
      crawlType === 'sws_company' ? _slugged.toUpperCase() : _slugged;
    const destination = path.join(
      luxonToManilaSqlFormat(this.luxonDataAt),
      'simply-wall-street',
      crawlType,
      `${fileName}.json`,
    );

    return await this.dailyCrawlFileStorage.write(
      destination,
      JSON.stringify(data, null, 2),
    );
  }
}

export class DailyCrawlFileSystem {
  private _dailyCrawlFileStorage: FileStorage;
  private _dailyCrawlDirectory: string;

  public get dailyCrawlFileStorage(): FileStorage {
    return this._dailyCrawlFileStorage;
  }

  constructor(localRootDirectoryAbsPath: string) {
    this._dailyCrawlDirectory = path.join(
      localRootDirectoryAbsPath,
      'data',
      'daily-crawl',
    );
    this._dailyCrawlFileStorage = new FileStorage(
      new LocalStorageAdapter(this._dailyCrawlDirectory),
    );
  }

  createDailyCrawlSwsDataFileSystem(luxonDataAt: DateTime) {
    return new DailyCrawlSwsDataFileSystem(
      luxonDataAt,
      this._dailyCrawlFileStorage,
    );
  }
}
