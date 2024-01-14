export function trimWordFromBeginning(subject: string, toTrim: string): string {
  if (subject.trim().startsWith(toTrim)) {
    return subject.trim().substring(toTrim.length).trimStart();
  } else {
    return subject;
  }
}
