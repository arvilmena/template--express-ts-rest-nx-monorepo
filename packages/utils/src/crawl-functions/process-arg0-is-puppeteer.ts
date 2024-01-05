export function processArg0IsPuppeteer(arg0: null | string) {
  if (!arg0 || !arg0.includes(".cache/puppeteer/chrome")) {
    return false;
  }
  return true;
}
