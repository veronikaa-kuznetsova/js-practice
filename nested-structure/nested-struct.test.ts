import { expect, test } from 'vitest';
import { mockData } from './mock-data';
import { expectData } from './expect-data';
import { parseStructure } from './parse';

test('parseStructure', () => {
  expect(parseStructure(mockData)).toStrictEqual(expectData);
});
