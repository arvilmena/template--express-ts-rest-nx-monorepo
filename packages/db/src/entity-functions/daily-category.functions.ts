import { DailyCategoryFindManyReturnType } from '../repositories/daily-category.repository';

const SOURCE_TO_HUMAN_READABLE = {
  pse: 'PSE',
  investa: 'Investa',
  sws: 'Simply Wall Street',
};

const regex = /_\d+$/; // Match an underscore followed by one or more digits at the end
export function dailyCategoryToHumanReadable(
  category: Pick<
    NonNullable<DailyCategoryFindManyReturnType[0]>,
    'name' | 'source'
  >,
  appendSource = true
) {
  let name = category.name;
  if (category.source === 'sws') name = category.name.replace(regex, '');
  if (appendSource) {
    return `${name} - (${
      SOURCE_TO_HUMAN_READABLE[category.source] ?? category.source.toUpperCase()
    })`;
  }
  return name;
}
