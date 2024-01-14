/// <reference types="astro/client" />

import { cleanFloatingNumber } from '@myawesomeorg/utils';

declare global {
  interface Number {
    toCleanFloatingNumber(): string;
  }
  interface BigInt {
    toJSON(): string;
  }
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

Number.prototype.toCleanFloatingNumber = function (this: number) {
  return cleanFloatingNumber(this);
};
