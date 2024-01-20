export function getJsObjectFromString(html: string): string | undefined {
  const start = html.indexOf('{');
  const end = html.lastIndexOf('}');

  if (start !== -1 && end !== -1 && start < end) {
    return html.slice(start, end + 1);
  }

  // Return undefined if the structure is not found
  return undefined;
}
