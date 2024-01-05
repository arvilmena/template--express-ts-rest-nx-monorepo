import { expect, test } from '@jest/globals';

type Items = {
  name: string;
  idPossiblyNotYetDefined: number | null;
};

test('currentItems should not be empty anymore', () => {
  const currentItems: Items[] = [];

  for (const i of [
    { name: 'A', idPossiblyNotYetDefined: null },
    { name: 'B1', idPossiblyNotYetDefined: 1 },
    { name: 'C2', idPossiblyNotYetDefined: 2 },
    { name: 'D', idPossiblyNotYetDefined: null },
  ]) {
    currentItems.push(i);
  }

  expect(currentItems).toEqual([
    { name: 'A', idPossiblyNotYetDefined: null },
    { name: 'B1', idPossiblyNotYetDefined: 1 },
    { name: 'C2', idPossiblyNotYetDefined: 2 },
    { name: 'D', idPossiblyNotYetDefined: null },
  ]);
});

test('currentItems elements can be modified', () => {
  const currentItems: Items[] = [];

  for (const i of [
    { name: 'A', idPossiblyNotYetDefined: null },
    { name: 'B1', idPossiblyNotYetDefined: 1 },
    { name: 'C2', idPossiblyNotYetDefined: 2 },
    { name: 'D', idPossiblyNotYetDefined: null },
  ]) {
    currentItems.push(i);
  }

  for (const i of currentItems) {
    if (i.name === 'D') i.idPossiblyNotYetDefined = 999999;
  }

  expect(currentItems).toEqual([
    { name: 'A', idPossiblyNotYetDefined: null },
    { name: 'B1', idPossiblyNotYetDefined: 1 },
    { name: 'C2', idPossiblyNotYetDefined: 2 },
    { name: 'D', idPossiblyNotYetDefined: 999999 },
  ]);
});
