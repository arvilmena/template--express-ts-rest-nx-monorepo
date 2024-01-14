export function replaceAllOccurances(
  subject: string,
  needle: string,
  replaceWith: string,
): string {
  if (needle === '') return subject;
  return subject.replace(new RegExp(needle, 'g'), replaceWith);
}
